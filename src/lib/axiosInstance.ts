import { ApiErrorService } from "@/lib/api/ApiErrorService";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => ApiErrorService.dispatch(error),
);

export default axiosInstance;
