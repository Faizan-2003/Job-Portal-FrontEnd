<template>
    <div class="job-card">
        <!-- Cover Image -->
        <img
            :src="`/img/${job.coverImage}`"
            alt="Job Cover"
            class="job-cover-image"
        />
        <!-- Job Details -->
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
                <strong>{{
                    companyNames[job.jobCompany] || "Loading..."
                }}</strong>
            </p>
        </div>
    </div>
</template>
<script>
import { reactive, onMounted } from "vue";
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

        const fetchCompanyName = async () => {
            try {
                const companyID = props.job.jobCompany;
                if (!companyNames[companyID]) {
                    const companyName = await authStore.getUserByID(companyID);
                    companyNames[companyID] = companyName || "Unknown";
                }
            } catch (error) {
                console.error("Error fetching company name:", error);
            }
        };

        onMounted(fetchCompanyName);

        return { companyNames };
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
</style>
