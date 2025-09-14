import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // 네트워크 단절, DNS 오류, CORS 문제 등
      toast("⚠ 네트워크 연결이 불안정해요.\n 잠시 후 다시 시도해주세요.", {
        style: { whiteSpace: "pre-line" },
      });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
