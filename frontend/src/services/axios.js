import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5565",
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       localStorage.removeItem('token');
//       // location.reload();
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;