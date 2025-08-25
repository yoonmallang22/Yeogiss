import { useState, useEffect, useRef, useCallback } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useCurrentPosition from "@/hooks/useCurrentPosition";
import { DEFAULT_POSITION } from "@/constants/geo";
import MeButton from "@/pages/home/components/MeButton";

const Home = () => {
  useKakaoLoader();

  const [isFollowing, setIsFollowing] = useState(true);
  const position = useCurrentPosition();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  /* 현재 위치로 지도 중심 이동 */
  const moveToPosition = useCallback(() => {
    if (!position) {
      toast(
        "브라우저(혹은 OS)의 위치 서비스가 꺼져 있어요. 위치 서비스를 켜야 이용 가능해요."
      );
      return;
    }
    if (mapRef.current) {
      mapRef.current.setCenter(
        new kakao.maps.LatLng(position.lat, position.lng)
      );
    }
  }, [position]);

  useEffect(() => {
    if (position && isFollowing) {
      moveToPosition();
    }
  }, [position, isFollowing, moveToPosition]);

  return (
    <div className="w-full h-screen">
      <Map
        center={position ?? DEFAULT_POSITION}
        className="w-full h-full"
        level={3}
        ref={mapRef}
        onDragStart={() => setIsFollowing(false)}
        onZoomChanged={() => setIsFollowing(false)}
      >
        {position && <MapMarker position={position} />}
      </Map>
      <MeButton
        onClick={() => {
          setIsFollowing(true);
          moveToPosition();
        }}
      />
    </div>
  );
};

export default Home;
