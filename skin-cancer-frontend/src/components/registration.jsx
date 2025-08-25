import React, { useState, useEffect } from "react";
import axios from "axios";

// Configure axios defaults
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const Registration = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === "true") onLoginSuccess();
  }, [onLoginSuccess]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, isLoginForm) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (isLoginForm) {
      if (!loginData.email || !loginData.password) {
        return setError("Please fill in all fields");
      }
    } else {
      if (!registerData.name || !registerData.email || 
          !registerData.password || !registerData.confirmPassword) {
        return setError("Please fill in all fields");
      }
      if (registerData.password !== registerData.confirmPassword) {
        return setError("Passwords don't match");
      }
    }

    try {
      const endpoint = isLoginForm ? "auth/login" : "auth/register";
      const payload = isLoginForm ? {
        email: loginData.email,
        password: loginData.password
      } : {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      };

      const response = await api.post(endpoint, payload);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("loggedIn", "true");
      onLoginSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 
                         err.response?.data?.error || 
                         err.message || 
                         "Something went wrong";
      setError(errorMessage);
      console.error("Auth Error:", err.response || err);
    }
  };
  
  return (
<div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#232b38] to-[#181e29] font-inter">

<div className="relative w-full max-w-md mx-auto flex items-center justify-center mt-56 h-full">

        <div className={`absolute inset-0 transition-opacity duration-500 ${isLogin ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
          {/* Login Card */}
          <form
            onSubmit={(e) => handleSubmit(e, true)}
            className="bg-[#232b38]/70 shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-4 animate-fade-in"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
              Welcome Back <span className="text-yellow-400">👋</span>
            </h2>
            <p className="text-sm text-blue-200 text-center mb-4">
              Please login to continue to <span className="font-semibold text-blue-400">DermaScan-AI</span>
            </p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="username"
              value={loginData.email}
              onChange={handleLoginChange}
              className="bg-[#1a2233] text-white placeholder-blue-200 border border-blue-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="bg-[#1a2233] text-white placeholder-blue-200 border border-blue-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-3 mt-2 transition-all duration-200 shadow-md"
            >
              Log In
            </button>
            <p className="text-center text-blue-200 mt-4 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-400 font-semibold hover:underline"
                onClick={() => { setIsLogin(false); setError(""); }}
              >
                Sign Up Now
              </button>
            </p>
            {error && <p className="text-red-400 text-center mt-2 animate-shake">{error}</p>}
          </form>
        </div>

        <div className={`absolute inset-0 transition-opacity duration-500 ${!isLogin ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
          {/* Signup Card */}
          <form
            onSubmit={(e) => handleSubmit(e, false)}
            className="bg-[#232b38]/70 shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-4 animate-fade-in"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
              Become a part of DermaScan-AI <span className="text-xl">🚀</span>
            </h2>
            <p className="text-sm text-blue-200 text-center mb-4">
              Create your account and start tracking your skin results effortlessly.
            </p>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={registerData.name}
              onChange={handleRegisterChange}
              className="bg-[#1a2233] text-white placeholder-blue-200 border border-blue-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="username"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="bg-[#1a2233] text-white placeholder-blue-200 border border-blue-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="bg-[#1a2233] text-white placeholder-blue-200 border border-blue-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              className="bg-[#1a2233] text-white placeholder-blue-200 border border-blue-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-3 mt-2 transition-all duration-200 shadow-md"
            >
              Register
            </button>
            <p className="text-center text-blue-200 mt-4 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-400 font-semibold hover:underline"
                onClick={() => { setIsLogin(true); setError(""); }}
              >
                Log in here
              </button>
            </p>
            {error && <p className="text-red-400 text-center mt-2 animate-shake">{error}</p>}
          </form>
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-shake {
            animation: shake 0.25s;
          }
          @keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(4px); }
            30%, 50%, 70% { transform: translateX(-8px); }
            40%, 60% { transform: translateX(8px); }
          }
        `}
      </style>
    </div>
  );
};

export default Registration;
