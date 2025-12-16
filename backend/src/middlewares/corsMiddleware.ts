import cors from "cors";

// İstersen .env'de: CORS_ORIGIN=http://localhost:5173,http://localhost:3000
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // server-to-server veya postman gibi araçlar origin göndermez
        // ve allowedOrigin ile eşleşenler
        if (!origin || origin === allowedOrigin) {
            return callback(null, true);
        }

        // Eğer allowedOrigin virgülle ayrılmış birden fazla domain ise:
        const allowedList = allowedOrigin.split(",").map(s => s.trim());
        if (allowedList.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error(`CORS blocked for origin: ${origin}`),
            false
        );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
