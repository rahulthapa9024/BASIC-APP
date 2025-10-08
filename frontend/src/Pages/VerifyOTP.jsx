import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtp } from "../../slices/userSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiArrowRight, FiRotateCw } from "react-icons/fi";

// Reusable Spinner component
const Spinner = ({ className = "h-5 w-5 text-white" }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default function VerifyOTP() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  if (!email) return <Navigate to="/signup" replace />;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) inputRefs.current[index - 1].focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1].focus();
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d{6}$/.test(paste)) {
      setOtpDigits(paste.split(""));
      inputRefs.current[5].focus();
    }
  };

  const handleVerify = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) return toast.error("Please enter a complete 6-digit OTP");
    setIsVerifying(true);
    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success("OTP verified! Welcome.");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await dispatch(sendOtp(email)).unwrap();
      toast.success("A new OTP has been sent to your email!");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, when: "beforeChildren" } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen text-white p-4 overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }} // Generic background image
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Animated Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <motion.div
          animate={{ x: [-100, 50, -100], y: [50, -100, 50], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 40, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-600/30 filter blur-3xl" // Changed color
        />
        <motion.div
          animate={{ x: [100, -50, 100], y: [-50, 100, -50], scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 35, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-700/30 filter blur-3xl" // Changed color
        />
      </div>

      {/* OTP Card */}
      <div className="relative p-[2px] rounded-2xl z-20 w-full max-w-md bg-gradient-to-br from-blue-500/50 via-transparent to-indigo-500/50"> {/* Changed gradient colors */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full bg-gray-950/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
        >
          <motion.div variants={itemVariants} className="text-center py-8 px-6 border-b border-white/10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Check Your Email</h1>
            <p className="text-gray-400 text-sm mt-3">
              We've sent a 6-digit code to <br />
              <strong className="font-medium text-white/90">{email}</strong>
            </p>
          </motion.div>

          <div className="p-8 space-y-8">
            {/* OTP Inputs */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-3 sm:gap-4"
              onPaste={handlePaste}
            >
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-3xl sm:text-4xl text-center font-semibold bg-white/5 text-gray-200 border border-white/10 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500/80 transition-all duration-200" // Changed focus color
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </motion.div>

            {/* Verify Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                disabled={isVerifying || otpDigits.join("").length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg 
                           hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-600/30
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none" // Changed button colors
              >
                {isVerifying ? <Spinner /> : "Verify & Continue"}
                {!isVerifying && <FiArrowRight className="h-5 w-5" />}
              </motion.button>
            </motion.div>

            {/* Resend OTP */}
            <motion.div variants={itemVariants} className="text-center text-sm text-gray-400">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait" // Changed link color
              >
                {isResending ? (
                  <>
                    <Spinner className="h-4 w-4 text-blue-400" /> {/* Changed spinner color */}
                    <span>Resending...</span>
                  </>
                ) : (
                  "Resend"
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}