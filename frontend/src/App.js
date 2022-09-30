import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import LoginPage from "./views/login/LoginPage";
import SignupPage from "./views/signup/SignupPage";
import LandingPage from "./views/landing/LandingPage";
// import CollabPage from "./views/collab/CollabPage";
import MatchingPage from "./views/MatchingPage";
import RoomPage from "./views/room/RoomPage";
import "./App.scss";
import ForgotPasswordPage from "./views/forgotPassword/ForgotPasswordPage";
import Room2 from "./views/room/Room2";
import CollabPageV2 from "./views/collabTest/Editor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/collabTemp" element={<CollabPageV2 />} /> */}
        <Route element={<PrivateRoutes />}>
          <Route path="/match" element={<MatchingPage />} />
          <Route path="/room1" element={<RoomPage />} />
          <Route path="/room2" element={<Room2 />} />
          <Route path="/collab" element={<CollabPageV2 />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
