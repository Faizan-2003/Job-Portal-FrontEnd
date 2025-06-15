<template>
    <div class="custom-job-card">
        <div v-if="loading" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-text skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
        </div>
        <div v-else>
            <img
                v-if="job.coverImage"
                :src="getImageUrl(job.coverImage)"
                alt="Job Cover"
                class="job-cover-image"
            />
            <div class="job-details">
                <h3 class="job-title">{{ job.jobTitle || "Job Title" }}</h3>
                <p>
                    <strong>Company:</strong>
                    {{ companyNames[job.jobCompany] || "Unknown" }}
                </p>
                <p>
                    <strong>Location:</strong>
                    {{ job.jobLocation || "N/A" }}
                </p>
                <p>
                    <strong>Salary:</strong>
                    €{{ job.jobSalary || "N/A" }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "../stores/user";
import $axios from "../axiosInstance";

const props = defineProps({
    job: {
        type: Object,
        required: true,
    },
});

const authStore = useAuthStore();
const companyNames = reactive({});
const loading = ref(true);

const fetchCompanyName = async () => {
    try {
        const companyID = props.job.jobCompany;
        if (!companyNames[companyID]) {
            const companyName = await authStore.getUserByID(companyID);
            companyNames[companyID] = companyName || "Unknown";
        }
    } catch (error) {
        console.error("Error fetching company name:", error);
    } finally {
        loading.value = false;
    }
};

const getImageUrl = (filename) => {
    if (!filename) return "/default-image.png";
    return `${$axios.imgBaseURL}/${filename}`;
};

onMounted(fetchCompanyName);
</script>

<style scoped>
.custom-job-card {
    width: 330px;
    min-width: 330px;
    max-width: 330px;
    min-height: 370px;
    max-height: 430px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    padding: 24px;
    transition: box-shadow 0.2s;
    border: 1px solid #e5e7eb;
}
.custom-job-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
    background: #f7faff;
}
.job-cover-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 12px;
    background: #f3f4f6;
}
.job-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    justify-content: flex-start;
}
.job-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: #0077b6;
}
.job-details p {
    font-size: 1rem;
    margin-bottom: 2px;
    color: #4b5563;
}
.job-details p strong {
    color: #1f2937;
}
.skeleton-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    background-color: #f4f4f4;
    border-radius: 10px;
    animation: pulse 1.5s infinite;
    min-height: 330px;
    justify-content: center;
}
.skeleton-image {
    width: 100%;
    height: 160px;
    background-color: #e0e0e0;
    border-radius: 8px;
}
.skeleton-text {
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 5px;
}
.skeleton-title {
    width: 70%;
}
.skeleton-text:not(.skeleton-title) {
    width: 90%;
}
@keyframes pulse {
    0% {
        background-color: #e0e0e0;
    }
    50% {
        background-color: #f0f0f0;
    }
    100% {
        background-color: #e0e0e0;
    }
}
</style>
