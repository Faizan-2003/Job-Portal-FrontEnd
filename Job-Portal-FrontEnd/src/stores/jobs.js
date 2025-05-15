import { ref } from "vue";
import $axios from "../axiosInstance";

export const useJobsStore = () => {
    const jobs = ref([]); // Stores all jobs
    const companyJobs = ref([]); // Stores jobs posted by a specific company

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
    const fetchJobDetails = async (jobID) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await $axios.get(`/api/job/${jobID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.data && response.data.success) {
                return response.data.job; // Return job details
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
        addJob, // Add fetchJobDetails to the return object
    };
};
