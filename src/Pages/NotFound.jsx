import { useNavigate } from "react-router-dom";
import { FaBug } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#111b21] text-white">
      <div className="text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-bold text-green-500">
          404 😭
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Oops! You’ve wandered into the internet’s Bermuda Triangle.
        </p>
        <img
          src="https://media.giphy.com/media/3o7TKtnS4VAdRgrylW/giphy.gif" // "This is fine" dog meme
          alt="404 Meme"
          className="w-64 h-64 mx-auto rounded-lg"
        />
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition duration-200"
        >
          Take me home before I vanish too!
        </button>
        <div className="flex justify-center mt-4">
          <FaBug className="w-6 h-6 text-gray-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
