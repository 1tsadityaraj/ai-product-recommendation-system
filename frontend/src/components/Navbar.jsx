import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-6 py-5 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="text-3xl">🤖</div>
          <h1 className="text-2xl font-bold tracking-tight">
            AI Product Recommendation
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/wishlist"
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition ${
              location.pathname === "/wishlist"
                ? "bg-white/30"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            <span className="text-xl">❤️</span>
            <span className="text-sm font-medium">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {wishlist.length}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium">👤 {user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition backdrop-blur-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition backdrop-blur-sm"
            >
              Login
            </Link>
          )}
          
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-sm font-medium">✨ Smart Shopping</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
  