import { useEffect, useRef } from "react";
import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_POSITION } from "@/constants/geo";
import { Outlet } from "react-router-dom";
import UserLocationControl from "@/components/userLocationControl/UserLocationControl";
import type { LatLng } from "@/types/geolocation.type";

const KakaoMap = () => {
  useKakaoLoader();
  const userLocation = useUserLocation();
  const userLocationRef = useRef<LatLng | null>(null);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  console.log(userLocation, userLocationRef.current);

  if (userLocation === null || userLocationRef.current === null) {
    return <Map center={DEFAULT_POSITION} className="w-full h-screen" />;
  }

  return (
    <Map center={userLocationRef.current} className="w-full h-screen" level={3}>
      <UserLocationControl userLocation={userLocation}>
        <Outlet />
      </UserLocationControl>
    </Map>
  );
};

export default KakaoMap;
