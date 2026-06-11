import { useCallback } from "react";
import { useLoading } from "@/lib/loading/LoadingContext";

/**
 * Promise 기반 API 함수를 loading 인디케이터와 함께 실행한다.
 */
const useLoadingApi = <Args extends unknown[], Result>(
  apiFn: (...args: Args) => Promise<Result>,
) => {
  const { show, hide } = useLoading();

  return useCallback(
    async (...args: Args): Promise<Result> => {
      show();

      try {
        return await apiFn(...args);
      } finally {
        hide();
      }
    },
    [apiFn, hide, show],
  );
};

export default useLoadingApi;
