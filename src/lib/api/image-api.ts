import axios from "axios";

export const IMAGE_API = {
    UPLOAD: `${import.meta.env.VITE_BACKEND_API}/images/upload`,
    GET: `${import.meta.env.VITE_BACKEND_API}/images`,
};

export interface UploadImageResponse {
    id: string;
    name: string;
    filename: string;
    url: string;
    userId?: string | null;
    workspaceId?: string | null;
    collectionId?: string | null;
    folderId?: string | null;
    itemId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export const uploadImage = async (
    file: File,
    options?: {
        userId?: string;
        workspaceId?: string;
        collectionId?: string;
        folderId?: string;
        itemId?: string;
    }
): Promise<UploadImageResponse> => {
    const accessToken = localStorage.getItem("access_token");
    
    const formData = new FormData();
    formData.append("image", file);
    
    if (options?.userId) {
        formData.append("userId", options.userId);
    }
    if (options?.workspaceId) {
        formData.append("workspaceId", options.workspaceId);
    }
    if (options?.collectionId) {
        formData.append("collectionId", options.collectionId);
    }
    if (options?.folderId) {
        formData.append("folderId", options.folderId);
    }
    if (options?.itemId) {
        formData.append("itemId", options.itemId);
    }
    
    const response = await axios.post<UploadImageResponse>(IMAGE_API.UPLOAD, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    
    return response.data;
};

export const getImage = async (id: string): Promise<UploadImageResponse> => {
    const accessToken = localStorage.getItem("access_token");
    
    const response = await axios.get<UploadImageResponse>(IMAGE_API.GET, {
        params: { id },
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    
    return response.data;
};


