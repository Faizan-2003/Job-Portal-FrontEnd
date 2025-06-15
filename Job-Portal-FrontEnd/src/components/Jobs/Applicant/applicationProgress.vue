<template>
    <section class="job-progress-page">
        <!-- Skeleton Loading State -->
        <div v-if="skeleton" class="skeleton-container">
            <div class="skeleton-title"></div>
            <div class="skeleton-job-details">
                <div class="skeleton-text skeleton-job-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
            </div>
            <div class="skeleton-progress-bar">
                <div class="skeleton-stage-labels">
                    <span class="skeleton-label"></span>
                    <span class="skeleton-label"></span>
                    <span class="skeleton-label"></span>
                </div>
                <div class="skeleton-progress-track"></div>
            </div>
            <div class="skeleton-stages">
                <div class="skeleton-stage-item">
                    <div class="skeleton-stage-icon"></div>
                    <div class="skeleton-stage-details">
                        <div class="skeleton-text skeleton-stage-title"></div>
                        <div class="skeleton-text"></div>
                    </div>
                </div>
                <div class="skeleton-stage-item">
                    <div class="skeleton-stage-icon"></div>
                    <div class="skeleton-stage-details">
                        <div class="skeleton-text skeleton-stage-title"></div>
                        <div class="skeleton-text"></div>
                    </div>
                </div>
                <div class="skeleton-stage-item">
                    <div class="skeleton-stage-icon"></div>
                    <div class="skeleton-stage-details">
                        <div class="skeleton-text skeleton-stage-title"></div>
                        <div class="skeleton-text"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button @click="retryFetch">Try Again</button>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="loading">
            Loading application details...
        </div>

        <!-- Main Content -->
        <div v-else-if="job" class="progress-container">
            <h1>Job Application Progress</h1>
            <div class="job-details">
                <h2>{{ job.jobTitle || "Job Title" }}</h2>
                <p><strong>Company:</strong> {{ companyName || "Unknown" }}</p>
                <p>
                    <strong>Applied on:</strong>
                    {{ formatDate(job.applied_at) || "N/A" }}
                </p>
                <p>
                    <strong>Status:</strong>
                    <span :style="currentStatus.style">{{
                        currentStatus.text
                    }}</span>
                </p>
            </div>

            <!-- Progress Bar -->
            <div class="progress-bar">
                <div class="stage-labels">
                    <span
                        v-for="(stage, index) in stages"
                        :key="index"
                        :style="getStageLabelStyle(stage)"
                    >
                        {{ stage.name }}
                    </span>
                </div>
                <div class="progress-track">
                    <div
                        class="progress-fill"
                        :style="{
                            width: progressPercentage + '%',
                            background: progressBarColor,
                        }"
                    ></div>
                </div>
            </div>

            <!-- Status Details -->
            <div class="stages-container">
                <div
                    v-for="(stage, index) in stages"
                    :key="index"
                    class="stage-item"
                >
                    <div class="stage-icon" :style="getStageLabelStyle(stage)">
                        {{ index + 1 }}
                    </div>
                    <div class="stage-details">
                        <h3>{{ stage.name }}</h3>
                        <p>{{ stage.description }}</p>
                        <p v-if="stage.date">
                            Completed on: {{ formatDate(stage.date) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Status Message -->
            <div v-if="currentStatus.message" class="status-message">
                <p>{{ currentStatus.message }}</p>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
            <p>Application not found.</p>
            <button @click="router.push({ name: 'MyApplications' })">
                Back to Applications
            </button>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobsStore } from "@/stores/jobs";
import { useAuthStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const jobsStore = useJobsStore();
const authStore = useAuthStore();

const job = ref(null);
const companyName = ref("");
const loading = ref(false);
const error = ref(null);
const skeleton = ref(true);

// Status order for reference
const statusOrder = ["Applied", "Under Review", "Accepted", "Rejected"];

// Fetch application details
const fetchApplication = async () => {
    loading.value = true;
    error.value = null;
    try {
        const applicationID = route.params.applicationID;
        await jobsStore.fetchMyApplications(authStore.userID);
        const app = jobsStore.myApplications.find(
            (a) => a.applicationID == applicationID
        );
        if (!app) {
            throw new Error("Application not found");
        }
        job.value = app.jobDetails ? { ...app.jobDetails, ...app } : app;
        if (job.value.jobCompany) {
            const user = await authStore.getUserByID(job.value.jobCompany);
            companyName.value =
                user?.username || user?.name || user?.companyName || "Unknown";
        }
    } catch (err) {
        error.value = "Failed to load application details. Please try again.";
        console.error("Error fetching application:", err);
    } finally {
        loading.value = false;
        skeleton.value = false;
    }
};

// Retry fetching on error
const retryFetch = () => fetchApplication();

// Run on mount
onMounted(fetchApplication);
onMounted(async () => {
    const applicationID = route.params.applicationID;
    await jobsStore.fetchMyApplications(authStore.userID);
    const app = jobsStore.myApplications.find(
        (a) => a.applicationID == applicationID
    );
    if (app) {
        job.value = app.jobDetails ? { ...app.jobDetails, ...app } : app;
        // Fetch company name using the same logic as myapplications.vue
        if (job.value.jobCompany) {
            try {
                const name = await authStore.getUserByID(job.value.jobCompany);
                companyName.value = name || "Unknown";
            } catch {
                companyName.value = "Unknown";
            }
        }
    }
});
const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
};

// Compute stages
const stages = computed(() => {
    if (!job.value) return [];
    const status = job.value.status;
    const statusIndex = statusOrder.indexOf(status);
    const isFinalStatus = status === "Accepted" || status === "Rejected";
    const finalStageName = isFinalStatus ? status : "Accepted/Rejected";
    const finalStageDate =
        status === "Rejected" ? job.value.rejected_at : job.value.accepted_at;

    return [
        {
            name: "Applied",
            description: "Your application has been submitted.",
            completed: statusIndex >= 0,
            date: job.value.applied_at,
        },
        {
            name: "Under Review",
            description: "Your application is being reviewed.",
            completed: statusIndex >= 1,
            date: job.value.reviewed_at,
        },
        {
            name: finalStageName,
            description: isFinalStatus
                ? status === "Rejected"
                    ? "Unfortunately, your application was not successful."
                    : "Congratulations! Your application was accepted."
                : "Awaiting final decision.",
            completed: isFinalStatus,
            date: finalStageDate,
        },
    ];
});

// Compute current status
const currentStatus = computed(() => {
    if (!job.value) {
        return { text: "Loading...", style: "color: #4b5563", message: null };
    }
    const status = job.value.status;
    let text = status;
    let style = "color: #16a34a; font-weight: bold";
    let message = null;

    if (status === "Rejected") {
        text = "Rejected";
        style = "color: #dc2626; font-weight: bold";
        message =
            "We appreciate your interest. Please apply again in the future!";
    } else if (status === "Accepted") {
        text = "Accepted";
        message = "You have been accepted! Our team will contact you soon.";
    } else if (status === "Under Review") {
        text = "Under Review";
        message = "Your application is currently under review.";
    } else if (status === "Applied") {
        text = "Applied";
        message = "Your application has been submitted and is awaiting review.";
    } else {
        text = "Pending";
        message = "Your application status is pending a decision.";
    }

    return { text, style, message };
});

// Compute progress percentage
const progressPercentage = computed(() => {
    if (!job.value || !stages.value.length) return 0;
    const completedStages = stages.value.filter(
        (stage) => stage.completed
    ).length;
    return (completedStages / stages.value.length) * 100;
});

// Compute progress bar color
const progressBarColor = computed(() => {
    if (!job.value || job.value.status !== "Rejected") return "#16a34a";
    return "#dc2626";
});

// Get stage label style
const getStageLabelStyle = (stage) => {
    const status = job.value?.status;
    const isRejected =
        status === "Rejected" && stage.name === "Rejected" && stage.completed;

    if (isRejected) {
        return "background: #dc2626; color: #fff";
    }
    if (stage.completed) {
        return "background: #16a34a; color: #fff";
    }
    return "background: #e5e7eb; color: #4b5563";
};
</script>

<style scoped>
.job-progress-page {
    width: 100%;
    min-height: calc(100vh - 80px); /* Adjust for navbar */
    padding: 20px 16px;
    background: #f3f4f6;
    margin-top: 80px; /* Account for fixed navbar */
}

.skeleton-container {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-title {
    width: 60%;
    height: 32px;
    background: #e5e7eb;
    border-radius: 4px;
    margin: 0 auto 24px;
    animation: shimmer 1.5s infinite;
}

.skeleton-job-details {
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 24px;
}

.skeleton-job-title {
    width: 50%;
    height: 24px;
    margin-bottom: 12px;
}

.skeleton-text {
    width: 80%;
    height: 16px;
    background: #e5e7eb;
    border-radius: 4px;
    margin-bottom: 8px;
    animation: shimmer 1.5s infinite;
}

.skeleton-progress-bar {
    margin-bottom: 32px;
}

.skeleton-stage-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 8px;
}

.skeleton-label {
    flex: 1;
    height: 24px;
    background: #e5e7eb;
    border-radius: 999px;
    animation: shimmer 1.5s infinite;
}

.skeleton-progress-track {
    height: 10px;
    background: #e5e7eb;
    border-radius: 5px;
    animation: shimmer 1.5s infinite;
}

.skeleton-stages {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.skeleton-stage-item {
    display: flex;
    align-items: flex-start;
}

.skeleton-stage-icon {
    width: 28px;
    height: 28px;
    background: #e5e7eb;
    border-radius: 50%;
    animation: shimmer 1.5s infinite;
}

.skeleton-stage-details {
    margin-left: 20px;
    flex: 1;
}

.skeleton-stage-title {
    width: 40%;
    height: 20px;
}

.skeleton-title,
.skeleton-text,
.skeleton-label,
.skeleton-progress-track,
.skeleton-stage-icon {
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 200px 100%;
}

@keyframes shimmer {
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: 200px 0;
    }
}

h1 {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    color: #1f2937;
    margin-bottom: 32px;
}

.progress-container {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
}

.job-details {
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 24px;
}

.job-details h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
}

