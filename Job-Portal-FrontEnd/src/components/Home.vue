<template>
    <section class="home-page">
        <div class="user-message">
            <p v-if="userType === 'Applicant'">
                Go to <a href="/find-jobs">Find Jobs</a> if you are looking for
                some jobs.
            </p>
            <p v-else-if="userType === 'Employer'">
                Go to <a href="/posted-jobs">Your Posted Jobs</a> to manage your
                job postings.
            </p>
        </div>
        <div class="job-cards-container">
            <JobCard
                v-for="(job, index) in jobs.slice(0, 4)"
                :key="job.jobID"
                :job="job"
            />
        </div>
    </section>
</template>
<script setup>
import JobCard from "./jobCard.vue";
import { useJobsStore } from "../stores/jobs";
import { useAuthStore } from "../stores/user";
import { onMounted } from "vue";

const { jobs, fetchJobs } = useJobsStore();
const { userType } = useAuthStore();

onMounted(() => {
    fetchJobs();
});
</script>

<style scoped>
.home-page {
    background-color: #f9f9f9;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-message {
    margin-top: 120px;
    font-size: 36px;
    color: #333;
    text-align: center;
}

.user-message a {
    color: #0077b6;
    text-decoration: none;
    font-weight: bold;
}

.user-message a:hover {
    text-decoration: underline;
}

.job-cards-container {
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}
</style>
