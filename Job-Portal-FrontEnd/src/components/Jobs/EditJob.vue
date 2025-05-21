<template>
    <div class="edit-job-wrapper">
        <section class="form-container">
            <button class="back-btn mb-4 ms-auto" @click="goBack">
                ← Back
            </button>
            <h2>Edit Job</h2>
            <form @submit.prevent="updateJob">
                <div class="form-group">
                    <label>Job Image</label>
                    <div
                        class="drop-area"
                        @dragover.prevent="onDragOver"
                        @dragleave.prevent="onDragLeave"
                        @drop.prevent="onDrop"
                        :class="{ 'drag-over': isDragOver }"
                    >
                        <span v-if="!previewImage">
                            Drag & drop a PNG, JPG, or JPEG file here, or
                        </span>
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            @change="onFileChange"
                            class="file-input"
                        />
                        <span class="choose-file">Choose File</span>
                        <div v-if="previewImage" class="preview-img">
                            <img :src="previewImage" alt="Preview" />
                        </div>
                        <div v-else-if="coverImage">
                            <img
                                :src="getImageUrl(coverImage)"
                                alt="Current"
                                class="preview-img"
                            />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" v-model="jobTitle" required />
                </div>
                <div class="form-group">
                    <label>Job Description</label>
                    <textarea v-model="jobDescription" required></textarea>
                </div>
                <div class="form-group">
                    <label>Job Salary</label>
                    <input type="number" v-model="jobSalary" required />
                </div>
                <div class="form-group">
                    <label>Job Location</label>
                    <input type="text" v-model="jobLocation" required />
                </div>
                <button type="submit" class="submit-btn">Update Job</button>
            </form>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobsStore } from "../../stores/jobs";
import { useAuthStore } from "../../stores/user";
import { ElMessage } from "element-plus";
import $axios from "../../axiosInstance";

const { fetchJobDetails, editJob } = useJobsStore();
const { userID } = useAuthStore();
const router = useRouter();
const route = useRoute();

const jobID = route.params.jobID;

const coverImage = ref("");
const jobTitle = ref("");
const jobDescription = ref("");
const jobSalary = ref("");
const jobLocation = ref("");
const previewImage = ref(null);
const file = ref(null);
const isDragOver = ref(false);

const getImageUrl = (filename) => {
    if (!filename) return "/default-image.png";
    return `${$axios.imgBaseURL}/${filename}`;
};

const onFileChange = (e) => {
    const selected = e.target.files[0];
    handleFile(selected);
};

const onDragOver = () => {
    isDragOver.value = true;
};
const onDragLeave = () => {
    isDragOver.value = false;
};
const onDrop = (e) => {
    isDragOver.value = false;
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
};

function handleFile(selected) {
    if (!selected) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(selected.type)) {
        ElMessage.error("Only PNG, JPG, or JPEG files are allowed.");
        return;
    }
    file.value = selected;
    const reader = new FileReader();
    reader.onload = (ev) => {
        previewImage.value = ev.target.result;
    };
    reader.readAsDataURL(selected);
    coverImage.value = selected.name;
}

const goBack = () => {
    router.back();
};

onMounted(async () => {
    const job = await fetchJobDetails(jobID);
    if (job) {
        coverImage.value = job.coverImage;
        jobTitle.value = job.jobTitle;
        jobDescription.value = job.jobDescription;
        jobSalary.value = job.jobSalary;
        jobLocation.value = job.jobLocation;
    }
});
const updateJob = async () => {
    let payload;
    let isFormData = false;

    if (file.value) {
        payload = new FormData();
        payload.append("coverImage", file.value);
        payload.append("jobTitle", jobTitle.value);
        payload.append("jobDescription", jobDescription.value);
        payload.append("jobSalary", jobSalary.value);
        payload.append("jobLocation", jobLocation.value);
        payload.append("jobCompany", userID);
        isFormData = true;
    } else {
        payload = {
            jobTitle: jobTitle.value,
            jobDescription: jobDescription.value,
            jobSalary: jobSalary.value,
            jobLocation: jobLocation.value,
            coverImage: coverImage.value,
            jobCompany: userID,
        };
    }

    const result = await editJob(jobID, payload, isFormData);

    if (result && result.success) {
        ElMessage.success("Job updated successfully!");
        router.push({ name: "JobDetails", params: { jobID } });
    } else {
        ElMessage.error(result?.message || "Failed to update job.");
    }
};
</script>
<style scoped>
.edit-job-wrapper {
    min-height: 100vh;
    width: 100vw;
    background: #f7faff;
    padding: 0;
    margin: 0;
    position: relative;
}
.form-container {
    max-width: 900px;
    margin: 100px auto 0 auto;
    background: #fff;
    padding: 48px 60px 40px 60px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    position: relative;
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
h2 {
    font-size: 2.2rem;
    margin-bottom: 32px;
    color: #0077b6;
    font-weight: 700;
}
.form-group {
    margin-bottom: 28px;
}
label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 1.35rem;
}
input,
textarea {
    width: 100%;
    padding: 16px 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1.18rem;
    margin-top: 2px;
}
textarea {
    min-height: 110px;
    resize: vertical;
}
.submit-btn {
    background: #007bff;
    color: #fff;
    border: none;
    padding: 18px 40px;
    border-radius: 10px;
    font-size: 1.22rem;
    cursor: pointer;
    margin-top: 18px;
}
.submit-btn:hover {
    background: #0056b3;
}
.drop-area {
    border: 2px dashed #007bff;
    border-radius: 8px;
    padding: 28px 16px;
    text-align: center;
    position: relative;
    background: #f7faff;
    margin-bottom: 10px;
    transition: border-color 0.2s, background 0.2s;
    overflow: hidden;
}
.drop-area.drag-over {
    border-color: #0056b3;
    background: #e6f0ff;
}
.file-input {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 2;
}
.choose-file {
    display: inline-block;
    margin-top: 8px;
    color: #007bff;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    position: relative;
    z-index: 3;
}
.preview-img {
    margin-top: 12px;
}
.preview-img img {
    max-width: 220px;
    max-height: 140px;
    border-radius: 8px;
    border: 1px solid #ddd;
}
</style>
