import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser, type User } from "../../services/auth";

export default function ProfilePage() {
  const { token, setUserState } = useAuth(); // use setUserState to update context
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;
      setLoading(true);
      try {
        const currentUser: User = await getCurrentUser(token);
        setEmail(currentUser.email);
        setUsername(currentUser.username);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password: password || undefined, // send password only if changed
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser: User = await res.json();
      setUserState?.(updatedUser); // instantly update context

      setSuccess("Profile updated successfully!");
      setPassword(""); // clear password field
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to update profile");
    }
  };

  if (loading)
    return (
      <div className="max-w-xl mx-auto p-6 mt-10 text-center">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {success && <p className="mb-4 text-green-600">{success}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password (leave blank to keep current)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
