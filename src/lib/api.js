import Cookies from "js-cookie";

// The base URL of your backend API
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// A helper function to always get the latest token and set headers
const getAuthHeaders = () => {
    const token = Cookies.get("accessToken");
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

// The new fetcher function for all SWR calls
export const fetcher = (url) => 
    fetch(`${API_URL}${url}`, {
        headers: { "Authorization": `Bearer ${Cookies.get("accessToken")}` }
    }).then((res) => {
        if (!res.ok) {
            const error = new Error("An API error occurred while fetching data.");
            // You can add more error info here if needed
            throw error;
        }
        return res.json();
    });

// The main API client object
const apiClient = {
    post: async (url, data) => {
        const response = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || errorData.error || "An API error occurred.");
        }
        return response.json();
    },
    // You can add get, put, delete methods here later
};

export default apiClient;