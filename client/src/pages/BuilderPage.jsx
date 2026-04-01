import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import PageContainer from "../components/PageContainer";
import FieldModal from "../components/FieldModal";
import WidgetPreview from "../components/WidgetPreview";

const emptyForm = {
  title: "",
  description: "",
  fields: [],
  appearance: {
    themeColor: "#8b5cf6",
    font: "Inter",
    position: "floating",
    submitButtonLabel: "Submit",
  },
  isActive: true,
  maxSubmissions: "",
};

const fonts = ["Inter", "Poppins", "DM Sans", "Manrope"];

const BuilderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchForm = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/forms/${id}`);
        setFormData({
          ...data,
          maxSubmissions: data.maxSubmissions ?? "",
          appearance: {
            themeColor: data.appearance?.themeColor || "#8b5cf6",
            font: data.appearance?.font || "Inter",
            position: data.appearance?.position || "floating",
            submitButtonLabel: data.appearance?.submitButtonLabel || "Submit",
          },
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load form");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, isEditMode, navigate]);

  const embedCode = useMemo(() => {
    if (!formData._id) {
      return "";
    }
    return `<script src="http://localhost:5000/widget.js" data-form-id="${formData._id}"></script>`;
  }, [formData._id]);

  const updateAppearance = (key, value) => {
    setFormData((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        [key]: value,
      },
    }));
  };

  const handleSaveField = (field) => {
    if (!field.label.trim()) {
      toast.error("Field label is required");
      return;
    }

    if ((field.type === "dropdown" || field.type === "checkbox") && !field.options.length) {
      toast.error("Add at least one option");
      return;
    }

    setFormData((current) => {
      const exists = current.fields.some((item) => item.id === field.id);
      return {
        ...current,
        fields: exists
          ? current.fields.map((item) => (item.id === field.id ? field : item))
          : [...current.fields, field],
      };
    });

    setModalOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId) => {
    setFormData((current) => ({
      ...current,
      fields: current.fields.filter((field) => field.id !== fieldId),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Form title is required");
      return;
    }

    if (!formData.fields.length) {
      toast.error("Add at least one field before saving");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        maxSubmissions: formData.maxSubmissions === "" ? null : Number(formData.maxSubmissions),
      };
      const response = isEditMode
        ? await api.put(`/api/forms/${id}`, payload)
        : await api.post("/api/forms", payload);

      setFormData((current) => ({
        ...current,
        ...response.data,
        maxSubmissions: response.data.maxSubmissions ?? "",
      }));

      toast.success(isEditMode ? "Form updated" : "Form created");

      if (!isEditMode) {
        navigate(`/forms/${response.data._id}/edit`, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success("Embed code copied");
    } catch (error) {
      toast.error("Failed to copy embed code");
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading form builder..." />;
  }

  return (
    <PageContainer className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            {isEditMode ? "Edit form" : "Create new form"}
          </h2>
          <p className="mt-2 text-sm text-textDim">Build your widget on the left and preview it on the right.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save Form"}
        </motion.button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-cardAlt/80 p-5">
            <h3 className="text-lg font-semibold text-white">Basic Info</h3>
            <div className="mt-4 grid gap-4">
              <motion.input
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                placeholder="Form title"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
              <motion.textarea
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Short description"
                className="min-h-28 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
              <motion.input
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                value={formData.appearance.submitButtonLabel}
                onChange={(event) => updateAppearance("submitButtonLabel", event.target.value)}
                placeholder="Submit button label"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
              <motion.input
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                type="number"
                min="1"
                value={formData.maxSubmissions}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, maxSubmissions: event.target.value }))
                }
                placeholder="Max submissions (optional)"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, isActive: event.target.checked }))
                  }
                />
                Form is active
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-cardAlt/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Fields</h3>
              <button
                onClick={() => {
                  setEditingField(null);
                  setModalOpen(true);
                }}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
              >
                Add Field
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {formData.fields.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-textDim">
                  Add your first field to get started.
                </div>
              ) : (
                formData.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-white">{field.label}</p>
                      <p className="mt-1 text-sm capitalize text-textDim">{field.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingField(field);
                          setModalOpen(true);
                        }}
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-cardAlt/80 p-5">
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm text-textDim">
                Theme Color
                <input
                  type="color"
                  value={formData.appearance.themeColor}
                  onChange={(event) => updateAppearance("themeColor", event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 p-2"
                />
              </label>
              <label className="grid gap-2 text-sm text-textDim">
                Font
                <select
                  value={formData.appearance.font}
                  onChange={(event) => updateAppearance("font", event.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                >
                  {fonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-textDim">
                Position
                <select
                  value={formData.appearance.position}
                  onChange={(event) => updateAppearance("position", event.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                >
                  <option value="floating">Floating</option>
                  <option value="inline">Inline</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        <WidgetPreview form={formData} />
      </div>

      <section className="rounded-2xl border border-white/10 bg-cardAlt/80 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Embed Code</h3>
            <p className="mt-2 text-sm text-textDim">
              Save the form to generate the final widget snippet.
            </p>
          </div>
          {embedCode && (
            <button
              onClick={handleCopyEmbed}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
            >
              Copy
            </button>
          )}
        </div>

        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-textDim">
          <code>{embedCode || '<script src="http://localhost:5000/widget.js" data-form-id="YOUR_FORM_ID"></script>'}</code>
        </pre>
      </section>

      <FieldModal
        isOpen={modalOpen}
        editingField={editingField}
        onClose={() => {
          setModalOpen(false);
          setEditingField(null);
        }}
        onSave={handleSaveField}
      />
    </PageContainer>
  );
};

export default BuilderPage;
