import api from "./axiosInstance";

export const uploadCVRequest = (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Changed "cv" to "file" to match backend

    return api.post<{ message: string; file: string }>("/cv/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
