import axios from "axios";
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  ApiErrorService,
  deafultErrorHanlder,
} from "@/lib/api/ApiErrorService";
import type { GetRoutesParams, Routes } from "@/lib/api/routes";
import { fetchRoutes } from "@/lib/api/routes";
import { toast } from "react-toastify";

interface PrivacyThirdPartyConsentFlowState {
  /**
   * 사용자의 개인정보 제3자 제공동의가 필요한지 여부
   */
  isConsentRequired: boolean;
  /**
   * 동의 완료 후 길찾기 재시작 위해 임시 저장
   */
  pendingApiParameter: GetRoutesParams | null;
}

interface PrivacyThirdPartyConsentFlowContextProps {
  /**
   * 길찾기 플로우 상태, 동의 플로우 진행시 쓰레기통 정보를 임시 저장하기 위함
   */
  state: PrivacyThirdPartyConsentFlowState;

  /**
   * 길찾기 endpoint로 서버에 요청을 보내는 api
   * api에서 401 응답을 반환하는 경우 개인정보 제3자 제공동의 플로우를 시작한다.
   */
  requestDirection: (
    getRoutesParams: GetRoutesParams,
    successCallback: (routes: Routes) => void,
  ) => void;

  /**
   * 사용자가 개인정보 제3자 제공동의 완료시 호출하는 함수
   * 동의 플로우 상태를 초기화하고, 임시 저장된 쓰레기통 정보로 길찾기 재요청을 실행한다.
   */
  completeFlow: () => void;

  /**
   * 개인정보 제3자 제공동의 상태를 초기화한다.
   */
  resetFlow: () => void;

  /**
   * 개인정보 제3자 제공동의 풀팝업이 열려있는지에 대한 상태
   */
  isConsentPopupOpen: boolean;

  /**
   * 개인정보 제3자 제공동의 풀팝업을 토글
   */
  toggleConsentPopupOpen: () => void;
}

const PrivacyThirdPartyConsentFlowContext =
  createContext<PrivacyThirdPartyConsentFlowContextProps | null>(null);

/**
 * 길찾기 기능의 동작을 위해 사용자로부터 개인정보 제3자 제공동의를 받는 플로우 구현을 위한 Context
 */
// eslint-disable-next-line react-refresh/only-export-components
export const usePrivacyThirdPartyConsentFlow = () => {
  const ctx = useContext(PrivacyThirdPartyConsentFlowContext);
  if (!ctx) {
    throw new Error("PrivacyThirdPartyConsentFlowContext is not provided");
  }
  return ctx;
};

/**
 * 길찾기 기능의 동작을 위해 사용자로부터 개인정보 제3자 제공동의를 받는 플로우 구현을 위한 Context
 */
const PrivacyThirdPartyConsentFlowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<PrivacyThirdPartyConsentFlowState>({
    isConsentRequired: false, // 동의가 필요한지에 대한 상태
    pendingApiParameter: null, // 임시 저장한 길찾기 요청 request 파라미터
  });
  // 개인정보 제3자 동의 팝업 열림 상태(카드 컴포넌트 내 버튼 클릭시 변경됨)
  const [isConsentPopupOpen, setIsConsentPopupOpen] = useState(false);
  // 길찾기 성공시 실행할 콜백을 임시로 저장하는 ref
  const successCallbackRef = React.useRef<((routes: Routes) => void) | null>(
    null,
  );

  // 개인정보 제3자 제공동의 플로우 상태 초기화 함수
  const resetFlow = useCallback(() => {
    setState({
      isConsentRequired: false,
      pendingApiParameter: null,
    });
  }, []);

  /**
   * 길찾기 API 요청 함수
   * 동의가 필요한 경우 동의 플로우를 시작한다.
   * @param bin 길찾기 대상 쓰레기통 정보
   * @param successCallback 길찾기 성공시 호출할 콜백 함수
   */
  const requestDirection = useCallback(
    async (
      getRoutesParams: GetRoutesParams,
      successCallback: (routes: Routes) => void,
    ) => {
      successCallbackRef.current = successCallback;

      // 401 에러시 처리를 위한 에러 핸들러를 등록한다.
      ApiErrorService.register((error: unknown) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setState({
              isConsentRequired: true,
              pendingApiParameter: getRoutesParams,
            });
          } else {
            deafultErrorHanlder(error);
          }
        } else {
          deafultErrorHanlder(error);
        }
      });

      const response = await fetchRoutes(getRoutesParams);

      successCallback(response.data);
      // 요청이 성공했으므로 에러 핸들러를 기본값으로 복원한다.
      ApiErrorService.register(deafultErrorHanlder);
    },
    [],
  );

  // 개인정보 제3자 제공동의 완료시 호출하는 함수
  const completeFlow = useCallback(async () => {
    if (!state.pendingApiParameter) return;
    console.log("completeFlow called");
    ApiErrorService.register((error: unknown) => {
      // 정책 동의 이후에도 401 에러가 발생하는 경우는 비정상 케이스이므로 토스트 메시지 처리
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast("⚠ 예기치 못한 오류가 발생했습니다.");
        } else {
          deafultErrorHanlder(error);
        }
      }
    });
    const pendingApiParameter = state.pendingApiParameter;

    resetFlow();

    // pending 상태었던 길찾기 재요청
    const response = await fetchRoutes(pendingApiParameter);

    if (successCallbackRef.current) {
      successCallbackRef.current(response.data);
    }

    ApiErrorService.register(deafultErrorHanlder);
  }, [state.pendingApiParameter, resetFlow]);

  const toggleConsentPopupOpen = React.useCallback(() => {
    setIsConsentPopupOpen((prev) => !prev);
  }, []);

  return (
    <PrivacyThirdPartyConsentFlowContext.Provider
      value={{
        state,
        requestDirection,
        completeFlow,
        resetFlow,
        isConsentPopupOpen,
        toggleConsentPopupOpen,
      }}
    >
      {children}
    </PrivacyThirdPartyConsentFlowContext.Provider>
  );
};

export default PrivacyThirdPartyConsentFlowProvider;
