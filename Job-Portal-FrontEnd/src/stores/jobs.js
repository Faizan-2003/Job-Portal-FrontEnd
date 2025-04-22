import { ref } from "vue";
import $axios from "../axiosInstance";

export const useJobsStore = () => {
    const jobs = ref([]);

    const fetchJobs = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await $axios.get("/api/jobs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response && response.data && response.data.success) {
                jobs.value = response.data.jobs; // Access the jobs array from the response
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    return { jobs, fetchJobs };
};
