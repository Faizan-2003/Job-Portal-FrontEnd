import { defineStore } from "pinia";
import { ref } from "vue";
import $axios from "../axiosInstance";

export const useJobsStore = defineStore(
    "jobs",
    () => {
        const jobs = ref([]);
        const companyJobs = ref([]);
        const myApplications = ref([]);

        const getToken = () => sessionStorage.getItem("token");

        const fetchJobs = async () => {
            try {
                const token = getToken();
                const response = await $axios.get("/jobs", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response?.data?.success) {
                    jobs.value = response.data.jobs;
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        const addJob = async (jobData) => {
            try {
                const token = getToken();
                const response = await $axios.post("job/add", jobData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                return response?.data?.success
                    ? { success: true }
                    : {
                          success: false,
                          message: response?.data?.message || "Unknown error",
                      };
            } catch (error) {
                return {
                    success: false,
                    message: error?.response?.data?.message || error.message,
                };
            }
        };

        const deleteJobById = async (jobID) => {
            try {
                const token = getToken();
                const response = await $axios.delete(`job/delete/${jobID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return response?.data?.success
                    ? { success: true }
                    : {
                          success: false,
                          message: response?.data?.message || "Unknown error",
                      };
            } catch (error) {
                return {
                    success: false,
                    message: error?.response?.data?.message || error.message,
                };
            }
        };

        const fetchCompanyJobs = async (userID) => {
            try {
                const token = getToken();
                const response = await $axios.get(`jobs/company/${userID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response?.data?.success) {
                    companyJobs.value = response.data.jobs;
                }
            } catch (error) {
                console.error("Error fetching company jobs:", error);
            }
        };

        const editJob = async (jobID, jobData, isFormData = false) => {
            try {
                const token = getToken();
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": isFormData
                        ? "multipart/form-data"
                        : "application/json",
                };
                const response = await $axios.post(
                    `job/edit/${jobID}`,
                    isFormData ? jobData : JSON.stringify(jobData),
                    { headers }
                );
                return response.status >= 200 && response.status < 300
                    ? { success: true }
                    : response?.data?.success
                    ? { success: true }
                    : {
                          success: false,
                          message: response?.data?.message || "Unknown error",
                      };
            } catch (error) {
                return {
                    success: false,
                    message: error?.response?.data?.message || error.message,
                };
            }
        };

        const fetchJobDetails = async (jobID) => {
            try {
                const token = getToken();
                const response = await $axios.get(`job/${jobID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response?.data?.success) {
                    return response.data.job;
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
            return null;
        };

        const applyForJob = async ({ userID, jobID, resume }) => {
            try {
                const token = getToken();
                const formData = new FormData();
                formData.append("userID", userID);
                formData.append("jobID", jobID);
                formData.append("status", "Applied");
                formData.append("resume", resume);

                const response = await $axios.post("job/apply", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log("Apply job response:", response.data);

                return response?.data?.success
                    ? { success: true }
                    : {
                          success: false,
                          message: response?.data?.message || "Unknown error",
                      };
            } catch (error) {
                return {
                    success: false,
                    message: error?.response?.data?.message || error.message,
                };
            }
        };

        const fetchMyApplications = async (userID) => {
            try {
                const token = getToken();
                const response = await $axios.get(
                    `job/applications/user/${userID}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (
                    response?.data?.success &&
                    Array.isArray(response.data.applications)
                ) {
                    const jobsDetails = await Promise.all(
                        response.data.applications.map(async (app) => {
                            const job = await fetchJobDetails(app.jobID);
                            console.log("Fetched job for app", app.jobID, job);
                            return { ...app, jobDetails: job };
                        })
                    );
                    myApplications.value = jobsDetails;
                } else {
                    myApplications.value = [];
                }
            } catch (error) {
                myApplications.value = [];
            }
        };

        return {
            // State
            jobs,
            companyJobs,
            myApplications,

            // Actions
            fetchJobs,
            fetchCompanyJobs,
            fetchJobDetails,
            addJob,
            deleteJobById,
            editJob,
            applyForJob,
            fetchMyApplications,
        };
    },
    {
        persist: true,
    }
);
