import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

const NotFoundPage = () => {
  return (
    <PageContainer className="flex min-h-screen items-center justify-center px-4">
      <div className="rounded-2xl border border-white/10 bg-card/80 p-8 text-center">
        <h1 className="text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-textDim">The page you requested does not exist.</p>
        <Link to="/dashboard" className="mt-6 inline-block rounded-xl bg-accent px-4 py-3 text-white">
          Back to dashboard
        </Link>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
