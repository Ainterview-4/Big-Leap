import api from "./axiosInstance";

export const uploadCVRequest = (file: File) => {
    // --- MOCK IMPLEMENTATION START ---
    // Since the backend endpoint /cv/upload is not yet implemented,
    // we simulate a successful API call here so the Frontend flow can be tested.

    return new Promise<{ data: { message: string; file: string } }>((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    message: "CV uploaded successfully (MOCK)",
                    file: file.name,
                },
            });
        }, 1500); // Simulate network delay
    });
    // --- MOCK IMPLEMENTATION END ---

    /* 
    // REAL IMPLEMENTATION (Uncomment when backend is ready)
    const formData = new FormData();
    formData.append("cv", file);
  
    return api.post<{ message: string; file: string }>("/cv/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    */
};
