import { useState } from "react";

const AuthForm = ({ mode = "login", onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    if (mode === "signup") userData.name = name;
    onSubmit(userData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#202c33] p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
    >
      <h2 className="text-xl font-semibold text-white text-center">
        {mode === "login" ? "Login to Gupshup" : "Create your Gupshup account"}
      </h2>

      {mode === "signup" && (
        <div>
          <label className="block text-sm text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-[#111b21] text-white rounded-md focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full px-4 py-2 bg-[#111b21] text-white rounded-md focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <input
          type="password"
          required
          className="w-full px-4 py-2 bg-[#111b21] text-white rounded-md focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition duration-200"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;
