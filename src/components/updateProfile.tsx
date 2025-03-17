import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@src/utils/supabase/supabase";

export default function UpdateProfile() {
  const [profileUrl, setProfileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const getUserLevel = async (email : string)=>{
    const { data, error } = await supabase
    .from('users-data')
    .select('userLevel')
    .eq('email', email)
    if (error) {
      console.error("Couldn't  user level, error:", error);
      return new Error(`Couldn't get user level: ${error.message}`);
    }
    console.log("getUserLevel : ", data)
  
    return data;
  }


 
 
    


  const handleUpdateProfileUrl = async () => {

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const email = user.email;
 
      if (!profileUrl.trim()) {
        setMessage("Profile URL cannot be empty.");
        return;
      }
      setLoading(true);
      setMessage("");
  
      try {
        await chrome.storage.local.set({ profileUrl });
        console.log("Updating linkedin url to ", profileUrl)
  
        const { error } = await supabase
        .from('users-data')
        .update({linkedInUrl : profileUrl})
        .eq('email', email)
        if (error) {
          console.error("Couldn't  user level, error:", error);
          return new Error(`Couldn't get user level: ${error.message}`);
        }  
        setMessage("Profile URL updated successfully!");
      } catch (error) {
        console.error("Update failed:", error);
        setMessage("Failed to update profile URL.");
      } finally {
        setLoading(false);
      }




    }
    else{
      navigate("/account/login");
    }
   
  };

  return (
    <div className="flex flex-col justify-start items-center text-center bg-white shadow-lg h-[33rem] rounded-lg p-6 text-grayText">
      <h2 className="text-xl font-semibold mb-2 text-headingText">UPDATE PROFILE URL</h2>
      <div className="p-4 bg-gray-100 rounded-lg w-full text-left h-auto text-md">
        <label className="block text-headingText mb-1">Profile URL:</label>
        <input
          type="text"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          className="border p-2 w-full rounded-lg"
          placeholder="Enter your LinkedIn URL"
        />
      </div>
      {message && <p className="mt-2 text-red-500">{message}</p>}
      <button
        onClick={handleUpdateProfileUrl}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-lg font-medium transition duration-200 w-full ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "UPDATING..." : "UPDATE"}
      </button>
      <Link
        to="/settings"
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 w-full text-center"
      >
        BACK TO SETTINGS
      </Link>
      <div className='px-7 pt-5 text-start '>
        <p className='text-headingText'> <span className='text-headingText'> NOTE :</span> Make sure this URL matches your linkedIn Profile's URL</p>
    </div>
    </div>
  );
}
