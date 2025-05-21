<template>
    <div class="post-job-wrapper">
        <section class="form-container">
            <button class="back-btn mb-4 ms-auto" @click="goBack">
                ← Back
            </button>
            <h2>Post a New Job</h2>
            <form @submit.prevent="submitJob">
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
                <button type="submit" class="submit-btn">Post Job</button>
            </form>
        </section>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useJobsStore } from "../../stores/jobs";
import { useAuthStore } from "../../stores/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus"; // Import Element Plus message

const { addJob } = useJobsStore();
const { userID } = useAuthStore();
const router = useRouter();

const coverImage = ref("");
const jobTitle = ref("");
const jobDescription = ref("");
const jobSalary = ref("");
const jobLocation = ref("");
const previewImage = ref(null);
const file = ref(null);
const isDragOver = ref(false);

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

const submitJob = async () => {
    const formData = new FormData();
    formData.append("coverImage", file.value);
    formData.append("jobTitle", jobTitle.value);
    formData.append("jobDescription", jobDescription.value);
    formData.append("jobSalary", jobSalary.value);
    formData.append("jobLocation", jobLocation.value);
    formData.append("jobCompany", userID);
    formData.append("jobApplicant", null);
    formData.append("jobPostedDate", new Date().toISOString());

    const result = await addJob(formData);
    if (result && result.success) {
        ElMessage.success("Job posted successfully!");
        router.push({ name: "PostedJobs" });
    } else {
        ElMessage.error(
            result?.message || "Failed to post job. Please try again."
        );
    }
};
</script>

<style scoped>
.post-job-wrapper {
    min-height: 100vh;
    width: 100vw;
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
