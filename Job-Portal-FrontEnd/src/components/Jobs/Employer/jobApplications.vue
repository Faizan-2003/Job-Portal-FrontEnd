<template>
    <section class="company-applications-page">
        <h2 class="page-title">All Applications for Your Jobs📄</h2>
        <div v-if="loading" class="applications-loading">
            <div v-for="n in 4" :key="n" class="application-card skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line"></div>
            </div>
        </div>
        <div
            v-else-if="jobsStore.companyApplications.length > 0"
            class="applications-list"
        >
            <div
                v-for="app in jobsStore.companyApplications"
                :key="app.applicationID"
                class="application-card"
            >
                <h3 class="job-title">{{ app.jobTitle }}</h3>
                <p><strong>Applicant:</strong> {{ app.applicantName }}</p>
                <p><strong>Location:</strong> {{ app.jobLocation || "N/A" }}</p>
                <p><strong>Salary:</strong>€{{ app.jobSalary || "N/A" }}</p>
                <p><strong>Status:</strong> {{ app.status }}</p>
                <p><strong>Applied On:</strong> {{ app.applied_at }}</p>
            </div>
        </div>
        <div v-else class="empty-state">
            <p>No applications found for your jobs.</p>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/user";
import { useJobsStore } from "@/stores/jobs";

const authStore = useAuthStore();
const jobsStore = useJobsStore();
const loading = ref(true);

const loadApplications = async () => {
    loading.value = true;
    await jobsStore.fetchCompanyApplications(authStore.userID);
    loading.value = false;
};

onMounted(loadApplications);
</script>

<style scoped>
.company-applications-page {
    /* Remove max-width and margin for full width */
    width: 100vw;
    padding: 24px;
    background: #f9f9f9;
    min-height: 100vh;
}
.page-title {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 80px;
    margin-bottom: 24px;
    text-align: center;
    color: #0077b6;
}
.applications-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
}
.application-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    padding: 22px 20px 18px 20px;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 180px;
}
.job-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #0077b6;
    margin-bottom: 8px;
}
.application-card p {
    font-size: 1rem;
    color: #374151;
    margin-bottom: 2px;
}
.application-card p strong {
    color: #1f2937;
    margin-right: 4px;
}
.empty-state {
    text-align: center;
    padding: 40px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-top: 40px;
    font-size: 1.1rem;
    color: #4b5563;
}
.applications-loading {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
}
.skeleton {
    background: #f3f4f6;
    border-radius: 10px;
    padding: 22px 20px 18px 20px;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: pulse 1.5s infinite;
}
.skeleton-title {
    width: 60%;
    height: 22px;
    background: #e5e7eb;
    border-radius: 6px;
}
.skeleton-line {
    width: 90%;
    height: 16px;
    background: #e5e7eb;
    border-radius: 6px;
}
.skeleton-line.short {
    width: 50%;
}
@keyframes pulse {
    0% {
        background-color: #e5e7eb;
    }
    50% {
        background-color: #f3f4f6;
    }
    100% {
        background-color: #e5e7eb;
    }
}
</style>
