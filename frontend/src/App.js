import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CollabRoute from "./routes/CollabRoute";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import LoginPage from "./views/login/LoginPage";
import SignupPage from "./views/signup/SignupPage";
import LandingPage from "./views/landing/LandingPage";
import CollabPage from "./views/collab/CollabPage";
import MatchingPage from "./views/MatchingPage";
import CollabPage2 from "./views/collab/CollabPage2";
import HistoryPage from "./views/history/HistoryPage";
import ForgotPasswordPage from "./views/forgotPassword/ForgotPasswordPage";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/match" element={<MatchingPage />} />
          <Route path="/collab" element={<CollabPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route element={<CollabRoute />}>
            <Route path="/collab2" element={<CollabPage2 />} />
          </Route>
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
