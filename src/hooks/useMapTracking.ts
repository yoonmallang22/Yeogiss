import { useEffect, useRef } from "react";
import type { LatLng } from "@/types/geolocation.type";
import { trackEvent } from "@/lib/trackEvent";

type Options = {
  onFollowingEnd?: () => void; // 🔹 드래그/줌 시작 시 호출할 콜백
};

const useMapTracking = (
  kakaoMap: kakao.maps.Map | null,
  options: Options = {},
) => {
  const { onFollowingEnd } = options;
  const prevCenter = useRef<LatLng | null>(null);

  useEffect(() => {
    if (!kakaoMap) return;

    // 최초 기준점 설정
    const c = kakaoMap.getCenter();
    prevCenter.current = { lat: c.getLat(), lng: c.getLng() };

    const handleMapMoveEnd = () => {
      const center = kakaoMap.getCenter();
      const newCenter = { lat: center.getLat(), lng: center.getLng() };
      const zoom = kakaoMap.getLevel();

      if (prevCenter.current) {
        trackEvent("MAP_CENTER_MOVED", {
          old_center: JSON.stringify(prevCenter.current),
          new_center: JSON.stringify(newCenter),
          zoom,
        });
      }
      prevCenter.current = newCenter;
    };

    const handleDragStart = () => {
      onFollowingEnd?.(); // 🔹 드래그 시작 → 자동추적 해제
    };

    const handleZoomChanged = () => {
      onFollowingEnd?.(); // 🔹 줌 변경 → 자동추적 해제
      handleMapMoveEnd(); // 변경 후 상태 기록
    };

    window.kakao.maps.event.addListener(kakaoMap, "dragstart", handleDragStart);
    window.kakao.maps.event.addListener(kakaoMap, "dragend", handleMapMoveEnd);
    window.kakao.maps.event.addListener(
      kakaoMap,
      "zoom_changed",
      handleZoomChanged,
    );

    return () => {
      window.kakao.maps.event.removeListener(
        kakaoMap,
        "dragstart",
        handleDragStart,
      );
      window.kakao.maps.event.removeListener(
        kakaoMap,
        "dragend",
        handleMapMoveEnd,
      );
      window.kakao.maps.event.removeListener(
        kakaoMap,
        "zoom_changed",
        handleZoomChanged,
      );
    };
  }, [kakaoMap, onFollowingEnd]);
};

export default useMapTracking;
