<template>
  <footer class="footer">
    <div>
      <img
          src="../assets/images/logo.png"
          alt="Company Logo"
          class="footer-logo"
      />
    </div>
    <div class="copyRight">
      <p>Copyright &copy; 2024 Approach Job - Muhammad Faizan</p>
    </div>
  </footer>
</template>


<script>
export default {
  name: "Footer",
};
</script>


<style scoped>
.footer {
  background-color: #0077b6;
  height: 30px;
  color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-logo {
  width: 100px;
  height: auto;
}
.copyRight {
  text-align: center;
  flex-grow: 1;
}
</style>