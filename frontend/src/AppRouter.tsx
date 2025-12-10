import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";

// CV Modules
import CVUpload from "./pages/CV/CVUpload";
import CVResult from "./pages/CV/CVResult";
import CVOptimize from "./pages/CV/CVOptimize";

import Dashboard from "./pages/Dashboard";
import InterviewStart from "./pages/Interview/InterviewStart";
import InterviewQnA from "./pages/Interview/InterviewQnA";
import InterviewResults from "./pages/Interview/InterviewResults";
import MainLayout from "./components/layout/MainLayout";

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
        {/* AUTH ROUTES (No Sidebar/Navbar) */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* PROTECTED ROUTES (With Layout) */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {/* CV */}
          <Route path="/cv/upload" element={<CVUpload />} />
          <Route path="/cv/result" element={<CVResult />} />
          <Route path="/cv/optimize" element={<CVOptimize />} />

          {/* INTERVIEW */}
          <Route path="/interview/start" element={<InterviewStart />} />
          <Route path="/interview/qna" element={<InterviewQnA />} />
          <Route path="/interview/results" element={<InterviewResults />} />
        </Route>

        {/* DEFAULT ROUTES */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
