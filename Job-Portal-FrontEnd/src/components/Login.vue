<template>
  <div class="login-container">
    <img src="../assets/images/logo.png" alt="Logo" class="logo"/>
    <div class="login-content">
      <div class="login-box">
        <h1>Login</h1>
        <form>
          <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required/>
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required/>
          </div>
          <div>
            <input type="submit" value="Login"/>
            <p class="register"><router-link to="/register">Don't have an account? Register!</router-link></p>
          </div>
        </form>
      </div>
      <p class="mt-5 mb-3 text-black copyRight">
        &#169; ApproachJob.com
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Login',
});
</script>

<style scoped>
h1 {
  color: #000;
  margin-bottom: 10px;
}

.login-container {
  text-align: center;
}

.login-box {
  background-color: #0077b6;
  padding: 35px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  margin: 0 auto;
}

.login-box form {
  display: flex;
  flex-direction: column;
}

.login-box label {
  color: #fff;
  margin-bottom: 20px;
  margin-top: 10px;
}

.login-box input[type="text"],
.login-box input[type="password"] {
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
}

.login-box input[type="submit"] {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  background-color: #213b48;
  color: #fff;
  cursor: pointer;
}

.login-box input[type="submit"]:hover {
  background-color: #23607e;
}

.logo {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
}

.login-content {
  margin-top: 20px;
}

.copyRight {
  margin-top: 20px;
  color: #000;
}

.register {
  margin-top: 20px;
}
</style>
