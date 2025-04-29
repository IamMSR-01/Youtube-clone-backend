import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { UserCircle2, LogIn } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log("User", user, isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 text-white shadow-md py-4 px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-400 tracking-wider hover:scale-105 transition duration-300"
        >
          VideoTube
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6 text-sm font-medium flex items-center">
          <Link to="/" className="hover:text-yellow-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-yellow-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">
            Contact
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={`/profile/${user?._id}`}
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <UserCircle2 size={20} />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 bg-yellow-400 text-black px-4 py-1.5 rounded-full hover:bg-yellow-300 transition hover:scale-105"
              >
                <LogIn size={18} />
                <span className="font-semibold">Login</span>
              </Link>
              <Link
                to="/register"
                className="text-white border border-yellow-400 rounded-full px-4 py-1.5 hover:bg-yellow-300 hover:text-black transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
