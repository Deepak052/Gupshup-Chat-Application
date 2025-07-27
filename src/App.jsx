import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatApp from "./Pages/ChatApp";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import NotFound from "./Pages/NotFound";
import UnderConstruction from "./Pages/UnderConstruction";

export const AuthContext = createContext();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Sync localStorage whenever isAuthenticated changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  // Optional: handle storage events in case other tabs log out
  useEffect(() => {
    const handleStorageChange = () => {
      const storedAuth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(storedAuth);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <ChatApp /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <ChatApp showSettings={true} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ChatApp showUserProfile={true} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
