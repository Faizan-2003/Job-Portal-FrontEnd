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
            <div class="menu-item"><router-link to="/">Home</router-link></div>
            <div class="menu-item">
                <router-link to="/myjobs">My Jobs</router-link>
            </div>
        </div>
        <div class="user-dropdown">
            <span>{{ userName }}</span>
            <div class="user-dropdown-content">
                <router-link to="/" @click="logout">Logout</router-link>
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
        const router = useRouter();

        const updateUserName = () => {
            userName.value = sessionStorage.getItem("userName") || "Guest";
        };

        onMounted(() => {
            updateUserName();
        });

        // Logout function
        const logout = () => {
            sessionStorage.clear();
            userName.value = "Guest";
            router.push("/");
        };

        return { userName, logout };
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
    height: 50px;
    margin: 0; /* Remove any margin around the header */
    width: 100%; /* Ensure the header spans the full width */
    position: fixed; /* Keep the header fixed at the top */
    top: 0;
    left: 0;
}

/* Logo styles */
.logo {
    width: 100px;
    height: auto;
}

/* User dropdown styles */
.user-dropdown {
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
}

.menu-item:last-child {
    margin-right: 0;
}
</style>
