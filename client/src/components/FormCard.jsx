import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FormCard = ({ form, onDelete, onDuplicate, onToggle }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(139,92,246,0.18)" }}
      className="rounded-2xl border border-white/10 bg-cardAlt/90 p-5 shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{form.title}</h3>
          <p className="mt-2 text-sm text-textDim">
            Created {new Date(form.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => onToggle(form)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            form.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
          }`}
        >
          {form.isActive ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-white/5 p-4 text-sm text-textDim">
        <div>
          <p className="text-xs uppercase tracking-wide">Submissions</p>
          <p className="mt-1 text-lg font-semibold text-white">{form.submissionCount || 0}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide">Fields</p>
          <p className="mt-1 text-lg font-semibold text-white">{form.fields?.length || 0}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link className="rounded-xl bg-accent px-4 py-2 text-center text-sm font-medium text-white" to={`/forms/${form._id}/edit`}>
          Edit
        </Link>
        <button
          onClick={() => onDuplicate(form._id)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
        >
          Duplicate
        </button>
        <Link
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-white"
          to={`/forms/${form._id}/submissions`}
        >
          View Submissions
        </Link>
        <Link
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-white"
          to={`/forms/${form._id}/analytics`}
        >
          View Analytics
        </Link>
      </div>

      <button
        onClick={() => onDelete(form._id)}
        className="mt-3 w-full rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200"
      >
        Delete
      </button>
    </motion.div>
  );
};

export default FormCard;
