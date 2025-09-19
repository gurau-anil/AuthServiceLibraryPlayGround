import axios from "axios";
import { BASEURL } from "./config";
import { OpenToast } from "./utilities/toast";

const httpClient = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

httpClient.interceptors.request.use(
  function (config) {
    //   const token = localStorage.getItem("bearer-token")?? '';
    //   token.length > 0
    //     config.headers.Authorization = `Bearer ${token}`

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or API is down
      OpenToast("error", "Unable to connect to the server. Please try again later.");
    } 
    // else {
    //   const message = error.response?.data?.errors[0] || error.response.data?.message || "Something went wrong.";
    //   OpenToast("error", message);
    // }
    return Promise.reject(error);
  }
);


export default httpClient;
