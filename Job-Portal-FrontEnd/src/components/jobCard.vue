<template>
    <div class="job-card" v-for="job in jobs" :key="job.jobID">
        <!-- Cover Image -->
        <img
            :src="`/img/${job.coverImage}`"
            alt="Job Cover"
            class="job-cover-image"
        />
        <!-- Job Details -->
        <div class="job-details">
            <h2 class="job-title">{{ job.jobTitle }}</h2>
            <p class="job-salary">
                Salary: <strong>€{{ job.jobSalary }}</strong>
            </p>
            <p class="job-location">
                Location: <strong>{{ job.jobLocation }}</strong>
            </p>
            <p class="job-company">
                Company:
                <strong>{{
                    companyNames[job.jobCompany] || "Loading..."
                }}</strong>
            </p>
        </div>
    </div>
</template>
<script>
import { onMounted, reactive } from "vue";
import { useJobsStore } from "../stores/jobs";
import { useAuthStore } from "../stores/user";

export default {
    name: "JobCard",
    setup() {
        const { jobs, fetchJobs } = useJobsStore();
        const authStore = useAuthStore();
        const companyNames = reactive({});

        const fetchAllCompanyNames = async () => {
            try {
                if (!jobs.value || jobs.value.length === 0) {
                    console.error("Jobs data is empty or not loaded.");
                    return;
                }

                const uniqueCompanyIDs = [
                    ...new Set(jobs.value.map((job) => job.jobCompany)),
                ];

                for (const companyID of uniqueCompanyIDs) {
                    if (!companyNames[companyID]) {
                        try {
                            const companyName = await authStore.getUserByID(
                                companyID
                            );
                            companyNames[companyID] = companyName || "Unknown";
                        } catch (error) {
                            companyNames[companyID] = "Unknown";
                        }
                    }
                }
            } catch (error) {
                console.error("Error in fetchAllCompanyNames:", error);
            }
        };

        onMounted(async () => {
            await fetchJobs();
            console.log("Jobs fetched:", jobs.value);
            await fetchAllCompanyNames();
        });

        return { jobs, companyNames };
    },
};
</script>
<style scoped>
.job-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 20px;
    margin: 20px;
    width: 330px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
}

.job-card:hover {
    transform: translateY(-5px);
}

.job-cover-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.job-details {
    padding: 15px;
    background-color: #ffffff;
}

.job-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #0077b6;
}

.job-salary,
.job-location,
.job-company {
    font-size: 17px;
    margin: 5px 0;
    color: #333;
}
</style>
