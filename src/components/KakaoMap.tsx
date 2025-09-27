import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { DEFAULT_POSITION } from "@/constants/geo";
import { Outlet } from "react-router-dom";
import UserLocationControl from "@/components/userLocationControl/UserLocationControl";
import useUserLocation from "@/hooks/useUserLocation";
import { useEffect, useState } from "react";

const KakaoMap = () => {
  useKakaoLoader();

  const userLocation = useUserLocation();
  const [center, setCenter] = useState(DEFAULT_POSITION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLocation && loading) {
      setCenter(userLocation);
      setLoading(false);
    }
  }, [userLocation, loading]);

  if (userLocation === null || loading) {
    return (
      <Map center={DEFAULT_POSITION} className="w-full h-screen">
        <UserLocationControl />
      </Map>
    );
  }

  return (
    <Map center={center} className="w-full h-dvh" level={3}>
      <UserLocationControl userLocation={userLocation}>
        <Outlet />
      </UserLocationControl>
    </Map>
  );
};

export default KakaoMap;
