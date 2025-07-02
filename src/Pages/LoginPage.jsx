// src/pages/LoginPage.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../App";

const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (data) => {
    console.log("Login data:", data);
    // Simulate login success
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    alert("Logged in!");
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#111b21]">
      <div className="w-full max-w-md space-y-4">
        <AuthForm mode="login" onSubmit={handleLogin} />
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
