import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
