<template>
    <section class="my-applications-page">
        <h2>Jobs you have Applied to..</h2>

        <!-- Loading State -->
        <div v-if="loading" class="loading">Loading applications...</div>

        <!-- Applications List -->
        <div v-else-if="myApplications?.length" class="job-cards-container">
            <div
                v-for="app in myApplications"
                :key="app.applicationID"
                class="job-card"
                @click="goToApplicationProgress(app.applicationID)"
            >
                <img
                    v-if="app.jobDetails?.coverImage"
                    :src="getImageUrl(app.jobDetails.coverImage)"
                    alt="Job Cover"
                    class="job-cover-image"
                />
                <div class="job-details">
                    <h3>{{ app.jobDetails?.jobTitle || "Job Title" }}</h3>
                    <p>
                        <strong>Company: </strong>
                        {{
                            companyNames[app.jobDetails?.jobCompany] ||
                            "Unknown"
                        }}
                    </p>
                    <p>
                        <strong>Location: </strong>
                        {{ app.jobDetails?.jobLocation || "N/A" }}
                    </p>
                    <p>
                        <strong>Salary: </strong>
                        {{ app.jobDetails?.jobSalary || "N/A" }}
                    </p>
                    <p>
                        <strong>Status: </strong>
                        <span :style="getStatusStyle(app.status)">{{
                            app.status || "N/A"
                        }}</span>
                    </p>
                    <p>
                        <strong>Applied On: </strong>
                        {{ formatDate(app.applied_at) || "N/A" }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
            <p>No applications found.</p>
            <button @click="router.push({ name: 'Jobs' })">Explore Jobs</button>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useJobsStore } from "@/stores/jobs";
import { useAuthStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import $axios from "@/axiosInstance";

const jobsStore = useJobsStore();
const { myApplications } = storeToRefs(jobsStore);
const { fetchMyApplications } = jobsStore;
const authStore = useAuthStore();
const { userID } = authStore;
const router = useRouter();

const loading = ref(false);
const companyNames = ref({});
const error = ref(null);

// Fetch company name for a given companyID
const fetchCompanyName = async (companyID) => {
    if (!companyID || companyNames.value[companyID]) return;
    try {
        const companyName = await authStore.getUserByID(companyID);
        companyNames.value[companyID] = companyName || "Unknown";
    } catch (err) {
        companyNames.value[companyID] = "Unknown";
        console.error(`Error fetching company name for ID ${companyID}:`, err);
    }
};

// Fetch applications and company names on mount
onMounted(async () => {
    loading.value = true;
    error.value = null;
    try {
        await fetchMyApplications(userID);
        if (Array.isArray(myApplications.value)) {
            const uniqueCompanyIDs = [
                ...new Set(
                    myApplications.value
                        .filter((app) => app.jobDetails?.jobCompany)
                        .map((app) => app.jobDetails.jobCompany)
                ),
            ];
            await Promise.all(uniqueCompanyIDs.map(fetchCompanyName));
        } else {
            throw new Error("Invalid applications data");
        }
    } catch (err) {
        error.value = "Failed to load applications. Please try again later.";
        console.error("Error loading applications:", err);
    } finally {
        loading.value = false;
    }
});

// Navigate to application progress page
const goToApplicationProgress = (applicationID) => {
    router.push({ name: "ApplicationProgress", params: { applicationID } });
};

// Get image URL
const getImageUrl = (filename) => {
    if (!filename) return "/default-image.png";
    return `${$axios.imgBaseURL}/${filename}`;
};

// Format date
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

// Status style mapping
const getStatusStyle = (status) => {
    const statusMap = {
        Applied: "color: #2563eb",
        "Under Review": "color: #d97706",
        Accepted: "color: #15803d; font-weight: bold",
        Rejected: "color: #dc2626",
    };
    return statusMap[status] || "color: #4b5563";
};
</script>

<style scoped>
.my-applications-page {
    max-width: 1200px;
    margin: 80px auto 0;
    padding: 20px;
}

h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 24px;
    text-align: center;
    color: #0077b6;
}

.job-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.job-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
}

.job-card:hover {
    transform: translateY(-4px);
}

.job-cover-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.job-details {
    padding: 16px;
}

.job-details h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #0077b6;
    font-weight: bold;
}

.job-details p {
    font-size: 1rem;
    margin-bottom: 4px;
    color: #4b5563;
}

.job-details p strong {
    color: #1f2937;
}

.loading {
    text-align: center;
    font-size: 1.1rem;
    color: #4b5563;
    padding: 40px;
}

.empty-state {
    text-align: center;
    padding: 40px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.empty-state p {
    font-size: 1.1rem;
    color: #4b5563;
    margin-bottom: 16px;
}

.empty-state button {
    padding: 8px 16px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.empty-state button:hover {
    background: #1d4ed8;
}
</style>
