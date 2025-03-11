import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const steps = [
  "Initializing...",
  "Calculating level...",
  "Fetching tasks...",
];

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(onFinish, 800); // Finish after last step
        return prev;
      });
    }, 800); // Change steps every 800ms

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        className=" inset-0 flex flex-col items-center justify-center bg-white text-headingText z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.h1
          key={currentStep}
          className="text-2xl font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {steps[currentStep]}
        </motion.h1>

        {/* Progress Bar */}
        <div className="w-3/4 h-2 bg-opacity-30 rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
