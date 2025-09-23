import { NavLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
     
      <h1 className="text-8xl font-extrabold text-indigo-600 animate-bounce mb-4">
        404
      </h1>
      <p className="text-xl text-gray-700 mb-6 text-center">
        Oops! The page you are looking for doesn’t exist.
      </p>

      <img
        src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
        alt="Page not found"
        className="w-64 h-64 mb-6"
      />

      <NavLink
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
      >
        Go Home
      </NavLink>
    </div>
  );
}
