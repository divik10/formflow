import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import PageContainer from "../components/PageContainer";
import FormCard from "../components/FormCard";

const DashboardPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/forms");
      setForms(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDelete = async (formId) => {
    if (!window.confirm("Delete this form and all its submissions?")) {
      return;
    }

    try {
      await api.delete(`/api/forms/${formId}`);
      setForms((current) => current.filter((item) => item._id !== formId));
      toast.success("Form deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete form");
    }
  };

  const handleDuplicate = async (formId) => {
    try {
      const { data } = await api.post(`/api/forms/${formId}/duplicate`);
      toast.success("Form duplicated");
      setForms((current) => [{ ...data, submissionCount: 0 }, ...current]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to duplicate form");
    }
  };

  const handleToggle = async (form) => {
    try {
      const { data } = await api.put(`/api/forms/${form._id}`, {
        ...form,
        isActive: !form.isActive,
      });
      setForms((current) =>
        current.map((item) =>
          item._id === form._id ? { ...data, submissionCount: form.submissionCount } : item
        )
      );
      toast.success(`Form ${data.isActive ? "activated" : "paused"}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update form");
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Your forms</h2>
          <p className="mt-2 text-sm text-textDim">Create, manage, and embed feedback widgets.</p>
        </div>
        <Link
          to="/forms/new"
          className="rounded-xl bg-accent px-5 py-3 text-center text-sm font-medium text-white"
        >
          Create New Form
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : forms.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <p className="text-lg text-white">No forms yet</p>
          <p className="mt-2 text-sm text-textDim">Create your first feedback widget to get started.</p>
        </div>
      ) : (
        <motion.div layout className="mt-8 grid gap-5 xl:grid-cols-2">
          <AnimatePresence>
            {forms.map((form, index) => (
              <motion.div
                key={form._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.06 }}
              >
                <FormCard
                  form={form}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onToggle={handleToggle}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
