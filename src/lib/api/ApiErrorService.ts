import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";
import axios from "axios";
import { toast } from "react-toastify";

let errorHandler: ((error: unknown) => void) | null = null;

export const deafultErrorHanlder = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      toast("⚠ 네트워크 연결이 불안정해요.\n 잠시 후 다시 시도해주세요.", {
        style: { whiteSpace: "pre-line" },
      });
    } else {
      const httpStatus = error.response.status;
      const httpMessage = error.response.data.message;

      const handler =
        statusHandlers[httpStatus as keyof typeof statusHandlers] ??
        statusHandlers.default;
      handler(httpMessage);

      GA4ErrorTracking(httpStatus, httpMessage);
    }
  }

  return Promise.reject(error);
};

const statusHandlers = {
  400: (msg: string) => toast(`⚠ ${msg}`),
  500: () =>
    toast(`⚠ 서버 오류가 발생했습니다. \n 잠시 후 다시 시도해주세요.`, {
      style: { whiteSpace: "pre-line" },
    }),
  default: (message: string) =>
    toast(
      `⚠ ${message || "알 수 없는 오류가 발생했습니다.\n 잠시 후 다시 시도해주세요."}`,
      {
        style: { whiteSpace: "pre-line" },
      },
    ),
};

const GA4ErrorTracking = (httpStatus: number, httpMessage: string) => {
  trackEvent("ERROR_OCCURRED", {
    error_code: httpStatus,
    error_message: httpMessage,
    screen_name: getScreenName(location.pathname),
  });

  trackEvent("TOAST_MESSAGE_DISPLAYED", {
    message_type: httpStatus >= 500 ? "server_error" : "client_error",
    message_content: httpMessage,
  });
};

errorHandler = deafultErrorHanlder;

/**
 * API 에러 처리 관련 dispatcher
 * 기본적으로 에러처리는 deafultErrrorHanlder가 담당하나, 특정 케이스에서 에러 처리 방식을 변경할 수 있도록 구현한다.
 */
export const ApiErrorService = {
  register(handler: (error: unknown) => void) {
    errorHandler = handler;
  },

  dispatch(error: unknown) {
    if (errorHandler) {
      return errorHandler(error);
    }
  },
};
