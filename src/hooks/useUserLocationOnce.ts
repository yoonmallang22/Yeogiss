import { useState, useEffect } from "react";
import type { LatLng } from "@/types/geolocation.type";

const useUserLocationOnce = (options?: PositionOptions): LatLng | null => {
  const [position, setPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("위치 가져오기 실패:", err);
        setPosition(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        ...options,
      },
    );
  }, [options]);

  return position;
};

export default useUserLocationOnce;
