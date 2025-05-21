import axios from "axios";

const $axios = axios.create({
    baseURL: "http://localhost",
});

$axios.imgBaseURL = "http://localhost/img";

export default $axios;
