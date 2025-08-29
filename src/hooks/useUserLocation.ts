import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import type { LatLng } from "@/types/geolocation.type";

const useUserLocation = (
  options?: PositionOptions,
  throttleMs: number = 1000,
): LatLng | null => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);

  // 위치 추적 함수
  const startWatching = useCallback(() => {
    if (!navigator.permissions) {
      toast("⚠ 기기에서 위치 기능을 지원하지 않아 위치 확인이 불가능해요.");
      setPosition(null);
      return;
    }

    // 기존 watch 제거 후 재등록 (중복 방지)
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const now = Date.now();

        // 1초 간격으로 갱신
        if (now - lastUpdateTime.current >= throttleMs) {
          setPosition(newPos);
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

    // 위치 권한 상태 감시 → granted로 변경되면 watch 다시 실행
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        status.onchange = () => {
          if (status.state === "granted") {
            startWatching(); // 허용 시 다시 위치 추적 시작
          } else if (status.state === "denied") {
            setPosition(null);
          }
        };
      });
    }

    return () => {
      // 언마운트 시 watch 해제
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [options, throttleMs, startWatching]);

  return position;
};

export default useUserLocation;
