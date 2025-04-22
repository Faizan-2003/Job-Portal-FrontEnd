import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Myjobs from '../components/Jobs/MyJobs.vue';
import ApplyJob from '../components/Jobs/ApplyJob.vue';
import JobDetails from '../components/Jobs/JobDetails.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: Login },
        { path: '/home', component: Home },
        { path: '/register', component: Register },
        { path: '/myjobs', component: Myjobs },
        { path: '/applyjob' , component: ApplyJob},
        { path: '/jobdetails', component: JobDetails },

    ]
});


export default router;
