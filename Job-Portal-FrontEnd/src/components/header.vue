<template>
  <header class="header">
    <div>
      <img src="logo.png" alt="Company Logo" class="logo" />
    </div>
    <div class="menu">
      <div class="menu-item">Home</div>
      <div class="menu-item">My Jobs</div>
    </div>
    <div class="user-dropdown">
      <span>User Name</span>
      <div class="user-dropdown-content">
        <a href="#">Logout</a>
      </div>
    </div>
  </header>

</template>


<script>
import { useAuthStore } from '@/store/auth.js';
import { useRouter } from 'vue-router';

export default {
  name: "Navigation",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    return { authStore, logout };
  },
};
</script>


<style scoped>
.header {
  background-color: #0077b6;
  color: #fff;
  padding: 20px 40px; /* Increased padding */
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px; /* Increased height */
}
.logo {
  width: 100px;
  height: auto;
}
.user-dropdown {
  position: relative;
  cursor: pointer;
}
.user-dropdown-content {
  display: none;
  position: absolute;
  background-color: #ffffff; /* Changed background color */
  min-width: 100px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2); /* Improved shadow */
  z-index: 1;
  top: 20px; /* Adjusted dropdown position */
  right: 0;
  border-radius: 5px; /* Rounded corners */
  padding: 10px;
}
.user-dropdown:hover .user-dropdown-content {
  display: block;
}
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