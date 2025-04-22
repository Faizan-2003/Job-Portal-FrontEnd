<template>
    <section>
        <div class="container-fluid">
            <div class="row">
                <div
                    class="col-md-6 d-flex align-items-center justify-content-center"
                >
                    <div class="text-center">
                        <h1 class="welcome-text">Welcome to Approachjob.com</h1>
                    </div>
                </div>
                <div
                    class="col-md-6 d-flex align-items-center justify-content-center"
                >
                    <div
                        class="login-form d-flex flex-column justify-content-center"
                    >
                        <h2 class="text-center"><strong>Login</strong></h2>
                        <form @submit.prevent="validateLogin">
                            <div class="mb-3">
                                <label for="inputUsername" class="form-label"
                                    >Username</label
                                >
                                <input
                                    v-model="username"
                                    id="inputUsername"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                                <div v-if="errors.username" class="text-danger">
                                    {{ errors.username }}
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="inputPassword" class="form-label"
                                    >Password</label
                                >
                                <input
                                    v-model="password"
                                    id="inputPassword"
                                    type="password"
                                    class="form-control"
                                    required
                                />
                                <div v-if="errors.password" class="text-danger">
                                    {{ errors.password }}
                                </div>
                            </div>
                            <button
                                type="submit"
                                class="btn btn-primary btn-lg btn-block"
                            >
                                Login
                            </button>
                            <router-link
                                to="/register"
                                class="btn btn-link btn-lg btn-block"
                                >Don't have an account? Register!</router-link
                            >
                            <div v-if="errors.other" class="text-danger mt-3">
                                {{ errors.other }}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import $axios from "../axiosInstance.js";
import { useRouter } from "vue-router";

export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            errors: {
                username: null,
                password: null,
                other: null,
            },
        };
    },
    methods: {
        async validateLogin() {
            this.errors = { username: null, password: null, other: null };
            try {
                const response = await $axios.post("/api/login", {
                    email: this.username,
                    password: this.password,
                });

                console.log(response);

                // Handle successful login
                if (response.status === 200 && response.data.token) {
                    // Store token and username in session storage
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("userName", response.data.userEmail);

                    this.$router.push("/home");
                    return;
                }
            } catch (error) {
                // Handle errors
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    this.errors.other = error.response.data.message;
                } else {
                    this.errors.other = "An error occurred. Please try again.";
                }
            }
        },
    },
};
</script>
<style scoped>
/* Your CSS styles */
</style>
