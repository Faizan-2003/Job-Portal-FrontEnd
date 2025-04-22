<template>
    <div class="job-card" v-for="job in jobs" :key="job.id">
        <!-- Cover Image -->
        <img
            :src="`/public/img/${job.coverImage}`"
            alt="Job Cover"
            class="job-cover-image"
        />
        <!-- Job Details -->
        <div class="job-details">
            <h2 class="job-title">{{ job.jobTitle }}</h2>
            <p class="job-salary">Salary: {{ job.jobSalary }}</p>
            <p class="job-location">Location: {{ job.jobLocation }}</p>
            <p class="job-company">Company: {{ job.jobCompany }}</p>
        </div>
    </div>
</template>
<script>
import { onMounted } from "vue";
import { useJobsStore } from "../stores/jobs";

export default {
    name: "JobCard",
    setup() {
        const { jobs, fetchJobs } = useJobsStore();

        onMounted(() => {
            fetchJobs();
        });

        return { jobs };
    },
};
</script>
<style scoped>
.job-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    margin: 20px;
    width: 300px;
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
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #0077b6;
}

.job-salary,
.job-location,
.job-company {
    font-size: 16px;
    margin: 5px 0;
    color: #333;
}
</style>
