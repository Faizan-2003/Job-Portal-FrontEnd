import axios from "axios";

const $axios = axios.create({
    baseURL: "http://localhost",
});

export default $axios;
