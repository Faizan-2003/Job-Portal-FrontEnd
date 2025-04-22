<template>
    <section class="register-page">
        <div class="container">
            <div class="welcome-text">
                <h1>Welcome to ApproachJob.com</h1>
            </div>
            <div class="register-container">
                <h1 class="text-center register-heading">
                    <strong>Register</strong>
                </h1>
                <form @submit.prevent="onSubmit">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name" class="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                v-model="name"
                                class="form-control"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="email" class="form-label"
                                >Email Address</label
                            >
                            <input
                                type="email"
                                id="email"
                                v-model="email"
                                class="form-control"
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="user-type" class="form-label"
                                >User Type</label
                            >
                            <select
                                id="user-type"
                                v-model="userType"
                                class="form-control"
                                required
                            >
                                <option value="applicant">Applicant</option>
                                <option value="employer">Employer</option>
                            </select>
                        </div>
                    </div>

                    <!-- Password and Confirm Password in one row -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="password" class="form-label"
                                >Password</label
                            >
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                id="password"
                                v-model="password"
                                class="form-control"
                                placeholder="Enter your password"
                                required
                            />
                            <div class="show-password-toggle">
                                <input
                                    type="checkbox"
                                    id="show-password"
                                    v-model="showPassword"
                                />
                                <label for="show-password">Show Password</label>
                            </div>
                            <div v-if="passwordError" class="text-danger">
                                {{ passwordError }}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="confirm-password" class="form-label"
                                >Confirm Password</label
                            >
                            <input
                                :type="
                                    showConfirmPassword ? 'text' : 'password'
                                "
                                id="confirm-password"
                                v-model="confirmPassword"
                                class="form-control"
                                placeholder="Confirm your password"
                                required
                            />
                            <div class="show-password-toggle">
                                <input
                                    type="checkbox"
                                    id="show-confirm-password"
                                    v-model="showConfirmPassword"
                                />
                                <label for="show-confirm-password"
                                    >Show Confirm Password</label
                                >
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="confirmPasswordError"
                        class="text-danger centered-error"
                    >
                        {{ confirmPasswordError }}
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        class="btn btn-primary btn-lg btn-block"
                    >
                        REGISTER
                    </button>
                    <router-link to="/" class="btn btn-link btn-lg btn-block">
                        Already have an account? <strong>Login!</strong>
                    </router-link>
                    <div v-if="message" :class="messageClass" class="mt-3">
                        {{ message }}
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import $axios from "../axiosInstance";

const name = ref("");
const userType = ref("applicant");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordError = ref("");
const confirmPasswordError = ref("");
const message = ref("");
const messageClass = ref("");
const router = useRouter();

const validatePassword = () => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password.value)) {
        passwordError.value =
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
        return false;
    }
    passwordError.value = "";
    return true;
};

const validateConfirmPassword = () => {
    if (password.value !== confirmPassword.value) {
        confirmPasswordError.value = "Passwords do not match.";
        return false;
    }
    confirmPasswordError.value = "";
    return true;
};

const onSubmit = async () => {
    if (!validatePassword() || !validateConfirmPassword()) {
        return;
    }

    const userData = {
        name: name.value,
        email: email.value,
        password: password.value,
        type: userType.value,
    };

    try {
        const response = await $axios.post("/api/register", userData);
        if (response && response.data) {
            message.value = "Registration successful! Redirecting to login...";
            messageClass.value = "text-success";
            setTimeout(() => {
                router.push("/");
            }, 2000);
        }
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            message.value = error.response.data.message;
        } else {
            message.value = "An error occurred. Please try again.";
        }
        messageClass.value = "text-danger";
    }
};
</script>
<style scoped>
.register-page {
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
    max-width: 700px;
    text-align: center;
    margin: 0;
    box-sizing: border-box;
}

.welcome-text h1 {
    color: #0077b6;
    font-size: 28px;
    margin-bottom: 20px;
}

.register-heading {
    margin-bottom: 20px;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    flex: 1;
}

.full-width {
    flex: 1 1 100%;
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
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    width: 100%;
}

.show-password-toggle {
    margin-top: 5px;
    font-size: 14px;
    color: #0077b6;
    display: flex;
    align-items: center;
}

.show-password-toggle input[type="checkbox"] {
    margin-right: 5px;
    cursor: pointer;
}

.centered-error {
    font-size: 16px;
    color: #dc3545;
    margin-bottom: 20px;
    text-align: center;
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

.text-success {
    color: #28a745;
    margin-top: 20px;
}

.text-danger {
    color: #dc3545;
    font-size: 18px;
    margin-top: 20px;
}
</style>
