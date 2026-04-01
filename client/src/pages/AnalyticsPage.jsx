import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import PageContainer from "../components/PageContainer";
import StatCard from "../components/StatCard";

const AnalyticsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [analyticsResponse, formResponse] = await Promise.all([
          api.get(`/api/forms/${id}/analytics`),
          api.get(`/api/forms/${id}`),
        ]);
        setAnalytics(analyticsResponse.data);
        setForm(formResponse.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading analytics..." />;
  }

  if (!analytics || !form) {
    return (
      <PageContainer>
        <p className="text-sm text-textDim">Unable to load analytics.</p>
      </PageContainer>
    );
  }

  const hasRatingField = form.fields.some((field) => field.type === "rating");
  const hasNpsField = form.fields.some((field) => field.type === "nps");

  return (
    <PageContainer>
      <div>
        <h2 className="text-3xl font-bold text-white">Analytics</h2>
        <p className="mt-2 text-sm text-textDim">{form.title}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Submissions" value={analytics.totalSubmissions} />
        {hasRatingField && (
          <StatCard title="Average Rating" value={analytics.averageRating ?? "0.0"} />
        )}
        {hasNpsField && <StatCard title="Average NPS" value={analytics.averageNPS ?? "0.0"} />}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-cardAlt/80 p-5">
        <h3 className="text-lg font-semibold text-white">Submissions in the last 30 days</h3>
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.submissionsOverTime}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111118",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: "16px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageContainer>
  );
};

export default AnalyticsPage;
