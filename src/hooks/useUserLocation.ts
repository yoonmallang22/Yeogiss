import { useEffect, useState, useRef } from "react";
import type { LatLng } from "@/types/geolocation.type";

const useUserLocation = (
  options?: PositionOptions,
  throttleMs: number = 1000,
): LatLng | null => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const lastUpdateTime = useRef<number>(0);

  // 실시간 추적
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const now = Date.now();

        // 1초 간격으로 갱신
        if (now - lastUpdateTime.current >= throttleMs) {
          setPosition(newPos);
          lastUpdateTime.current = now;
        }
      },
      (err) => console.error("위치 추적 실패:", err),
      {
        enableHighAccuracy: true,
        maximumAge: throttleMs,
        timeout: 5000,
        ...options,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [options, throttleMs]);

  return position;
};

export default useUserLocation;
