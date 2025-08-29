import reloadImage from "@/assets/restart.svg";
import { getNearbyBins, type Bin } from "@/lib/api/bin";
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

  useEffect(() => {
    if (!kakaoMap) return;
    lastCenterRef.current = kakaoMap.getCenter();

    window.kakao.maps.event.addListener(kakaoMap, "dragend", () => {
      const newCenter = kakaoMap.getCenter();
      const prevCenter = lastCenterRef.current;

      if (!prevCenter) {
        lastCenterRef.current = newCenter;
        return;
      }

      // 거리 계산 (m 단위)
      const line = new kakao.maps.Polyline({
        path: [prevCenter, newCenter],
      });
      const distance = line.getLength();

      if (distance >= showThreshold) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [kakaoMap, showThreshold]);

  if (!show) return null;

  return (
    <button
      className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10 flex items-center gap-2 text-sm cursor-pointer"
      onClick={() => {
        lastCenterRef.current = kakaoMap.getCenter();
        setShow(false);
        const bounds = kakaoMap.getBounds();
        const sw = bounds.getSouthWest(); // 남서쪽
        const ne = bounds.getNorthEast(); // 북동쪽
        const line = new kakao.maps.Polyline({ path: [sw, ne] });
        const diagonal = line.getLength(); // 미터 단위

        getNearbyBins(
          kakaoMap.getCenter().getLat(),
          kakaoMap.getCenter().getLng(),
          Math.ceil(diagonal / 2),
        ).then((response) => {
          if (response.data.length === 0) {
            toast.info("해당 지역에 등록된 쓰레기통이 없어요");
          } else {
            if (onLoaded) onLoaded(response.data);
          }
        });
      }}
    >
      <img src={reloadImage} alt="쓰레기통 더보기" />이 위치에서 다시 찾기
    </button>
  );
};

export default LoadBinsButton;
