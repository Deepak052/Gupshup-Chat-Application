// src/pages/SignupPage.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../App";

const SignupPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (data) => {
    console.log("Signup data:", data);
    // Simulate signup success
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    alert("Account created!");
    navigate("/");
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
