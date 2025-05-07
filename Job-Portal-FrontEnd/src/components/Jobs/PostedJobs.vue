<template>
    <section class="posted-jobs-page">
        <h1>Your Posted Jobs</h1>
        <div v-if="companyJobs.length > 0" class="job-cards-container">
            <div
                v-for="(job, index) in companyJobs"
                :key="job.jobID"
                class="job-card"
                @click="goToJobDetails(job.jobID)"
            >
                <JobCard :job="job" />
            </div>
        </div>
        <p v-else>No jobs posted yet.</p>
    </section>
</template>

<script setup>
import JobCard from "../jobCard.vue";
import { useJobsStore } from "../../stores/jobs";
import { useAuthStore } from "../../stores/user";
import { onMounted } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router

const { companyJobs, fetchCompanyJobs } = useJobsStore();
const { userID } = useAuthStore();
const router = useRouter(); // Initialize Vue Router

onMounted(() => {
    fetchCompanyJobs(userID); // Fetch jobs posted by the logged-in company
});

// Navigate to JobDetails page
const goToJobDetails = (jobID) => {
    router.push({ name: "JobDetails", params: { jobID } }); // Pass jobID as a route parameter
};
</script>

<style scoped>
.posted-jobs-page {
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
}

.job-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin-top: 20px;
}

.job-card {
    cursor: pointer; /* Add pointer cursor to indicate clickability */
}
</style>
