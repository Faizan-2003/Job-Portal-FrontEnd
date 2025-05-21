<template>
    <div class="job-card">
        <div v-if="loading" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-text skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
        </div>
        <div v-else>
            <img
                :src="getImageUrl(job.coverImage)"
                alt="Job Cover"
                class="job-cover-image"
            />
            <div class="job-details">
                <h2 class="job-title">{{ job.jobTitle }}</h2>
                <p class="job-salary">
                    Salary: <strong>€{{ job.jobSalary }}</strong>
                </p>
                <p class="job-location">
                    Location: <strong>{{ job.jobLocation }}</strong>
                </p>
                <p class="job-company">
                    Company:
                    <strong>{{ companyNames[job.jobCompany] }}</strong>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "../stores/user";

export default {
    name: "JobCard",
    props: {
        job: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
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
            return `http://localhost/img/${filename}`;
        };
        onMounted(fetchCompanyName);

        return { companyNames, loading, getImageUrl };
    },
};
</script>

<style scoped>
.job-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 20px;
    margin: 20px;
    width: 330px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
}

.job-card:hover {
    transform: translateY(-5px);
}

.job-cover-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.job-details {
    padding: 15px;
    background-color: #ffffff;
}

.job-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #0077b6;
}

.job-salary,
.job-location,
.job-company {
    font-size: 17px;
    margin: 5px 0;
    color: #333;
}

.skeleton-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    background-color: #f4f4f4;
    border-radius: 10px;
    animation: pulse 1.5s infinite;
}

.skeleton-image {
    width: 100%;
    height: 200px;
    background-color: #e0e0e0;
    border-radius: 10px;
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
