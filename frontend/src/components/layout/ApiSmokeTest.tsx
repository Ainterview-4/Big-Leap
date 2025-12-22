import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function ApiSmokeTest() {
    const test = async () => {
        try {
            // Trying a simpler endpoint or the one user used. '/interviews' requires auth usually.
            // If we just want to test connectivity, maybe a public endpoint? 
            // User used /interviews. I'll stick to it but handle 401 gracefully.
            const res = await api.get("/interviews");
            toast.success(`✅ Backend OK: ${Array.isArray(res.data) ? res.data.length : 'OK'}`);
            console.log("API response:", res.data);
        } catch (error) {
            const err = error as AxiosError<{ error?: { message?: string }; message?: string }>;
            const msg =
                err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                err?.message ||
                "Request failed";

            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.warning(`⚠️ Backend Reachable but Auth Failed: ${msg}`);
            } else {
                toast.error(`❌ Backend FAIL: ${msg}`);
            }
            console.error(err);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999 }}>
            <button
                onClick={test}
                style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    fontSize: '14px'
                }}
            >
                🔌 Test API
            </button>
        </div>
    );
}
