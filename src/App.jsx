import React,{ useState, useEffect, createContext } from "react";
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


// Simulated authentication context
export const AuthContext = createContext();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <ChatApp /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <ChatApp showSettings={true} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ChatApp showUserProfile={true} /> : <Navigate to="/login" />}
          />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
