import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import loadingIndicatorImg from "@/assets/loading-indicator.svg";

interface LoadingContextValue {
  show: () => void;
  hide: () => void;
  isLoading: boolean;
}

/**
 * api 호출 시 로딩 상태 및 컴포넌트를 공유하기 위한 전역 context
 */
// eslint-disable-next-line react-refresh/only-export-components
export const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const show = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const hide = useCallback(() => {
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo(
    () => ({
      show,
      hide,
      isLoading: count > 0,
    }),
    [count, show, hide],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}

      {count > 0 && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/30">
          <img src={loadingIndicatorImg} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }

  return context;
}