.job-details p {
    font-size: 1rem;
    color: #4b5563;
    margin-bottom: 6px;
}

.job-details p strong {
    color: #1f2937;
}

.progress-bar {
    margin-bottom: 32px;
}

.stage-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
}

.stage-labels span {
    font-size: 0.85rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 999px;
    text-align: center;
    flex: 1;
    min-width: 100px;
}

.progress-track {
    height: 10px;
    background: #e5e7eb;
    border-radius: 5px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.stages-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.stage-item {
    display: flex;
    align-items: flex-start;
}

.stage-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}

.stage-details {
    margin-left: 20px;
    flex: 1;
}

.stage-details h3 {
    font-size: 1.2rem;
    font-weight: 500;
    color: #1f2937;
}

.stage-details p {
    font-size: 1rem;
    color: #4b5563;
}

.stage-details p:last-child {
    font-size: 0.9rem;
    color: #6b7280;
}

.status-message {
    margin-top: 32px;
    padding: 20px;
    background: #eff6ff;
    border-radius: 8px;
}

.status-message p {
    font-size: 1rem;
    color: #1e40af;
}

.loading,
.error-state,
.empty-state {
    text-align: center;
    padding: 48px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin: 0 auto;
    max-width: 600px;
}

.loading {
    font-size: 1.2rem;
    color: #4b5563;
}

.error-state p,
.empty-state p {
    font-size: 1.2rem;
    color: #4b5563;
    margin-bottom: 20px;
}

.error-state button,
.empty-state button {
    padding: 10px 20px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
}

.error-state button:hover,
.empty-state button:hover {
    background: #1d4ed8;
}

@media (max-width: 600px) {
    .job-progress-page {
        padding: 16px 8px;
    }

    .skeleton-container {
        padding: 16px;
    }

    .skeleton-title {
        width: 80%;
        height: 24px;
    }

    .skeleton-job-title {
        width: 70%;
        height: 20px;
    }

    .skeleton-text {
        width: 90%;
        height: 14px;
    }

    .skeleton-label {
        height: 20px;
        min-width: 80px;
    }

    h1 {
        font-size: 1.5rem;
    }

    .job-details h2 {
        font-size: 1.25rem;
    }

    .stage-labels span {
        font-size: 0.75rem;
        padding: 4px 8px;
        min-width: 80px;
    }
}
</style>
