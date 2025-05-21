import { ref } from "vue";
import $axios from "../axiosInstance";

export const useJobsStore = () => {
    const jobs = ref([]);
    const companyJobs = ref([]);

    // Fetch all jobs
    const fetchJobs = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await $axios.get("/api/jobs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.data && response.data.success) {
                jobs.value = response.data.jobs;
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };
    const addJob = async (jobData) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await $axios.post("/api/job/add", jobData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response && response.data && response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response?.data?.message || "Unknown error",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error.message,
            };
        }
    };
    const deleteJobById = async (jobID) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await $axios.delete(`/api/job/delete/${jobID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.data && response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response?.data?.message || "Unknown error",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error.message,
            };
        }
    };
    // Fetch jobs posted by a specific company
    const fetchCompanyJobs = async (userID) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await $axios.get(`/api/jobs/company/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.data && response.data.success) {
                companyJobs.value = response.data.jobs;
            }
        } catch (error) {
            console.error("Error fetching company jobs:", error);
        }
    };
    const editJob = async (jobID, jobData, isFormData = false) => {
        try {
            const token = sessionStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            if (isFormData) {
                headers["Content-Type"] = "multipart/form-data";
            } else {
                headers["Content-Type"] = "application/json";
            }
            const response = await $axios.post(
                `/api/job/edit/${jobID}`,
                isFormData ? jobData : JSON.stringify(jobData),
                { headers }
            );
            if (response.status >= 200 && response.status < 300) {
                return { success: true };
            } else if (response.data && response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response?.data?.message || "Unknown error",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error.message,
            };
        }
    };
    const fetchJobDetails = async (jobID) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await $axios.get(`/api/job/${jobID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.data && response.data.success) {
                return response.data.job;
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
        }
        return null;
    };

    return {
        jobs,
        companyJobs,
        fetchJobs,
        fetchCompanyJobs,
        fetchJobDetails,
        addJob,
        deleteJobById,
        editJob,
    };
};
