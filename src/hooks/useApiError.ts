import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-toastify";

const useApiError = () => {
  const handleError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const httpStatus = error.response.status;
        const httpMessage = error.response.data.message;

        const handler =
          statusHandlers[httpStatus as keyof typeof statusHandlers] ??
          statusHandlers.default;
        handler(httpMessage);
        return;
      } else {
        toast.error("서버 연결이 원활하지 않습니다.");
        return;
      }
    } else {
      statusHandlers.default();
      return;
    }
  }, []);

  return { handleError };
};

const statusHandlers = {
  400: (msg: string) => toast.error(msg),
  500: () => toast.error("서버 오류가 발생했습니다."),
  default: (msg?: string) =>
    toast.error(msg || "알 수 없는 오류가 발생했습니다."),
};

export default useApiError;
