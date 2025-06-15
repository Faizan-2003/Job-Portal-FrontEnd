<template>
    <section class="job-details-page">
        <button class="back-btn" @click="goBack">← Back</button>

        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <span>Loading job details...</span>
        </div>

        <div v-else class="job-details-container">
            <div class="image-container">
                <img
                    :src="getImageUrl(jobDetails.coverImage)"
                    alt="Job Cover"
                    class="cover-img"
                />
            </div>

            <div class="details-container">
                <h2 class="job-title">{{ jobDetails.jobTitle }}</h2>
                <p><strong>Company:</strong> {{ companyName }}</p>
                <p><strong>Location:</strong> {{ jobDetails.jobLocation }}</p>
                <p><strong>Salary:</strong> €{{ jobDetails.jobSalary }}</p>
                <p>
                    <strong>Posted Date:</strong> {{ jobDetails.jobPostedDate }}
                </p>
                <p class="job-description">
                    <strong>Description:</strong>
                    {{ jobDetails.jobDescription }}
                </p>
                <div class="action-buttons">
                    <template v-if="userType === 'Employer'">
                        <button class="edit-btn" @click="editJob">Edit</button>
                        <button class="delete-btn" @click="deleteJob">
                            Delete
                        </button>
                    </template>
                    <template v-else-if="userType === 'Applicant'">
                        <button
                            class="apply-btn"
                            @click="showApplyDialog = true"
                        >
                            Apply
                        </button>
                    </template>
                </div>
            </div>
        </div>

        <!-- Apply Dialog for Applicants -->
        <el-dialog
            v-model="showApplyDialog"
            title="Apply for Job"
            width="400px"
        >
            <el-upload
                class="upload-demo"
                drag
                :before-upload="handleResumeChange"
                :show-file-list="false"
                accept=".pdf"
            >
                <el-button>Click or Drag to Upload PDF Resume</el-button>
            </el-upload>
            <div v-if="resumeFile" class="file-name">
                <span>Selected file: {{ resumeFile.name }}</span>
                <el-button
                    type="danger"
                    size="small"
                    style="margin-left: 10px"
                    @click="resumeFile = null"
                >
                    Cancel
                </el-button>
            </div>
            <template #footer>
                <el-button @click="showApplyDialog = false">Cancel</el-button>
                <el-button type="primary" @click="submitApplication"
                    >Submit</el-button
                >
            </template>
        </el-dialog>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobsStore } from "../../stores/jobs";
import { useAuthStore } from "../../stores/user";
import { ElMessageBox, ElMessage } from "element-plus";
import $axios from "../../axiosInstance";

const route = useRoute();
const router = useRouter();
const { fetchJobDetails, deleteJobById, applyForJob } = useJobsStore();
const authStore = useAuthStore();

const jobID = route.params.jobID;
const jobDetails = ref(null);
const companyName = ref("");
const loading = ref(true);

const showApplyDialog = ref(false);
const resumeFile = ref(null);

const userType = computed(() => authStore.userType);
const userID = computed(() => authStore.userID);

const goBack = () => {
    window.history.back();
};

const editJob = () => {
    window.location.href = `/editjob/${jobID}`;
};

const deleteJob = async () => {
    try {
        await ElMessageBox.confirm(
            "Are you sure you want to delete this job?",
            "Confirmation",
            {
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                type: "warning",
            }
        );
        const result = await deleteJobById(jobID);
        if (result && result.success) {
            ElMessage.success("Job deleted successfully!");
            router.push({ name: "PostedJobs" });
        } else {
            ElMessage.error(result?.message || "Failed to delete job.");
        }
    } catch (error) {
        ElMessage({
            type: "info",
            message: "Job deletion canceled.",
        });
    }
};

const getImageUrl = (filename) => {
    if (!filename) return "/default-image.png";
    return `${$axios.imgBaseURL}/${filename}`;
};

const handleResumeChange = (file) => {
    if (file.type !== "application/pdf") {
        ElMessage.error("Only PDF files are allowed.");
        return false;
    }
    resumeFile.value = file;
    return false; // Prevent auto upload
};

const submitApplication = async () => {
    if (!resumeFile.value) {
        ElMessage.error("Please upload your resume (PDF).");
        return;
    }
    const result = await applyForJob({
        userID: userID.value,
        jobID,
        status: "Applied",
        resume: resumeFile.value,
    });
    if (result && result.success) {
        ElMessage.success("Application submitted!");
        showApplyDialog.value = false;
        router.push({ name: "MyApplications" });
    } else {
        ElMessage.error(result?.message || "Failed to apply for job.");
    }
};

onMounted(async () => {
    try {
        loading.value = true;
        jobDetails.value = await fetchJobDetails(jobID);
        if (jobDetails.value && jobDetails.value.jobCompany) {
            companyName.value = await authStore.getUserByID(
                jobDetails.value.jobCompany
            );
        }
    } catch (error) {
        console.error("Error loading job details:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.job-details-page {
    width: 100%;
    min-height: calc(100vh - 80px); /* Adjust for navbar */
    padding: 20px 16px;
    background: #f3f4f6;
    margin-top: 80px; /* Account for fixed navbar */
}

.back-btn {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: #fff;
    color: #1f2937;
    border: 1px solid #e5e7eb;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.2s, transform 0.2s;
    margin-bottom: 16px;
}

.back-btn:hover {
    background: #e5e7eb;
    transform: translateY(-2px);
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

.loading span {
    font-size: 1.2rem;
    color: #4b5563;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.job-details-container {
    display: flex;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-container {
    flex: 1;
    max-width: 400px;
}

.cover-img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.details-container {
    flex: 2;
    padding: 16px;
}

.job-title {
    font-size: 2rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
}

.details-container p {
    font-size: 1rem;
    color: #4b5563;
    margin-bottom: 8px;
}

.details-container p strong {
    color: #1f2937;
    font-weight: 500;
}

.job-description {
    line-height: 1.6;
    margin-top: 16px;
}

.action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.edit-btn,
.apply-btn {
    padding: 10px 20px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
}

.edit-btn:hover,
.apply-btn:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}

.delete-btn {
    padding: 10px 20px;
    background: #dc2626;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
}

.delete-btn:hover {
    background: #b91c1c;
    transform: translateY(-2px);
}

:deep(.el-dialog) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-upload-dragger) {
    border: 2px dashed #e5e7eb;
    border-radius: 5px;
    padding: 16px;
    text-align: center;
    background: #f9fafb;
}

:deep(.el-button) {
    border-radius: 5px;
}

.file-name {
    margin-top: 12px;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #4b5563;
}

.file-name span {
    flex: 1;
    word-break: break-all;
}

@media (max-width: 768px) {
    .job-details-container {
        flex-direction: column;
        padding: 16px;
    }

    .image-container {
        max-width: 100%;
    }

    .cover-img {
        height: 200px;
    }

    .details-container {
        padding: 0;
    }

    .job-title {
        font-size: 1.5rem;
    }

    .action-buttons {
        flex-direction: column;
        gap: 8px;
    }

    .edit-btn,
    .apply-btn,
    .delete-btn {
        width: 100%;
        text-align: center;
    }
}

@media (max-width: 600px) {
    .job-details-page {
        padding: 16px 8px;
    }

    .back-btn {
        font-size: 0.9rem;
        padding: 6px 12px;
    }

    .loading span {
        font-size: 1rem;
    }
}
</style>
