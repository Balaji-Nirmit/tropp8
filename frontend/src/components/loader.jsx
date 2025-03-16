import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-16 h-16 flex justify-center items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-12 h-12 border-4 border-blue-500 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              repeat: Infinity,
              delay: i * 0.5, // Stagger the waves
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
