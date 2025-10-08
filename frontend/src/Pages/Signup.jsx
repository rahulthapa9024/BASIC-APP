import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase"; // Your firebase utils import
import { useDispatch } from "react-redux";
import { googleLogin, sendOtp } from "../../slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

// Spinner component for loading states
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 
         7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;
      dispatch(googleLogin({ displayName, email, photoURL }));
      toast.success("Logged in successfully!");
      // Optionally redirect on success
      // navigate("/dashboard");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(sendOtp(email)).unwrap();
      toast.success("OTP sent to your email!");
      navigate("/verifyOTP", { state: { email } });
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`, // Generic background image
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <motion.div
          animate={{
            x: [-100, 50, -100],
            y: [50, -100, 50],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 40, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-600/30 filter blur-3xl" // Changed color
        />
        <motion.div
          animate={{
            x: [100, -50, 100],
            y: [-50, 100, -50],
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 35, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-700/30 filter blur-3xl" // Changed color
        />
      </div>

      {/* Form Container */}
      <div className="relative p-[2px] rounded-2xl z-20 w-full max-w-md bg-gradient-to-br from-blue-500/50 via-transparent to-indigo-500/50"> {/* Changed gradient colors */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, when: "beforeChildren" } },
          }}
          className="w-full bg-gray-950/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
        >
          {/* Header */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
            }}
            className="text-center py-8 px-6 border-b border-white/10"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm mt-3">Get started in seconds. No password required.</p>
          </motion.div>

          {/* Email Form */}
          <div className="p-8 space-y-6">
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
              }}
              className="space-y-4"
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-400" /> {/* Changed focus color */}
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 text-gray-200 border border-white/10 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50" // Changed focus color
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendOTP}
                disabled={isLoading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed" // Changed button colors
              >
                {isLoading ? <Spinner /> : "Continue with Email"}
                {!isLoading && <FiArrowRight className="h-5 w-5" />}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
              }}
              className="relative flex items-center py-2"
            >
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </motion.div>

            {/* Google Login */}
            <motion.button
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              onClick={async () => {
                try {
                  setGoogleLoading(true);
                  const result = await signInWithPopup(auth, provider);
                  const { displayName, email, photoURL } = result.user;
                  dispatch(googleLogin({ displayName, email, photoURL }));
                  toast.success("Logged in successfully!");
                } catch {
                  toast.error("Google sign-in failed");
                } finally {
                  setGoogleLoading(false);
                }
              }}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-gray-200 font-medium py-3 px-6 rounded-lg border border-white/10 shadow-md shadow-black/20"
            >
              {googleLoading ? (
                <Spinner />
              ) : (
                <>
                  <FcGoogle className="w-6 h-6" />
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Footer */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
            }}
            className="px-6 py-5 bg-black/20 text-center border-t border-white/10"
          >
            <p className="text-gray-500 text-xs">
              By continuing, you agree to our{" "}
              <a href="#" className="font-medium text-gray-400 hover:text-blue-400 transition"> {/* Changed link hover color */}
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-gray-400 hover:text-blue-400 transition"> {/* Changed link hover color */}
                Privacy Policy
              </a>
              .
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}