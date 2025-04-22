<template>
    <section class="login-page">
        <div class="container">
            <div class="welcome-text">
                <h1>Welcome to ApproachJob.com</h1>
            </div>
            <div class="login-container">
                <h1 class="text-center"><strong>Login</strong></h1>
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
                            placeholder="example@email.com"
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
                        <div class="password-container">
                            <input
                                v-model="password"
                                :type="showPassword ? 'text' : 'password'"
                                id="inputPassword"
                                class="form-control"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div class="show-password-toggle">
                            <input
                                type="checkbox"
                                id="showPasswordCheckbox"
                                v-model="showPassword"
                            />
                            <label for="showPasswordCheckbox"
                                >Show Password</label
                            >
                        </div>
                        <div v-if="errors.password" class="text-danger">
                            {{ errors.password }}
                        </div>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary btn-lg btn-block"
                    >
                        LOGIN
                    </button>
                    <router-link
                        to="/register"
                        class="btn btn-link btn-lg btn-block"
                    >
                        Don't have an account? <strong>Register!</strong>
                    </router-link>
                    <div v-if="errors.other" class="text-danger mt-3">
                        {{ errors.other }}
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import { useAuthStore } from "../stores/user";

export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            showPassword: false,
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

            const authStore = useAuthStore();
            const result = await authStore.login(this.username, this.password);

            if (result.success) {
                this.$router.push("/home");
            } else {
                this.errors.other = result.message;
            }
        },
    },
};
</script>

<style scoped>
.login-page {
    background-color: #0077b6;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 500px;
    text-align: center;
    margin: 0;
    box-sizing: border-box;
}

.welcome-text h1 {
    color: #0077b6;
    font-size: 28px;
    margin-bottom: 20px;
}

.form-label {
    font-weight: bold;
    color: #333;
    text-align: left;
    display: block;
    margin-bottom: 5px;
    font-size: 18px;
}

.form-control {
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    width: 100%;
}

.password-container {
    position: relative;
    margin-bottom: 10px;
}

.show-password-toggle {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: -20px;
    margin-bottom: 20px;
    color: #0077b6;
    justify-content: flex-start;
}

.show-password-toggle input[type="checkbox"] {
    margin-right: 5px;
    cursor: pointer;
}

.show-password-toggle label {
    cursor: pointer;
}

.toggle-password {
    position: absolute;
    right: 10px;
    top: 45%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #0077b6;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.toggle-password i {
    pointer-events: none;
}

.toggle-password:hover {
    text-decoration: none;
}

.btn-primary {
    background-color: #0077b6;
    border: none;
    padding: 15px 20px;
    border-radius: 5px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    width: 100%;
    margin-bottom: 10px;
}

.btn-primary:hover {
    background-color: #005f8a;
}

.btn-link {
    color: #0077b6;
    text-decoration: underline;
    font-size: 18px;
}

.btn-link:hover {
    color: hsl(281, 100%, 27%);
}

.text-danger {
    color: #dc3545;
    font-size: 14px;
    margin-top: -10px;
}
</style>
