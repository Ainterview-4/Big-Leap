export const API_URL = import.meta.env.VITE_API_URL;

console.log('🔍 API_URL loaded:', API_URL);

if (!API_URL) {
    const errorMsg = `
🔥 FATAL ERROR: VITE_API_URL is not defined

Please create a .env file in the frontend directory with:
VITE_API_URL=http://localhost:5001/api

For production, set:
VITE_API_URL=https://api.yourdomain.com/api
    `;
    console.error(errorMsg);
    throw new Error("VITE_API_URL is not defined - check your .env file");
}

// Validate URL format
try {
    new URL(API_URL);
} catch {
    console.error('🔥 FATAL ERROR: VITE_API_URL is not a valid URL:', API_URL);
    throw new Error("VITE_API_URL must be a valid URL");
}

console.log('✅ Frontend configuration validated');
