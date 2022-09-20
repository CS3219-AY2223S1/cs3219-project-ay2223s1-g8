import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/login/LoginPage";
import SignupPage from "./views/signup/SignupPage";
import LandingPage from "./views/LandingPage";
import MatchingPage from "./views/MatchingPage";
import RoomPage from "./views/RoomPage";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/match" element={<MatchingPage />} />
        <Route path="/room-1" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
