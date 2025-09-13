import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";

const useApiError = () => {
  const handleError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const httpStatus = error.response.status;
        const httpMessage = error.response.data.message;

        trackEvent("ERROR_OCCURRED", {
          error_code: httpStatus,
          error_message: httpMessage,
          screen_name: getScreenName(location.pathname),
        });

        const handler =
          statusHandlers[httpStatus as keyof typeof statusHandlers] ??
          statusHandlers.default;
        handler(httpMessage);

        trackEvent("TOAST_MESSAGE_DISPLAYED", {
          message_type: httpStatus >= 500 ? "server_error" : "client_error",
          message_content: httpMessage,
        });
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
