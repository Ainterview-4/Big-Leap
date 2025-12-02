import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";

import CVUpload from "./pages/CV/CVUpload";
import CVResult from "./pages/CV/CVResult";

import InterviewStart from "./pages/Interview/InterviewStart";
import InterviewQnA from "./pages/Interview/InterviewQnA";
import InterviewResults from "./pages/Interview/InterviewResults";

// ---- PRIVATE ROUTE ---- //
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  // Eğer token yoksa login'e yönlendir
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Eğer token varsa sayfayı göster
  return <>{children}</>;
};

// ---- APP ROUTER ---- //
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* CV MODULE */}
        <Route
          path="/cv/upload"
          element={
            <PrivateRoute>
              <CVUpload />
            </PrivateRoute>
          }
        />

        <Route
          path="/cv/result"
          element={
            <PrivateRoute>
              <CVResult />
            </PrivateRoute>
          }
        />

        {/* INTERVIEW MODULE */}
        <Route
          path="/interview/start"
          element={
            <PrivateRoute>
              <InterviewStart />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview/qna"
          element={
            <PrivateRoute>
              <InterviewQnA />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview/results"
          element={
            <PrivateRoute>
              <InterviewResults />
            </PrivateRoute>
          }
        />

        {/* DEFAULT ROUTES */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
