import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from "@/store/user";

import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Myjobs from '../components/Jobs/MyJobs.vue';
import ApplyJob from '../components/Jobs/ApplyJob.vue';
import JobDetails from '../components/Jobs/JobDetails.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/myjobs', component: Myjobs },
        { path: '/applyjob' , component: ApplyJob},
        { path: '/jobdetails', component: JobDetails },

    ]
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    userStore.checkUser();

    next();
});

export default router;
