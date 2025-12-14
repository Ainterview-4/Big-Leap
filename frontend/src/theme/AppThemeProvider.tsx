import React, { useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { getDesignTokens } from "./muiTheme";
import { ColorModeContext } from "./ThemeContext";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize state lazily to avoid useEffect synchronization issues
    const [mode, setMode] = useState<PaletteMode>(() => {
        try {
            const savedMode = localStorage.getItem("themeMode");
            return (savedMode === "light" || savedMode === "dark") ? savedMode : "light";
        } catch (e) {
            return "light";
        }
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === "light" ? "dark" : "light";
                    localStorage.setItem("themeMode", newMode);
                    return newMode;
                });
            },
            mode,
        }),
        [mode]
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ColorModeContext.Provider>
    );
};
