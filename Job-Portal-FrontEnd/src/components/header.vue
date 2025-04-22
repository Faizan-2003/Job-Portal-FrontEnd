<template>
  <header class="header">
    <div>
      <img src="../assets/images/logo.png" alt="Company Logo" class="logo" />
    </div>
    <div class="menu">
      <div class="menu-item"><router-link to="/">Home</router-link></div>
      <div class="menu-item"><router-link to="/myjobs">My Jobs</router-link></div>
    </div>
    <div class="user-dropdown">
      <span>User Name</span>
      <div class="user-dropdown-content">
        <router-link to="/logout">Logout</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Navigation",
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
