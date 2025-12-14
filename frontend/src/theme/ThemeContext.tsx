import { createContext, useContext } from "react";
import type { PaletteMode } from "@mui/material";

interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: PaletteMode;
}

export const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => { },
    mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

