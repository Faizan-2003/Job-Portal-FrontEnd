import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import PostedJobs from "../components/Jobs/PostedJobs.vue";
import FindJobs from "../components/Jobs/FindJobs.vue";
import ApplyJob from "../components/Jobs/ApplyJob.vue";
import JobDetails from "../components/Jobs/JobDetails.vue";
import PostJobs from "../components/Jobs/PostJobs.vue";
import EditJob from "@/components/Jobs/EditJob.vue";

const routes = [
    { path: "/", component: Login },
    { path: "/home", component: Home },
    { path: "/register", component: Register },
    { path: "/posted-jobs", name: "PostedJobs", component: PostedJobs },
    {
        path: "/find-jobs",
        component: FindJobs,
    },
    { path: "/applyjob", component: ApplyJob },
    {
        path: "/jobdetails/:jobID",
        name: "JobDetails",
        component: JobDetails,
        props: true,
    },
    {
        path: "/postjob",
        name: "PostJob",
        component: PostJobs,
    },
    {
        path: "/editjob/:jobID",
        name: "EditJob",
        component: EditJob,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem("token");

    if (!token && to.path !== "/" && to.path !== "/register") {
    } else if (token && (to.path === "/" || to.path === "/register")) {
        next("/home");
    } else {
        next();
    }
});

export default router;
