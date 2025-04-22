<template>
    <header class="header">
        <div>
            <img
                src="../assets/images/logo.png"
                alt="Company Logo"
                class="logo"
            />
        </div>
        <div class="menu">
            <!-- Conditional rendering based on userType -->
            <button
                class="menu-item"
                v-if="userType === 'Employer'"
                @click="navigateTo('/')"
            >
                Home
            </button>
            <button
                class="menu-item"
                v-if="userType === 'Employer'"
                @click="navigateTo('/postedjobs')"
            >
                Posted Jobs
            </button>
            <button
                class="menu-item"
                v-if="userType === 'Employer'"
                @click="navigateTo('/jobapplications')"
            >
                Job Applications
            </button>

            <button
                class="menu-item"
                v-if="userType === 'Applicant'"
                @click="navigateTo('/')"
            >
                Home
            </button>
            <button
                class="menu-item"
                v-if="userType === 'Applicant'"
                @click="navigateTo('/findjobs')"
            >
                Find Jobs
            </button>
            <button
                class="menu-item"
                v-if="userType === 'Applicant'"
                @click="navigateTo('/myapplications')"
            >
                My Applications
            </button>
        </div>
        <div class="user-dropdown">
            <span>{{ userName }}</span>
            <div class="user-dropdown-content">
                <button @click="logout">Logout</button>
            </div>
        </div>
    </header>
</template>
<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
    name: "Navigation",
    setup() {
        const userName = ref("Guest");
        const userType = ref(""); // Store the user type
        const router = useRouter();

        const updateUserDetails = () => {
            userName.value = sessionStorage.getItem("userName") || "Guest";
            userType.value = sessionStorage.getItem("userType") || ""; // Get userType from sessionStorage
        };

        const navigateTo = (path) => {
            router.push(path); // Navigate to the specified path
        };

        onMounted(() => {
            updateUserDetails();
        });

        // Logout function
        const logout = () => {
            sessionStorage.clear();
            userName.value = "Guest";
            userType.value = ""; // Clear userType
            router.push("/");
        };

        return { userName, userType, logout, navigateTo };
    },
};
</script>
<style scoped>
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Header styles */
.header {
    background-color: #0077b6;
    color: #fff;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    margin: 0;
    width: 100%; /* Ensure the header spans the full width */
    position: fixed; /* Keep the header fixed at the top */
    top: 0;
    left: 0;
}

.logo {
    width: 100px;
    height: auto;
}

.user-dropdown {
    background-color: #ffffff;
    color: #000000;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 18px;
    position: relative;
    cursor: pointer;
}

.user-dropdown-content {
    display: none;
    position: absolute;
    background-color: #ffffff;
    min-width: 100px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index: 1;
    top: 20px;
    right: 0;
    border-radius: 5px;
    padding: 10px;
}

.user-dropdown:hover .user-dropdown-content {
    display: block;
}

/* Menu styles */
.menu {
    display: flex;
}

.menu-item {
    margin-right: 40px;
    cursor: pointer;
    font-size: 20px;
    color: #ffffff; /* White text */
    background: none; /* No background */
    border: none; /* No border */
    padding: 0;
    text-transform: uppercase;
    font-weight: bold;
}

.menu-item:hover {
    color: #ffdd00; /* Yellow hover effect */
    text-decoration: underline; /* Underline on hover */
}

.menu-item:last-child {
    margin-right: 0;
}

/* Button reset for dropdown */
.user-dropdown-content button {
    background: none;
    border: none;
    color: #0077b6;
    cursor: pointer;
    font-size: 16px;
    text-align: left;
    padding: 5px 0;
    width: 100%;
}

.user-dropdown-content button:hover {
    color: #005f8a;
    text-decoration: underline;
}
</style>
