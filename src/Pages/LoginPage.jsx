import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../App";
import axios from "axios";
import { Api_url } from "../utils/constant";

// Simple in-memory "OTP store" for DEMO only (replace with your API in production)
const otpStore = {};
const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fully functional async handler for use with AuthForm's async handleSubmit
  const handleLogin = async ({ email, otp, action }) => {
    const baseUrl =  `${Api_url}users`;
    const fcmToken="noToken";

    // Step 1: Send OTP
    if (action === "send-otp") {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Please enter a valid email address.");
      }
      try {
        const response = await axios.post(`${baseUrl}/login`, { email });
        return { message: response.data.message || "OTP sent to your email" };
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      }
    }

    // Step 2: Verify OTP
    if (action === "verify-otp") {
      try {
        const response = await axios.post(`${baseUrl}/verify_otp`, {
          email,
          otp,
          fcmToken,
        });
        const { accessToken, refreshToken, _id } = response.data.data;
        // Store tokens for authentication
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", _id);
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        return { message: "Login successful!" };
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to verify OTP. Please try again."
        );
      }
    }

    throw new Error("Unknown action");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#111b21]">
      <div className="w-full max-w-md space-y-4">
        <AuthForm
          mode="login"
          onSubmit={async (data) => {
            const result = await handleLogin(data);
            // On successful login, navigate after a short delay
            if (
              data.action === "verify-otp" &&
              result.message.includes("successful")
            ) {
              setTimeout(() => {
                navigate("/");
              }, 700); // Short delay for user to see "success" message
            }
            return result;
          }}
        />
        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-green-500 underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
