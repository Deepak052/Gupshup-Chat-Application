// Dynamically switch based on environment (Vite handles this during build)
export const base_Api_url = import.meta.env.DEV 
  ? "http://localhost:8000/api/v1/" 
  : "https://gupshup-backend-ep8l.onrender.com/api/v1/";

export const Api_url = base_Api_url;