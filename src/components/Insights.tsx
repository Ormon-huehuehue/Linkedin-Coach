import StatsGrid from "./StatsGrid";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Insights = () => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState(() => localStorage.getItem('selectedTimeframe') || 'Last 7 days');
  
  const options = ["Last 24 hours", "Last 7 days", "Last 30 days"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    localStorage.setItem("selectedTimeframe", option);
    setIsOpen(false);
  };

  return (
  <>
    <motion.div
      key="insights"
      initial={{ opacity: 0, scaleY: 0.8, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} // Smooth cubic-bezier ease
      className="flex flex-col mx-5 border-2 rounded-xl border-[#efefef] overflow-hidden"
    >
      <div className="flex justify-between mx-4 items-center mt-2">
        <p className="text-[16px] text-[#434343]">Engagement Insights</p>
        <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="flex justify-between items-center gap-2 w-[7rem] px-2 py-1 text-[10px] border-2 border-[#efefef] font-medium bg-[#f9fbfc] text-[#434343] rounded-lg transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} // Smooth cubic-bezier ease
            className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
            style={{ width: width || "auto" }}
          >
            <ul className="py-2 text-[#787878]">
              {options.map((option) => (
                <li
                  key={option}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-[10px] ${selectedOption === option ? "bg-gray-50" : ""
                    }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
      </div>
      <div>
        <StatsGrid timeframe={selectedOption}/>
      </div>
    </motion.div>
    <div className='px-7 pt-5 text-start '>
        <p className='text-headingText'> <span className='text-headingText'> NOTE :</span> Please open your LinkedIn profile page in your browser to sync stats</p>
    </div>
  </>
  );
};

export default Insights;



