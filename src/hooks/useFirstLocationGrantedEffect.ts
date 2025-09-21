import { useEffect, useRef } from "react";

/**
 * permission이 "granted"로 변경된 최초 1회에만 callback을 실행하는 훅
 * @param permission "granted" | "denied" | "prompt"
 * @param callback permission이 "granted"로 변경된 최초 1회에 실행할 콜백 함수
 */
const useFirstLocationGrantedEffect = (
  permission: PermissionState, // "granted" | "denied" | "prompt"
  callback: () => void,
) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (permission === "granted" && !hasRun.current) {
      hasRun.current = true;
      callback();
    }
  }, [permission, callback]);
};

export default useFirstLocationGrantedEffect;
