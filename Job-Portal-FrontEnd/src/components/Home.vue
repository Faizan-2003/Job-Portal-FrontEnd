<template>
    <section class="home-page">
        <div class="job-cards-container">
            <JobCard />
            <!-- Render the JobCard component -->
        </div>
    </section>
</template>
<script setup>
import JobCard from "./jobCard.vue"; // Import the JobCard component
</script>
<style scoped>
.home-page {
    background-color: #f9f9f9;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.job-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}
</style>
