import React, { useState, useEffect } from 'react';
import { signUpNewUser } from '@src/actions';
import { supabase } from '@src/utils/supabase/supabase';
import { useNavigate } from 'react-router-dom';
import browser from "webextension-polyfill"

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  const navigate = useNavigate();

  useEffect(()=>{
    if(isLoggedIn){
      navigate("/onboarding-survey")
    }
  },[isLoggedIn])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
      
        setIsLoggedIn(true);
        navigate("/onboarding-survey");
      }
    };
    
    checkUser();
  }, [loading]);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      browser.runtime.sendMessage({
        type: "SIGNUP",
        email: email,
        password: password
      }).then((response) => {
        console.log("content script response : ", response)
      })

      const response = await signUpNewUser(email, password);
      
      console.log("Response : ", response)

      if(response.success){
        console.log("Response data :", response.data)
        setLoading(false)
        navigate("/onboarding-survey")
      }
      // Redirect or show success message if needed
    } catch (err) {
      console.log("Sign up failed : ", error)
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-5 lg:px-8 border-2 border-grayBorder mx-5 my-5 rounded-xl">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-headingText">
          Sign Up
        </h2>
      </div>
      
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm text-grayText">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-grayBorder placeholder-gray-400 focus:outline-blueBackground sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm text-grayText">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-grayBorder placeholder-gray-400 focus:outline-blueBackground sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm text-grayText">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-grayBorder placeholder-gray-400 focus:outline-blueBackground sm:text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="mt-6 flex w-full justify-center rounded-md bg-blueBackground px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-blueBackground cursor-pointer"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <hr className="my-6 border-gray-300" />
          
          {/* <button
            type="button"
            className="flex w-full justify-center rounded-md bg-linkedInBackground px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-blueBackground cursor-pointer"
          >
            Sign in witha LinkedIn
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;
