import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
            <Link to="/" className="text-lg font-bold">SnowGuard</Link>
            <div className="space_x-4">
                {user ? (
                    <>
                        <Link to="/profile" className="hover:underline">Profile</Link>
                        <Link to="/analysis/history" className="hover:underline">History</Link>
                        {user.role === "admin" && (
                            <Link to ="/admin" className="hover:underline">Admin</Link>
                        )}
                        <button onClick={logout} className="hover:underline">Logout</button>
                    </>
                ): (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}