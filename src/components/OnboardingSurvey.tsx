import { useState } from "react";
import { motion } from "framer-motion";
import { fetchUserDivision } from "@src/lib/lib";
import { supabase } from "@src/utils/supabase/supabase";
import { addUserToDatabase } from "@src/actions";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: "expertise",
    question: "What is your primary area of expertise?",
    options: [
      "Thought Leadership Strategy",
      "Personal Branding",
      "B2B Content Marketing",
      "Other",
    ],
    type: "radio",
  },
  {
    "id": "industry",
    "question": "Which industry are you a part of?",
    "options": [
      "Technology & Software",
      "Finance & Investment",
      "Healthcare & Life Sciences",
      "Marketing & Advertising",
      "Consulting & Coaching",
      "Education & E-learning",
      "Retail & E-commerce",
      "Other"
    ],
    "type": "radio"
  },
  {
    id: "audience",
    question: "Who are you trying to reach on LinkedIn?",
    options: [
      "Fortune 1000 executives",
      "Small and Medium Business (SMB) owners",
      "Startups & Entrepreneurs",
      "Other",
    ],
    type: "radio",
  },
  {
    id: "activity",
    question: "How active are you currently on LinkedIn?",
    options: [
      "Beginner (Rarely post or engage)",
      "Intermediate (Post occasionally, engage sometimes)",
      "Pro (Post frequently, actively engage)",
    ],
    type: "radio",
  },
  {
    id: "frequency",
    question: "How often do you post on LinkedIn?",
    options: [
      "Rarely (Less than once per week)",
      "Occasionally (1-3 times per week)",
      "Frequently (4-6 times per week)",
      "Daily (7+ times per week)",
    ],
    type: "radio",
  },
  {
    id: "profileUrl",
    question: "Please enter your LinkedIn profile URL. ( This needs to be accurate for your stats to update )",
    type: "text",
  },
];

export default function OnboardingSurvey() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const isLastStep = step === questions.length - 1;
  const navigate = useNavigate();

  const handleNext = () => {
    if (answers[questions[step].id]) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleChange = (value: string) => {
    setAnswers({ ...answers, [questions[step].id]: value });
  };

  const handleSubmit = async () => {
    const userLevel = await fetchUserDivision(JSON.stringify(answers));

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("User not authenticated");
      return new Error("Couldn't quantify user, User is not authenticated");
    }

    const email = data.user?.email;
    const linkedInProfileUrl = answers["profileUrl"]; 
    if (email && userLevel && linkedInProfileUrl) {
      localStorage.setItem("profileUrl", linkedInProfileUrl);
      await chrome.storage.local.set({ profileUrl : linkedInProfileUrl})
      addUserToDatabase(email, userLevel, linkedInProfileUrl);
    } else {
      console.error("Couldn't quantify user, email or userLevel missing");
      return new Error("Couldn't quantify user, email or userLevel missing");
    }

    navigate("/home/Tasks");
  };
  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl relative flex flex-col h-[88vh]">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
  
      {/* Question Section (Takes available space) */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="flex-grow overflow-auto"
      >
        <h2 className="text-2xl font-bold mb-6">{questions[step].question}</h2>
  
        {questions[step].type === "radio" ? (
          <div className="space-y-4">
            {questions[step].options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center text-md text-headingText space-x-2 cursor-pointer px-2 py-4 border-2 border-[#efefef] rounded-lg hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name={`question-${questions[step].id}`}
                  value={option}
                  onChange={() => handleChange(option)}
                  className="w-5 h-5"
                  checked={answers[questions[step].id] === option}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            placeholder="Enter your profile URL"
            value={answers[questions[step].id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        )}
      </motion.div>
  
      {/* Buttons (Stuck to the bottom) */}
      <div className="absolute bottom-0 left-0 w-full max-w-lg px-6 pb-6 bg-white">
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-5 py-2 border rounded-md bg-gray-300 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={!answers[questions[step].id]}
            className="px-5 py-2 border rounded-md bg-blue-600 text-white disabled:opacity-50"
          >
            {isLastStep ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}  
