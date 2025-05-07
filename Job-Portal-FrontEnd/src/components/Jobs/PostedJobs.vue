<template>
    <section class="posted-jobs-page">
        <h1>Your Posted Jobs</h1>
        <div v-if="companyJobs.length > 0" class="job-cards-container">
            <JobCard
                v-for="(job, index) in companyJobs"
                :key="job.jobID"
                :job="job"
            />
        </div>
        <p v-else>No jobs posted yet.</p>
    </section>
</template>

<script setup>
import JobCard from "../jobCard.vue";
import { useJobsStore } from "../../stores/jobs";
import { useAuthStore } from "../../stores/user";
import { onMounted } from "vue";

const { companyJobs, fetchCompanyJobs } = useJobsStore();
const { userID } = useAuthStore();

onMounted(() => {
    fetchCompanyJobs(userID);
});
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
    margin-top: 60px;
}
</style>
