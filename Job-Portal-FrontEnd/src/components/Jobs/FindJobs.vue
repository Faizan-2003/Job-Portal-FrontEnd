<template>
    <section class="find-jobs-page">
        <h1>Find Jobs</h1>
        <div v-if="jobs.length > 0" class="job-cards-container">
            <JobCard v-for="(job, index) in jobs" :key="job.jobID" :job="job" />
        </div>
        <p v-else>No jobs available at the moment.</p>
    </section>
</template>

<script setup>
import JobCard from "../jobCard.vue";
import { useJobsStore } from "../../stores/jobs";
import { onMounted } from "vue";

const { jobs, fetchJobs } = useJobsStore();

onMounted(() => {
    fetchJobs();
});
</script>

<style scoped>
.find-jobs-page {
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
