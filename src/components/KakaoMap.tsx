import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { DEFAULT_POSITION } from "@/constants/geo";
import { Outlet } from "react-router-dom";
import UserLocationControl from "@/components/userLocationControl/UserLocationControl";
import useUserLocationOnce from "@/hooks/useUserLocationOnce";
import useUserLocation from "@/hooks/useUserLocation";

const KakaoMap = () => {
  useKakaoLoader();
  const center = useUserLocationOnce();
  const userLocation = useUserLocation();

  if (center === null || userLocation === null) {
    return <Map center={DEFAULT_POSITION} className="w-full h-screen" />;
  }

  return (
    <Map center={center} className="w-full h-screen" level={3}>
      <UserLocationControl userLocation={userLocation}>
        <Outlet />
      </UserLocationControl>
    </Map>
  );
};

export default KakaoMap;
