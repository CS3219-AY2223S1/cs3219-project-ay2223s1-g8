import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import LandingPage from "./views/LandingPage";
import MatchingPage from "./views/MatchingPage";
import RoomPage from "./views/RoomPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/match" element={<MatchingPage />} />
        <Route path="/room-1" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
