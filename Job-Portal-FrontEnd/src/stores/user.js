import { defineStore } from "pinia";
import $axios from "../axiosInstance";

export const useAuthStore = defineStore("user", {
    state: () => ({
        userName: sessionStorage.getItem("userName") || "",
        userType: sessionStorage.getItem("userType") || "",
        token: sessionStorage.getItem("token") || "",
        userID: sessionStorage.getItem("userID") || "",
    }),
    actions: {
        async login(email, password) {
            try {
                const response = await $axios.post("login", {
                    email,
                    password,
                });

                if (response.status === 200 && response.data.token) {
                    this.token = response.data.token;
                    this.userID = response.data.id;
                    this.userName = response.data.userEmail;
                    this.userType = response.data.userType;

                    sessionStorage.setItem("userID", this.userID);
                    sessionStorage.setItem("token", this.token);
                    sessionStorage.setItem("userName", this.userName);
                    sessionStorage.setItem("userType", this.userType);

                    return { success: true };
                }
            } catch (error) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    return {
                        success: false,
                        message: error.response.data.message,
                    };
                }
                return {
                    success: false,
                    message: "An error occurred. Please try again.",
                };
            }
        },

        async register(userData) {
            try {
                const response = await $axios.post("register", userData);

                if (response.status === 201) {
                    return { success: true };
                }
            } catch (error) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    return {
                        success: false,
                        message: error.response.data.message,
                    };
                }
                return {
                    success: false,
                    message: "An error occurred. Please try again.",
                };
            }
        },

        async getUserByID(userID) {
            try {
                const response = await $axios.get(`user/${userID}`);

                if (response && response.data) {
                    if (response.data.user && response.data.user.userName) {
                        return response.data.user.userName;
                    } else {
                        return "Unknown";
                    }
                } else {
                    return "Unknown";
                }
            } catch (error) {
                return "Unknown";
            }
        },
    },
});
