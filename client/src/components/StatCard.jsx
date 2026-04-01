import { motion } from "framer-motion";

const StatCard = ({ title, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-white/10 bg-cardAlt/90 p-5 shadow-lg"
    >
      <p className="text-sm text-textDim">{title}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );
};

export default StatCard;
