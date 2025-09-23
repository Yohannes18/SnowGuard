import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { SpinnerIcon, PromoteIcon, DemoteIcon, DeactivateIcon } from "../../components/Icons";
import Card from "../../components/Cards";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<User[]>("http://127.0.0.1:8000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  const handleAction = async (userId: string, action: "promote" | "demote" | "deactivate") => {
    if (!token) return;
    setActionLoading(userId);
    try {
      await axios.post(
        `http://127.0.0.1:8000/admin/users/${userId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: action === "promote" ? "admin" : action === "demote" ? "user" : u.role }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} user.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Card className="p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <SpinnerIcon className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 text-center">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Username</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created At</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{u.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{u.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{u.username}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{u.role}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{new Date(u.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        disabled={actionLoading === u.id || u.role === "admin"}
                        onClick={() => handleAction(u.id, "promote")}
                        className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
                      >
                        <PromoteIcon className="w-4 h-4" />
                        Promote
                      </button>
                      <button
                        disabled={actionLoading === u.id || u.role === "user"}
                        onClick={() => handleAction(u.id, "demote")}
                        className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition"
                      >
                        <DemoteIcon className="w-4 h-4" />
                        Demote
                      </button>
                      <button
                        disabled={actionLoading === u.id}
                        onClick={() => handleAction(u.id, "deactivate")}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition"
                      >
                        <DeactivateIcon className="w-4 h-4" />
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
