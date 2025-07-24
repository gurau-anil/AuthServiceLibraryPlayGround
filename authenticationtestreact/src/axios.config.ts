import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://localhost:7052',
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem("bearer-token")?? '';
  token.length > 0
    config.headers.Authorization = `Bearer ${token}`

  return config;
}, function (error) {
  console.error("Error while make a http call.")
  return Promise.reject(error);
});


export default httpClient;