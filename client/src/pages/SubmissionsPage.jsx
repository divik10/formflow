import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import PageContainer from "../components/PageContainer";

const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(" | ");
  }
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  return String(value);
};

const escapeCsv = (value) => {
  const text = formatValue(value).replace(/"/g, '""');
  return `"${text}"`;
};

const SubmissionsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/forms/${id}/submissions`);
        setForm(data.form);
        setSubmissions(data.submissions);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  const csvContent = useMemo(() => {
    if (!form) {
      return "";
    }

    const headers = [...form.fields.map((field) => escapeCsv(field.label)), '"Submitted At"'];
    const rows = submissions.map((submission) => [
      ...form.fields.map((field) => escapeCsv(submission.responses?.[field.id])),
      escapeCsv(new Date(submission.submittedAt).toLocaleString()),
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  }, [form, submissions]);

  const downloadCsv = () => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.title || "submissions"}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner label="Loading submissions..." />;
  }

  if (!form) {
    return (
      <PageContainer>
        <p className="text-sm text-textDim">Unable to load submissions.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Submissions</h2>
          <p className="mt-2 text-sm text-textDim">{form.title}</p>
        </div>
        <button
          onClick={downloadCsv}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white"
        >
          Download CSV
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-cardAlt/80 text-left text-sm text-white">
            <thead className="bg-white/5 text-textDim">
              <tr>
                {form.fields.map((field) => (
                  <th key={field.id} className="px-4 py-4 font-medium">
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-4 font-medium">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-textDim"
                    colSpan={form.fields.length + 1}
                  >
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission._id} className="border-t border-white/10">
                    {form.fields.map((field) => (
                      <td key={field.id} className="px-4 py-4 text-textDim">
                        {formatValue(submission.responses?.[field.id])}
                      </td>
                    ))}
                    <td className="px-4 py-4 text-textDim">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default SubmissionsPage;
