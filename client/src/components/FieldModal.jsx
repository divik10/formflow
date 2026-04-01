import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FIELD_TYPES = [
  { label: "Text", value: "text" },
  { label: "Feedback", value: "feedback" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Rating", value: "rating" },
  { label: "NPS", value: "nps" },
];

const getInitialState = (field) => ({
  id: field?.id || `field_${Date.now()}`,
  type: field?.type || "text",
  label: field?.label || "",
  placeholder: field?.placeholder || "",
  required: field?.required || false,
  options: field?.options?.join("\n") || "",
});

const FieldModal = ({ isOpen, onClose, onSave, editingField }) => {
  const [field, setField] = useState(getInitialState(editingField));

  useEffect(() => {
    if (isOpen) {
      setField(getInitialState(editingField));
    }
  }, [editingField, isOpen]);

  const needsOptions = field.type === "dropdown" || field.type === "checkbox";
  const supportsPlaceholder = field.type === "text" || field.type === "feedback";

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...field,
      options: needsOptions
        ? field.options
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {editingField ? "Edit Field" : "Add Field"}
              </h3>
              <button type="button" onClick={onClose} className="text-sm text-textDim">
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="text-textDim">Field Type</span>
                <select
                  value={field.type}
                  onChange={(event) => setField((current) => ({ ...current, type: event.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                >
                  {FIELD_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-textDim">Label</span>
                <input
                  value={field.label}
                  onChange={(event) => setField((current) => ({ ...current, label: event.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  placeholder="How was your experience?"
                  required
                />
              </label>

              {supportsPlaceholder && (
                <label className="grid gap-2 text-sm">
                  <span className="text-textDim">Placeholder</span>
                  <input
                    value={field.placeholder}
                    onChange={(event) =>
                      setField((current) => ({ ...current, placeholder: event.target.value }))
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                    placeholder="Add a placeholder"
                  />
                </label>
              )}

              {needsOptions && (
                <label className="grid gap-2 text-sm">
                  <span className="text-textDim">Options (one per line)</span>
                  <textarea
                    value={field.options}
                    onChange={(event) => setField((current) => ({ ...current, options: event.target.value }))}
                    className="min-h-32 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                    placeholder={"Excellent\nGood\nNeeds work"}
                  />
                </label>
              )}

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(event) =>
                    setField((current) => ({ ...current, required: event.target.checked }))
                  }
                />
                Required field
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
              >
                Save Field
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FieldModal;
