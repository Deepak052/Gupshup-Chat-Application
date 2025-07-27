import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../App";
import axios from "axios";

// Simple in-memory "OTP store" for DEMO only (replace with your API in production)
const otpStore = {};
const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fully functional async handler for use with AuthForm's async handleSubmit
  const handleLogin = async ({ phone, otp, action }) => {
    const baseUrl = "http://localhost:8000/api/v1/users";
    const fcmToken="noToken";

    // Step 1: Send OTP
    if (action === "send-otp") {
      if (!/^[0-9]{10,15}$/.test(phone)) {
        throw new Error("Please enter a valid phone number (10-15 digits).");
      }
      try {
        const response = await axios.post(`${baseUrl}/login`, { phone });
        return { message: response.data.message || "OTP sent to your phone" };
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
          phone,
          otp,
          fcmToken,
        });
        const { accessToken, refreshToken } = response.data.data;
        // Store tokens for authentication
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
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
