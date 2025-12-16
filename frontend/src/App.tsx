import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./AppRouter";
import ApiSmokeTest from "./components/layout/ApiSmokeTest";

const App: React.FC = () => {
  return (
    <>
      {/* ✅ Geçici test butonu */}
      <ApiSmokeTest />

      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
