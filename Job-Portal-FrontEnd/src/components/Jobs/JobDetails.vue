<template>
    <section class="job-details-page container">
        <button class="back-btn mb-4 ms-auto" @click="goBack">← Back</button>

        <div v-if="loading" class="loading">
            <div class="spinner"></div>
        </div>

        <div v-else class="job-details-layout">
            <div class="image-container">
                <img
                    :src="getImageUrl(jobDetails.coverImage)"
                    alt="Job Cover"
                    class="cover-img"
                />
            </div>

            <div class="details-container">
                <h2 class="job-title">{{ jobDetails.jobTitle }}</h2>
                <p><strong>Company Name:</strong> {{ companyName }}</p>
                <p><strong>Location:</strong> {{ jobDetails.jobLocation }}</p>
                <p><strong>Salary:</strong> €{{ jobDetails.jobSalary }}</p>
                <p>
                    <strong>Posted Date:</strong> {{ jobDetails.jobPostedDate }}
                </p>
                <p>
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
                            class="edit-btn"
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
    padding-top: 100px;
    padding-bottom: 60px;
}

.job-details-layout {
    display: flex;
    gap: 50px;
    align-items: flex-start;
    justify-content: flex-start;
}

.image-container {
    flex: 1;
    max-width: 400px;
}

.cover-img {
    width: 600px;
    margin-left: 20px;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.details-container {
    margin-left: 200px;
    flex: 2;
    font-size: 1.4rem;
    line-height: 2;
    color: #333;
    text-align: left;
}

.job-title {
    font-size: 2.8rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #222;
}

.action-buttons {
    margin-top: 20px;
    display: flex;
    gap: 20px;
}

.edit-btn {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    font-size: 1.2rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.edit-btn:hover {
    background-color: #218838;
    transform: translateY(-2px);
}

.delete-btn {
    background-color: #dc3545;
    color: white;
    padding: 10px 20px;
    font-size: 1.2rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.delete-btn:hover {
    background-color: #c82333;
    transform: translateY(-2px);
}

.back-btn {
    background-color: #f8f9fa;
    color: #333;
    padding: 10px 20px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    display: block;
    margin-left: auto;
}

.back-btn:hover {
    background-color: #e2e6ea;
    transform: translateY(-2px);
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
.file-name {
    margin-top: 12px;
    color: #007bff;
    font-size: 1rem;
    word-break: break-all;
}
:deep(.el-dialog) {
    border-radius: 18px;
}
</style>
