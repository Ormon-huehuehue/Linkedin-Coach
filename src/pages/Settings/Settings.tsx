import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "@src/actions";
import { supabase } from "@src/utils/supabase/supabase";

export default function Settings() {
  // const [apiKey, setApiKey] = useState<string | null>(null);
  // const [newApiKey, setNewApiKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [profileUrl, setProfileUrl] = useState('');
  const [email, setEmail] = useState('');
  const assignedLevel = localStorage.getItem("userLevel");

  const updateProfileUrl = async()=>{
    const data =  await chrome.storage.local.get("profileUrl")
    return data.profileUrl;
  }

  useEffect(()=>{
    const updateProfileFunction = async ()=>{
      const url = await updateProfileUrl();
      setProfileUrl(url)

      const {data : userData, error} = await supabase.auth.getUser();

      console.log("data : ", userData)
      if(userData){
        setEmail(userData.user?.email!)
      }
    }



    updateProfileFunction();
  },[])


  const handleSignOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("dailyTasks");
      localStorage.removeItem("userLevel");
      localStorage.removeItem('lastSyncTime');
      localStorage.removeItem("taskGenerationTimestamp");
      await chrome.storage.local.remove('commentTimestamps');
      await chrome.storage.local.remove('postTimeStamps');
      await chrome.storage.local.remove('connectionData');
      await chrome.storage.local.remove('suggestedProfiles');
      await chrome.storage.local.remove('profileUrl');
      await signOut();
      window.postMessage('checkUser', '*')
      navigate("/account/login"); 
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="flex flex-col justify-start items-center text-center bg-white shadow-lg h-[33rem] rounded-lg p-6 text-grayText">
      {/* User Info Section */}
        <h2 className="text-xl font-semibold mb-2 text-headingText">USER INFORMATION</h2>
      <div className="p-4 bg-gray-100 rounded-lg w-full text-left h-auto text-md">
        <p><span className='text-headingText'>EMAIL:</span> {email || "Loading"}</p>
        <p>
          <span className='text-headingText'>LINKEDIN URL:</span>{" "}
          {profileUrl ? (
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {profileUrl}
            </a>
          ) : (
            "Not available"
          )}
        </p>
        <p><span className='text-headingText'>ASSIGNED LEVEL:</span> {assignedLevel || "Not assigned"}</p>
      </div>

      {/* Buttons */}
      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 w-full"
      >
        BACK TO HOME
      </Link>

      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-lg font-medium transition duration-200 w-full ${
          loading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {loading ? "SIGNING OUT..." : "SIGN OUT"}
      </button>
    </div>
    
    );
}

