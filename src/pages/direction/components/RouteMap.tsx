import { memo, useEffect, useContext } from "react";
import { MapMarker, Polyline, KakaoMapContext } from "react-kakao-maps-sdk";
import type { LatLng } from "@/types/geolocation.type";
import startMarkerImage from "@/assets/start-marker.svg";
import endMarkerImage from "@/assets/end-marker.svg";

type RouteMapProps = {
  start: LatLng;
  end: LatLng;
  path: LatLng[];
};

const BOTTOM_INFO_HEIGHT = 150; // BinInfoCard 높이
const CENTER_OFFSET = BOTTOM_INFO_HEIGHT / 2 - 5; // 이동할 픽셀 값

const RouteMapComponent = ({ start, end, path }: RouteMapProps) => {
  const kakaoMap = useContext(KakaoMapContext);

  const positions = [
    { position: start, image: startMarkerImage },
    { position: end, image: endMarkerImage },
  ];

  /* 경로 전체를 화면에 표시하기 위해 지도 범위 자동 조정 */
  useEffect(() => {
    if (!kakaoMap || path.length === 0) return;

    // 경로 전체 bounds 계산
    const bounds = new kakao.maps.LatLngBounds();
    path.forEach(({ lat, lng }: LatLng) =>
      bounds.extend(new kakao.maps.LatLng(lat, lng)),
    );

    // 경로 전체가 화면에 보이도록 범위 설정
    kakaoMap.setBounds(bounds);
    kakaoMap.relayout();

    // 경로 중심 보정 (BinInfoCard 높이 고려)
    const projection = kakaoMap.getProjection();
    const center = kakaoMap.getCenter();
    const centerPoint = projection.pointFromCoords(center);
    const movedPoint = new kakao.maps.Point(
      centerPoint.x,
      centerPoint.y + CENTER_OFFSET, // CENTER_OFFSET만큼 위로 중심 이동
    );
    kakaoMap.setCenter(projection.coordsFromPoint(movedPoint));
  }, [kakaoMap, path]);

  return (
    <>
      <Polyline
        path={path}
        strokeWeight={6}
        strokeColor={"#2AA9A8"}
        strokeOpacity={0.9}
        strokeStyle={"solid"}
      />
      {positions.map((v, i) => {
        return (
          <MapMarker
            key={i}
            position={v.position}
            image={{ src: v.image, size: { width: 32, height: 38 } }}
          />
        );
      })}
    </>
  );
};

const RouteMap = memo(RouteMapComponent);

export default RouteMap;
