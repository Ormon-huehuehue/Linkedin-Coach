import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "@src/actions";

export default function Settings() {
  // const [apiKey, setApiKey] = useState<string | null>(null);
  // const [newApiKey, setNewApiKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleSaveApiKey = () => {
  //   if (newApiKey.trim()) {
  //     chrome.storage.local.set({ GEMINI_API_KEY: newApiKey }, () => {
  //       setApiKey(newApiKey);
  //       setNewApiKey("");
  //     });
  //   }
  // };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("dailyTasks")
      localStorage.removeItem("userLevel")
      localStorage.removeItem('lastSyncTime')
      await chrome.storage.local.remove('commentTimestamps');
      await chrome.storage.local.remove('postTimeStamps');
      await chrome.storage.local.remove('connectionData');
      await chrome.storage.local.remove('suggestedProfiles');
      await signOut();
      window.postMessage('checkUser', '*');
      navigate("/account/login"); 
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   chrome.storage.local.get(["GEMINI_API_KEY"], (result) => {
  //     setApiKey(result.GEMINI_API_KEY || null);
  //   });
  // }, []);

  // if (!apiKey) {
  //   return (
  //     <div className="mt-4 flex flex-col items-center">
  //       <h2 className="text-lg font-bold">SETTINGS</h2>
  //       <input
  //         type="text"
  //         placeholder="Enter Gemini API Key"
  //         value={newApiKey}
  //         onChange={(e) => setNewApiKey(e.target.value)}
  //         className="mt-5 p-2 text-black rounded"
  //       />
  //       <button
  //         onClick={handleSaveApiKey}
  //         className="mt-2 text-black px-4 py-2 rounded hover:bg-blue-400 hover:text-white"
  //       >
  //         Save API Key
  //       </button>
    
  //     </div>
  //   );
  // } else {
    return (
      <div className="flex flex-col justify-center items-center text-center h-[30rem] bg-white shadow-lg rounded-lg p-6">      
      <Link 
        to="/" 
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
      >
        Back to Home
      </Link>
      
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-lg font-medium transition duration-200 ${
          loading
            ? "bg-red-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {loading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
    
    );
}

