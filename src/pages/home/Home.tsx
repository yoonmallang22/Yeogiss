import { useState, useEffect, useRef, useCallback } from "react";
import { Map } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useCurrentPosition from "@/hooks/useCurrentPosition";
import { DEFAULT_POSITION } from "@/constants/geo";
import MeButton from "@/pages/home/components/MeButton";
import MyMarker from "@/pages/home/components/MyMarker";

const Home = () => {
  useKakaoLoader();

  const [isFollowing, setIsFollowing] = useState(false);
  const [center, setCenter] = useState(DEFAULT_POSITION);
  const position = useCurrentPosition();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  /* 초기 위치 권한 확인 */
  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
          setCenter(DEFAULT_POSITION);
        }
      });
  }, []);

  /* 자동 추적 모드일 때만 position으로 중심 좌표 갱신 */
  useEffect(() => {
    if (position && isFollowing) {
      setCenter(position);
    }
  }, [position, isFollowing]);

  /* 현재 위치로 지도 중심 이동 */
  const moveToPosition = useCallback((lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setCenter(new kakao.maps.LatLng(lat, lng));
    }
  }, []);

  const handleMeButtonClick = () => {
    if (!position) {
      toast(
        "브라우저(혹은 OS)의 위치 서비스가 꺼져 있어요. 위치 서비스를 켜야 이용 가능해요.",
      );
      return;
    }
    // 자동 추적 모드 활성화 + 지도 중심 이동
    setIsFollowing(true);
    moveToPosition(position.lat, position.lng);
  };

  /* 지도 드래그 or 줌 시 자동 추적 해제 + 중심 좌표 저장 */
  const handleDragOrZoom = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      setCenter({ lat: center.getLat(), lng: center.getLng() });
    }
    setIsFollowing(false);
  };

  return (
    <div className="w-full h-screen">
      <Map
        center={center}
        className="w-full h-full"
        level={3}
        ref={mapRef}
        onDragStart={handleDragOrZoom}
        onZoomChanged={handleDragOrZoom}
      >
        {position && <MyMarker myLocation={position} />}
      </Map>

      <MeButton onClick={handleMeButtonClick} isFollowing={isFollowing} />
    </div>
  );
};

export default Home;
