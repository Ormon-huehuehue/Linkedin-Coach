import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import browser from "webextension-polyfill";
import Topbar from "@src/components/Topbar";
import Settings from "../Settings/Settings";
import HomeScreen from "@src/components/HomeScreen";
import AccountScreen from "@src/components/AccountScreen";
import { supabase } from "@src/utils/supabase/supabase";
import OnboardingSurvey from "@src/components/OnboardingSurvey";
import UpdateProfile from "@src/components/updateProfile";


export default function Popup() {

  useEffect(() => {
 
    setInterval(() => {
      chrome.runtime.sendMessage({ keepAlive: true });
    }, 5000);
    
  }, []); 


  return (
    <Router>
      <div >
        <div className="w-full h-full text-center text-black justify-center items-center">
          <Topbar/>
        </div>
      </div>
      <Routes>
          <Route path="/" element={<Navigate to="/home/Tasks" replace />} /> 
          <Route path = '/home/:panel' element={<HomeScreen/>}/>
          <Route path="/settings" element={<Settings />} />
          <Route path='/account/:method' element = {<AccountScreen/>} />
          <Route path="/onboarding-survey" element = {<OnboardingSurvey/>} />
          <Route path="/update-profile" element = {<UpdateProfile/>} />
      </Routes>
    </Router>
  );
}


