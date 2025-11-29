import axios from "axios";
import { toast } from "react-toastify";

let errorHandler: ((error: unknown) => void) | null = null;

export const deafultErrorHanlder = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.log("axiosError!!");
    if (!error.response) {
      // 네트워크 단절, DNS 오류, CORS 문제 등
      toast("⚠ 네트워크 연결이 불안정해요.\n 잠시 후 다시 시도해주세요.", {
        style: { whiteSpace: "pre-line" },
      });
    }
  }

  return Promise.reject(error);
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
    console.log(errorHandler);
    if (errorHandler) {
      return errorHandler(error);
    }
  },
};
