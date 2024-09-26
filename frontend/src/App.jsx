import Navbar from "./customcomponents/Navbar";
import ChatbotPage from "./Pages/ChatbotPage";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import SearchPage from "./Pages/SearchPage";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="flex flex-col min-h-screen px-2 bg-muted">
      <Toaster position="bottom-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
