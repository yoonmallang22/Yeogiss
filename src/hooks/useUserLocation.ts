import { useEffect, useState, useRef, useCallback } from "react";
import type { LatLng } from "@/types/geolocation.type";
import useGeoPermission from "@/hooks/useGeoPermission";
import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";

const GEOLOCATION_TIMEOUT_MS = 15000;

const useUserLocation = (
  options?: PositionOptions,
  throttleMs: number = 1000,
): LatLng | null => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const permission = useGeoPermission();

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setPosition(null);
      return;
    }

    // 기존 watch 제거 후 재등록 (중복 방지)
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastUpdateTime.current >= throttleMs) {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          lastUpdateTime.current = now;
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
      },
      {
        enableHighAccuracy: true,
        maximumAge: throttleMs,
        timeout: GEOLOCATION_TIMEOUT_MS,
        ...options,
      },
    );
  }, [options, throttleMs]);

  useEffect(() => {
    // 초기 watch 시작
    startWatching();

    if (permission === "granted") {
      startWatching(); // 허용 시 다시 위치 추적 시작
    } else if (permission === "denied") {
      setPosition(null);
    }

    return () => {
      // 언마운트 시 watch 해제
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startWatching, permission]);

  return position;
};

export default useUserLocation;
