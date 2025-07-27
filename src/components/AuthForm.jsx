import { useState, useRef } from "react";

const AuthForm = ({ mode = "login", onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [step, setStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otpDigits];
    updatedOtp[index] = value;
    setOtpDigits(updatedOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && index === 5) {
      handleSubmit(e);
    }
  };

  // IMPORTANT: Await onSubmit and use result to advance or show errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const isSignup = mode === "signup";
    setLoading(true);

    try {
      // Step 1: Send OTP
      if (step === 1) {
        if (!phone || (isSignup && (!firstName || !lastName))) {
          setError("Please fill all fields.");
          setLoading(false);
          return;
        }
        const res = await onSubmit({
          phone,
          firstName: isSignup ? firstName : undefined,
          lastName: isSignup ? lastName : undefined,
          action: "send-otp",
        });
        // If API responds OK, move to OTP step
        setStep(2);
        setLoading(false);
        return;
      }

      // Step 2: Verify OTP
      else if (step === 2) {
        const otp = otpDigits.join("");
        if (otp.length !== 6) {
          setError("Please enter all 6 digits of OTP");
          setLoading(false);
          return;
        }
        // Await API/parent to verify
        const res = await onSubmit({
          phone,
          otp,
          firstName: isSignup ? firstName : undefined,
          lastName: isSignup ? lastName : undefined,
          action: "verify-otp",
        });
        // If no error, the parent should navigate or handle success
        setLoading(false);
        // Optionally, call a callback like onSuccess() here
        return;
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#202c33] p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
    >
      <h2 className="text-xl font-semibold text-white text-center">
        {mode === "login" ? "Login to Gupshup" : "Create your Gupshup account"}
      </h2>

      {error && (
        <div className="text-red-400 text-center text-sm mb-2">{error}</div>
      )}

      {step === 1 && (
        <>
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-[#111b21] text-white rounded-md focus:outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-[#111b21] text-white rounded-md focus:outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10,15}"
              maxLength={10}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 bg-[#111b21] text-white rounded-md focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>
        </>
      )}

      {step === 2 && (
        <div>
          <label className="block text-sm text-gray-300 mb-2">Enter OTP</label>
          <div className="flex justify-between space-x-2">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 text-center text-lg bg-[#111b21] text-white rounded-md focus:outline-none"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                ref={(el) => (otpRefs.current[index] = el)}
                disabled={loading}
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition duration-200"
        disabled={loading}
      >
        {loading ? "Please wait..." : step === 1 ? "Send OTP" : "Verify OTP"}
      </button>
    </form>
  );
};

export default AuthForm;
