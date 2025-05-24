import axios from "axios";

const $axios = axios.create({
    baseURL: "http://localhost/api/",
});

$axios.imgBaseURL = "http://localhost/img";

export default $axios;
