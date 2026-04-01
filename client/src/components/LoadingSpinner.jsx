import { motion } from "framer-motion";

const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center gap-4 text-textDim">
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-accent/30 border-t-accent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
