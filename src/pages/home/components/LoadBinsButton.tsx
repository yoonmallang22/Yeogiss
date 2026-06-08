import reloadImage from "@/assets/restart.svg";
import { getNearbyBins, type Bin } from "@/lib/api/bin";
import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";
import { useContext, useEffect, useRef, useState } from "react";
import { KakaoMapContext } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";

/**
 * 쓰레기통 추가 로드 기능
 */
const LoadBinsButton = ({
  onLoaded,
  showThreshold = 500,
}: {
  onLoaded?: (bins: Bin[]) => void;
  showThreshold?: number;
}) => {
  const [show, setShow] = useState(false);
  const kakaoMap = useContext(KakaoMapContext);
  // 이전 지도 중심에 대한 좌표를 기억한다.
  const lastCenterRef = useRef<kakao.maps.LatLng | null>(null);
  // 이전 지도 줌 레벨을 기억한다.
  const lastZoomRef = useRef<number | null>(null);

  useEffect(() => {
    if (!kakaoMap) return;
    lastCenterRef.current = kakaoMap.getCenter();
    lastZoomRef.current = kakaoMap.getLevel();

    // 중심 이동 감지 (idle)
    const onIdle = () => {
      const newCenter = kakaoMap.getCenter();
      const prevCenter = lastCenterRef.current;

      if (!prevCenter) {
        lastCenterRef.current = newCenter;
        return;
      }

      const line = new kakao.maps.Polyline({ path: [prevCenter, newCenter] });
      const distance = line.getLength();

      if (distance >= showThreshold) {
        setShow(true);
        // 기준 좌표 갱신
        lastCenterRef.current = newCenter;
      }
    };

    window.kakao.maps.event.addListener(kakaoMap, "idle", onIdle);

    // 줌 변경 감지
    const onZoomChanged = () => {
      setShow(true); // 무조건 버튼 표시
      lastZoomRef.current = kakaoMap.getLevel();
    };
    window.kakao.maps.event.addListener(
      kakaoMap,
      "zoom_changed",
      onZoomChanged,
    );

    return () => {
      if (!kakaoMap) return;
      window.kakao.maps.event.removeListener(kakaoMap, "idle", () => {});
      window.kakao.maps.event.removeListener(
        kakaoMap,
        "zoom_changed",
        () => {},
      );
    };
  }, [kakaoMap, showThreshold]);

  if (!show) return null;

  return (
    <button
      className="absolute top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10 flex items-center gap-2 text-sm cursor-pointer"
      onClick={() => {
        lastCenterRef.current = kakaoMap.getCenter();
        setShow(false);
        const bounds = kakaoMap.getBounds();
        const sw = bounds.getSouthWest(); // 남서쪽
        const ne = bounds.getNorthEast(); // 북동쪽
        const line = new kakao.maps.Polyline({ path: [sw, ne] });
        const diagonal = line.getLength(); // 미터 단위

        // get api 통신
        getNearbyBins(
          kakaoMap.getCenter().getLat(),
          kakaoMap.getCenter().getLng(),
          Math.ceil(diagonal / 2),
        ).then((response) => {
          if (response.data.length === 0) {
            toast(
              "⚠ 현재 위치에는 쓰레기통이 없어요. 조금만 더 걸어가 볼까요?",
            );
          } else {
            if (onLoaded) onLoaded(response.data);
          }
        });

        trackEvent("TRASH_BIN_DATA_REFRESHED", {
          method: "click",
          screen_name: getScreenName(location.pathname),
        });
      }}
    >
      <img src={reloadImage} alt="쓰레기통 더보기" />이 위치에서 다시 찾기
    </button>
  );
};

export default LoadBinsButton;
