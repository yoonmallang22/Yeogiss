import { useEffect, useState, useRef, useCallback } from "react";
import type { LatLng } from "@/types/geolocation.type";
import useGeoPermission from "@/hooks/useGeoPermission";
import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";

const GEOLOCATION_TIMEOUT_MS = 15000; // 위치 요청 타임아웃
const MAX_RETRY = 3; // 최대 재시도 횟수
const RETRY_DELAY = 2000; // 재시도 간격(ms)

const useUserLocation = (
  start: boolean = true,
  options?: PositionOptions,
  throttleMs: number = 1000,
): LatLng | null => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const permission = useGeoPermission();
  const retryCount = useRef<number>(0);

  const startWatching = useCallback(() => {
    if (!start) return;

    if (!navigator.geolocation) {
      setPosition(null);
      return;
    }

    // 기존 watch 제거 후 재등록
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastUpdateTime.current >= throttleMs) {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          lastUpdateTime.current = now;
          retryCount.current = 0; // 성공하면 재시도 카운트 초기화
        }
      },
      (err) => {
        console.error("위치 추적 실패:", err);
        setPosition(null);

        trackEvent("ERROR_OCCURRED", {
          error_code: err.code,
          error_message: err.message,
          screen_name: getScreenName(location.pathname),
        });

        // 일시적 오류라면 재시도
        if (retryCount.current < MAX_RETRY) {
          console.log("위치 추적 재시도: ", retryCount.current + 1);
          retryCount.current += 1;
          setTimeout(() => {
            startWatching();
          }, RETRY_DELAY);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: throttleMs,
        timeout: GEOLOCATION_TIMEOUT_MS,
        ...options,
      },
    );
  }, [start, options, throttleMs]);

  // 초기 실행
  useEffect(startWatching, [startWatching]);

  // 권한 상태 변화에 따른 처리
  useEffect(() => {
    console.log("permission changed:", permission);
    if (permission === "granted") {
      startWatching();
    } else if (permission === "denied") {
      startWatching(); // 권한이 거부되어도 위치 추적 시도
      setPosition(null);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [permission, startWatching]);

  return position;
};

export default useUserLocation;
