<template>
    <section class="posted-jobs-page">
        <div class="top-actions">
            <button class="post-btn" @click="goToAddJob">+ Post New Job</button>
        </div>
        <p class="heading">Your Posted Jobs</p>
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
        </div>
        <div v-else>
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
        </div>
    </section>
</template>

<script setup>
import JobCard from "../jobCard.vue";
import { useJobsStore } from "../../stores/jobs";
import { useAuthStore } from "../../stores/user";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const { companyJobs, fetchCompanyJobs } = useJobsStore();
const { userID } = useAuthStore();
const router = useRouter();

const loading = ref(true);

onMounted(async () => {
    loading.value = true;
    try {
        await fetchCompanyJobs(userID);
    } catch (error) {
        console.error("Error fetching jobs:", error);
    } finally {
        loading.value = false;
    }
});

const goToJobDetails = (jobID) => {
    router.push({ name: "JobDetails", params: { jobID } });
};
const goToAddJob = () => {
    router.push({ name: "PostJob" });
};
</script>

<style scoped>
.top-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
}
.post-btn {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}
.post-btn:hover {
    background-color: #0056b3;
}
.heading {
    font-size: 36px;
    font-weight: bold;
    color: #0077b6;
    text-align: left;
}
.posted-jobs-page {
    margin-top: 100px;
    padding: 20px;
}

.job-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin-top: 20px;
}

.job-card {
    cursor: pointer;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top: 5px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
