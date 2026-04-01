import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const baseClass =
    "rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200";

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-cardAlt/80 p-5 shadow-glow backdrop-blur lg:sticky lg:top-6 lg:w-72 lg:self-start">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">FormFlow</p>
        <h1 className="mt-3 text-2xl font-bold text-white">Widget Platform</h1>
        <p className="mt-2 text-sm text-textDim">{user?.email}</p>
      </div>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-accent text-white shadow-glow" : "bg-white/5 text-textDim hover:bg-white/10 hover:text-white"}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/forms/new"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-accent text-white shadow-glow" : "bg-white/5 text-textDim hover:bg-white/10 hover:text-white"}`
          }
        >
          Create Form
        </NavLink>
      </nav>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={logout}
        className="mt-8 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Logout
      </motion.button>
    </aside>
  );
};

export default Sidebar;
