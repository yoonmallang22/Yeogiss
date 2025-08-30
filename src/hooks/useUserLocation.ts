import { useEffect, useState, useRef, useCallback } from "react";
import type { LatLng } from "@/types/geolocation.type";
import useGeoPermission from "@/hooks/useGeoPermission";

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
      },
      {
        enableHighAccuracy: true,
        maximumAge: throttleMs,
        timeout: 5000,
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
