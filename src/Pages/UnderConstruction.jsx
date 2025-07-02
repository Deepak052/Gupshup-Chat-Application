// src/pages/UnderConstruction.jsx
import { useNavigate } from "react-router-dom";
import { FaTools } from "react-icons/fa";

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#111b21] text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-green-500 flex items-center justify-center">
          <FaTools className="mr-2 w-8 h-8 animate-bounce" /> Page Under
          Construction
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          We hired squirrels to build this page... but they got distracted 🐿️🍿
        </p>
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTl2ZTN4cHNuNW9qaDgzcmRvcnU2aGo4bTUyZ3hxMG0zM2YwaXQ5dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mUHyDqFpPmEEg/giphy.gif"
          alt="Construction Meme"
          className="w-64 h-64 mx-auto rounded-lg"
        />
        <p className="text-sm text-gray-400">
          Estimated completion: When the squirrels finish their popcorn!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition duration-200"
        >
          Back to Home
        </button>
        <div className="mt-4">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
