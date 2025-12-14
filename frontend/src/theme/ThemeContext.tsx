import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { getDesignTokens } from "./muiTheme";

interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: PaletteMode;
}

const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => { },
    mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Sistem tercihini veya local storage'ı kontrol et
    const [mode, setMode] = useState<PaletteMode>("light");

    useEffect(() => {
        const savedMode = localStorage.getItem("themeMode") as PaletteMode;
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

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
