import { useState, useCallback } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from "./Icons";

export default function Layout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const navLinks = [
    { to: "/profile", text: "Profile", icon: <UserCircleIcon className="w-6 h-6" /> },
    { to: "/analysis/new", text: "New Analysis", icon: <ChartBarIcon className="w-6 h-6" /> },
    { to: "/analysis/history", text: "History", icon: <ClockIcon className="w-6 h-6" /> },
    { to: "/admin", text: "Admin", icon: <ShieldCheckIcon className="w-6 h-6" />, adminOnly: true },
  ];

  const visibleLinks = navLinks.filter(link => !link.adminOnly || user?.role === "admin");

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-indigo-800 text-indigo-100 flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-indigo-700">
          {!collapsed && <span className="font-bold text-2xl tracking-wider">SnowGuard</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo"
          >
            <span className="text-2xl">{collapsed ? "→" : "←"}</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2 p-4">
          {visibleLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-indigo-900 text-white shadow-inner" : "hover:bg-indigo-700"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {link.icon}
              {!collapsed && <span className="font-medium">{link.text}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Links: Logout or Login/Register */}
        <div className="p-4 border-t border-indigo-700 flex flex-col gap-2">
          {user ? (
            <button
              onClick={handleLogout}
              className={`flex items-center gap-4 w-full p-3 rounded-lg bg-red-500 hover:bg-red-600 transition-colors duration-200 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={`flex items-center gap-4 w-full p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                {!collapsed && <span className="font-medium text-indigo-200 hover:text-white">Login</span>}
              </NavLink>
              <NavLink
                to="/register"
                className={`flex items-center gap-4 w-full p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                {!collapsed && <span className="font-medium text-indigo-200 hover:text-white">Register</span>}
              </NavLink>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
