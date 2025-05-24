<template>
    <section class="my-applications-page">
        <h2>My Applications</h2>
        <div
            v-if="Array.isArray(myApplications) && myApplications.length > 0"
            class="job-cards-container"
        >
            <div
                v-for="(app, idx) in myApplications"
                :key="app.applicationID"
                class="job-card-wrapper"
                @click="goToJobDetails(app.jobID)"
            >
                <JobCard
                    v-if="app.jobDetails"
                    :job="app.jobDetails"
                    :showActions="false"
                />
                <div class="application-status">
                    <p><strong>Status:</strong> {{ app.status }}</p>
                    <p>
                        <strong>Applied On:</strong>
                        {{ app.applied_at || "N/A" }}
                    </p>
                </div>
            </div>
        </div>
        <p v-else>No applications found.</p>
    </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useJobsStore } from "../../../stores/jobs";
import { useAuthStore } from "../../../stores/user";
import { useRouter } from "vue-router";
import JobCard from "../../jobCard.vue";

const { myApplications, fetchMyApplications } = useJobsStore();
const { userID } = useAuthStore();
const router = useRouter();

const goToJobDetails = (jobID) => {
    router.push({ name: "JobDetails", params: { jobID } });
};

onMounted(async () => {
    await fetchMyApplications(userID);
});
</script>

<style scoped>
.my-applications-page {
    padding: 32px 16px;
    max-width: 1200px;
    margin: 0 auto;
}
.job-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: flex-start;
}
.job-card-wrapper {
    cursor: pointer;
    width: 330px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
}
.application-status {
    margin: 12px 0 0 0;
    font-size: 16px;
    background: #f7faff;
    border-radius: 8px;
    padding: 8px 12px;
}
</style>
