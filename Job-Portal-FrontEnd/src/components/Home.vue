<template>
    <section class="home-page">
        <div class="hero-section">
            <h1 class="hero-title">
                {{
                    userType === "Applicant"
                        ? "Discover Your Next Career Move"
                        : "Find Top Talent for Your Team"
                }}
            </h1>
            <p class="hero-subtitle">
                {{
                    userType === "Applicant"
                        ? "Explore exciting job opportunities tailored to your skills."
                        : "Post and manage your job listings to attract the best candidates."
                }}
            </p>
            <a
                :href="userType === 'Applicant' ? '/find-jobs' : '/posted-jobs'"
                class="cta-button"
            >
                {{
                    userType === "Applicant"
                        ? "Find Jobs"
                        : "Manage Job Postings"
                }}
            </a>
        </div>

        <div class="featured-jobs">
            <h2 class="section-title">Featured Jobs</h2>
            <div class="job-cards-container">
                <JobCard
                    v-for="(job, index) in jobs.slice(0, 4)"
                    :key="job.jobID"
                    :job="job"
                    class="job-card"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import JobCard from "./jobCard.vue";
import { useJobsStore } from "../stores/jobs";
import { useAuthStore } from "../stores/user";
import { onMounted } from "vue";

const { jobs, fetchJobs } = useJobsStore();
const { userType } = useAuthStore();

onMounted(() => {
    fetchJobs();
});
</script>

<style scoped>
.home-page {
    width: 100%;
    min-height: calc(100vh - 80px); /* Adjust for navbar */
    padding: 20px 16px;
    background: #f3f4f6;
    margin-top: 80px; /* Account for fixed navbar */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hero-section {
    max-width: 800px;
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #eff6ff 0%, #f9fafb 100%);
    border-radius: 12px;
    margin-bottom: 40px;
    animation: fadeIn 1s ease-out;
}

.hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 16px;
}

.hero-subtitle {
    font-size: 1.2rem;
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 24px;
}

.cta-button {
    display: inline-block;
    padding: 12px 24px;
    background: #0077b6;
    color: #fff;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 5px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
}

.cta-button:hover {
    background: #02466b;
    transform: translateY(-2px);
}

.featured-jobs {
    max-width: 1200px;
    width: 100%;
    padding: 20px 0;
}

.section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
    margin-bottom: 24px;
    position: relative;
}

.section-title::after {
    content: "";
    display: block;
    width: 60px;
    height: 3px;
    background: #0077b6;
    margin: 8px auto;
}

.job-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    justify-content: center;
    animation: fadeIn 1s ease-out 0.3s backwards;
}

.job-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.job-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .hero-section {
        padding: 30px 16px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .cta-button {
        padding: 10px 20px;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .job-cards-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .home-page {
        padding: 16px 8px;
    }

    .hero-section {
        margin-bottom: 24px;
    }

    .hero-title {
        font-size: 1.5rem;
    }

    .hero-subtitle {
        font-size: 0.9rem;
    }

    .cta-button {
        font-size: 0.9rem;
        padding: 8px 16px;
    }

    .section-title {
        font-size: 1.2rem;
    }
}
</style>
