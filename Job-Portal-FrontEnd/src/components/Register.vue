<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Register</h1>
      <form @submit.prevent="onSubmit">
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div>
          <label for="user-type">User Type:</label>
          <select id="user-type" v-model="userType" required>
            <option value="applicant">Applicant</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <div>
          <label for="location">Location:</label>
          <input type="text" id="location" v-model="location" required />
        </div>
        <div>
          <label for="email">Email Address:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div>
          <input type="submit" value="Register" />
        </div>
      </form>
      <p class="login-link">Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const userType = ref('applicant'); // Default value for user type
const location = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const onSubmit = async () => {
  const userData = {
    name: name.value,
    email: email.value,
    password_hash: password.value,
    role: userType.value
  };

  try {
    const response = await post('/register', userData);
    if (response && response.data && response.data.authToken) {
      // Registration successful
      // Redirect to login page or show a success message
      router.push('/login');
    } else {
      // Registration failed
      // Handle failure case
    }
  } catch (error) {
    // Handle error
  }
};
</script>

<style scoped>
.register-container {
  text-align: center;
}

.register-box {
  background-color: #0077b6;
  padding: 35px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  margin: 0 auto;
}

.register-box h1 {
  color: #fff;
}

.register-box form {
  display: flex;
  flex-direction: column;
}

.register-box label {
  color: #fff;
  margin-bottom: 10px;
}

.register-box input[type="text"],
.register-box input[type="email"],
.register-box input[type="password"],
.register-box select {
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
}

.register-box input[type="submit"] {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  background-color: #213b48;
  color: #fff;
  cursor: pointer;
}

.register-box input[type="submit"]:hover {
  background-color: #23607e;
}

.login-link {
  color: #fff;
  margin-top: 20px;
}
</style>
