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
    { to: "/analysis/analyze", text: "New Analysis", icon: <ChartBarIcon className="w-6 h-6" /> },
    { to: "/analysis/history", text: "History", icon: <ClockIcon className="w-6 h-6" /> },
    { to: "/admin", text: "Admin", icon: <ShieldCheckIcon className="w-6 h-6" />, adminOnly: true },
  ];

  const visibleLinks = navLinks.filter(link => !link.adminOnly || user?.role === "admin");

  // pixel widths for Tailwind's w-20 and w-64
  const sidebarWidthPx = collapsed ? 80 : 256;

  return (
    <>
      {/* Fixed sidebar so main content can always occupy remaining viewport area */}
      <aside
        aria-label="Sidebar"
        style={{ width: sidebarWidthPx, transition: "width 200ms ease" }}
        className={`fixed left-0 top-0 bottom-0 bg-indigo-800 text-indigo-100 flex flex-col shadow-lg z-20`}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-indigo-700 flex-shrink-0">
          {!collapsed && <span className="font-bold text-2xl tracking-wider"><a href="/">SnowGuard</a></span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="text-2xl">{collapsed ? "→" : "←"}</span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2 p-4 overflow-auto" aria-label="Primary navigation">
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

        <div className="p-4 border-t border-indigo-700 flex flex-col gap-2 flex-shrink-0">
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

      {/* Main content: margin-left changes to match sidebar width so it always fills the viewport */}
      <main
        style={{
          marginLeft: sidebarWidthPx,
          width: `calc(100vw - ${sidebarWidthPx}px)`, // use viewport width to avoid parent centering/gap
          minHeight: "100vh",
          transition: "margin-left 200ms ease, width 200ms ease",
          boxSizing: "border-box",
        }}
        className="bg-gray-50 p-6 lg:p-10 overflow-auto"
      >
        <Outlet />
      </main>
    </>
  );
}
