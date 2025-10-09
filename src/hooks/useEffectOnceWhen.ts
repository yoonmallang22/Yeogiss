import { useEffect, useRef } from "react";

const useEffectOnceWhen = (condition: boolean, callback: () => void) => {
  const hasRun = useRef(false);
  const callbackRef = useRef(callback);

  // 최신 callback을 항상 참조
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (condition && !hasRun.current) {
      hasRun.current = true;
      callbackRef.current();
    }
  }, [condition]);
};

export default useEffectOnceWhen;
