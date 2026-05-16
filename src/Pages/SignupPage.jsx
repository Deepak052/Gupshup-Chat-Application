// src/pages/SignupPage.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../App";
import axios from "axios";
import { Api_url } from "../utils/constant";

// Demo-only OTP store, replace with your backend/API logic in real use!
const otpStore = {};

const SignupPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fully functional async handler for use with AuthForm's async handleSubmit
  const handleSignup = async ({ email, firstName, lastName, otp, action }) => {
    const baseUrl = `${Api_url}users`;

    // STEP 1: Send OTP
    if (action === "send-otp") {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Please enter a valid email address.");
      }
      if (!firstName || !lastName) {
        throw new Error("Please enter both first name and last name.");
      }
      try {
        const response = await axios.post(`${baseUrl}/signup`, {
          email,
          firstName,
          lastName,
        });
        return { message: response.data.message || "OTP sent to your email" };
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      }
    }

    // STEP 2: Verify OTP
    if (action === "verify-otp") {
      if (!firstName || !lastName) {
        throw new Error("Please enter both first name and last name.");
      }
      try {
        const response = await axios.post(`${baseUrl}/signup-verify`, {
          email,
          otp,
          firstName,
          lastName,
        });
        const { accessToken, refreshToken, _id } = response.data.data;
        // Store tokens for authentication
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", _id);
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        setTimeout(() => navigate("/"), 500); // Navigate to dashboard after short delay
        return { message: "Account created successfully!" };
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
        <AuthForm mode="signup" onSubmit={handleSignup} />
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-500 underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
