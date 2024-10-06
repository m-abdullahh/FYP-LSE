import Navbar from "./customcomponents/Navbar";
import ChatbotPage from "./Pages/ChatbotPage";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import SearchPage from "./Pages/SearchPage";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ChatBotComp from "./customcomponents/ChatbotComp";
import "./App.css";
function App() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen px-2 bg-muted">
      <div className="transition-opacity duration-300">
        <ChatBotComp />
      </div>
      <Toaster position="bottom-right" />
      <Navbar />
      <TransitionGroup>
        <CSSTransition
          key={location.key} // Use the current location as the key
          classNames="fade" // Animation class names prefix
          timeout={300} // Duration of the transition
        >
          <div className="transition-opacity duration-300">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
