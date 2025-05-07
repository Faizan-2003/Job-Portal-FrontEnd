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

    // Return each method and variable individually
    return {
        jobs,
        companyJobs,
        fetchJobs,
        fetchCompanyJobs,
    };
};
