import Cookies from "js-cookie";

export const getUserData = () => {
    try {
        const user = Cookies.get("userData");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user data from cookies", error);
        return null;
    }
};
