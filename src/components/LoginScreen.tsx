import { loginWithLinkedIn } from "@src/pages/background/handleLogin";
import { useState, useEffect } from "react";
import { supabase } from "@src/utils/supabase/supabase";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, signInUser } from "@src/actions";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        navigate("/home/Tasks");
      }
    };
    checkUser();
  }, [isLoggedIn]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setForgotPasswordMessage(null);

    try {
      const response = await signInUser(email, password);
      if (response.success) {
        console.log("Login successful:", response.data);
        setIsLoggedIn(true);
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordMessage(null);
    setError(null);

    if (!email) {
      setForgotPasswordMessage("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setForgotPasswordMessage("Please enter a valid email address.");
      return;
    }

    const response = await sendPasswordResetEmail(email);
    if (response.success) {
      setForgotPasswordMessage("Password reset email sent successfully!");
    } else {
      setForgotPasswordMessage(response.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-5 lg:px-8 border-2 border-grayBorder mx-5 my-5 rounded-xl">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-headingText">
          Login
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-[12px] text-grayText">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-grayBorder placeholder-gray-400 focus:outline-blueBackground sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-[12px] text-grayText">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-grayBorder placeholder-gray-400 focus:outline-blueBackground sm:text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="mt-6">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-blueBackground px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-blueBackground cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <hr className="my-6 border-gray-300" />
        </form>

        <div className="text-center">
          <button
            className="text-sm font-semibold text-grayText hover:text-headingText"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        {forgotPasswordMessage && (
          <div className='flex justify-center w-full'>
          <p className={`mt-2 flex text-center text-sm ${forgotPasswordMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {forgotPasswordMessage}
          </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
