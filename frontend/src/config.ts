export const API_URL = import.meta.env.VITE_API_URL;

console.log('🔍 API_URL loaded:', API_URL);

if (!API_URL) {
    throw new Error("VITE_API_URL is not defined");
}
