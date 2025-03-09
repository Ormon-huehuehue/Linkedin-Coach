import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // Importing a cross icon from lucide-react

const TaskElement = ({ title, description, contextualTips, isChecked }: { title: string; description: string; contextualTips: string[]; isChecked: boolean }) => {
  const [checked, setChecked] = useState(isChecked);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!checked) setExpanded(true);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing from outside clicks
    setExpanded(false);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChecked(!checked);
    setExpanded(false);

    const task = localStorage.getItem("dailyTasks");
    if (task) {
      const parsedTask = JSON.parse(task);
      //@ts-expect-error t has type "any"
      const updatedTask = parsedTask.map((t) => {
        if (t.title === title) {
          return { ...t, isChecked: !checked };
        }
        return t;
      });
      localStorage.setItem("dailyTasks", JSON.stringify(updatedTask));
    }
  };

  return (
    <motion.div
      layout="position"
      className="mx-5 bg-white shadow-sm rounded-lg px-3 py-2 border-2 border-[#efefef] cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 flex-shrink-0 ${
              checked ? "bg-blue-500 border-blue-500" : "border-gray-400"
            }`}
            onClick={handleCheckboxClick}
          >
            {checked && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </div>
          {/* Task Title & Description */}
          <div className="flex flex-col w-full">
            <p className={` text-start ${checked ? "line-through text-[#a8a8a8]" : "text-[#302f2f]"}`}>{title}</p>
              {/* Close Button */}
              <button
                onClick={handleCloseClick}
                className={`absolute top-2 right-2 p-[2px] text-gray-500 hover:text-gray-700 border-2 rounded-full transition-all duration-300 ease-in-out
                  ${expanded ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
              >
                <X className="w-4 h-4" />
              </button>

            {!checked && <p className="text-[#6a6a6a] text-start text-[12px] font-extralight">{description}</p>}
          </div>
        </div>

        <AnimatePresence>
          {!checked && expanded && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1 }}
              className="overflow-hidden relative"
            >
              <ul className="mt-4 text-[12px] text-[#6a6a6a] list-disc pl-8">
                {contextualTips.map((tip: string, index: number) => (
                  <li className="text-start" key={index}>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskElement;
