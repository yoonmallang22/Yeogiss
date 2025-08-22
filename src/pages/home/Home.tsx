import { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useCurrentPosition from "@/hooks/useCurrentPosition";
import type { LatLng } from "@/types/geolocation.type";
import { DEFAULT_POSITION } from "@/constants/geo";
import MeButton from "@/pages/home/components/MeButton";

const Home = () => {
  useKakaoLoader();

  const [center, setCenter] = useState<LatLng>(DEFAULT_POSITION);
  const [isFollowing, setIsFollowing] = useState(true);
  const position = useCurrentPosition();

  useEffect(() => {
    if (position && isFollowing) {
      if (center.lat !== position.lat || center.lng !== position.lng) {
        setCenter(position);
      }
    }
  }, [position, isFollowing, center]);

  return (
    <div className="w-full h-screen">
      <Map
        center={center}
        className="w-full h-full"
        level={3}
        onDragStart={() => setIsFollowing(false)}
        onDragEnd={(map) => {
          const latlng = map.getCenter();
          setCenter({ lat: latlng.getLat(), lng: latlng.getLng() });
        }}
        onZoomChanged={(map) => {
          setIsFollowing(false);
          const latlng = map.getCenter();
          setCenter({ lat: latlng.getLat(), lng: latlng.getLng() });
        }}
      >
        {position && <MapMarker position={position} />}
      </Map>
      <MeButton
        onClick={() => {
          if (!position) {
            toast(
              "브라우저(혹은 OS)의 위치 서비스가 꺼져 있어요. 위치 서비스를 켜야 이용 가능해요."
            );
            return;
          }
          setIsFollowing(!isFollowing);
          setCenter(position);
        }}
      />
    </div>
  );
};

export default Home;
