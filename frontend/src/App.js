import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import LandingPage from "./components/LandingPage"
import MatchingPage from "./components/MatchingPage"
import RoomPage from "./components/RoomPage"
import "./App.css"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/match" element={<MatchingPage />} />
                <Route path="/room-1" element={<RoomPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
