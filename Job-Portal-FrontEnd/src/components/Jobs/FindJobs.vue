<template>
    <section class="find-jobs-page">
        <h1 class="heading">Find Jobs</h1>
        <div v-if="jobs.length > 0" class="job-cards-container">
            <div
                v-for="(job, index) in jobs"
                :key="job.jobID"
                class="job-card-wrapper"
                @click="goToJobDetails(job.jobID)"
            >
                <JobCard :job="job" :showActions="false" />
            </div>
        </div>
        <p v-else>No jobs available at the moment.</p>
    </section>
</template>

<script setup>
import JobCard from "../jobCard.vue";
import { useJobsStore } from "../../stores/jobs";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const { jobs, fetchJobs } = useJobsStore();
const router = useRouter();

const goToJobDetails = (jobID) => {
    router.push({ name: "JobDetails", params: { jobID } });
};

onMounted(() => {
    fetchJobs();
});
</script>

<style scoped>
.heading {
    font-size: 36px;
    font-weight: bold;
    color: #0077b6;
    margin-top: 80px;
}
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
    margin-top: 30px;
}
.job-card-wrapper {
    cursor: pointer;
}
</style>
