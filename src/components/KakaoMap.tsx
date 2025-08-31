import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { DEFAULT_POSITION } from "@/constants/geo";
import { Outlet } from "react-router-dom";
import UserLocationControl from "@/components/userLocationControl/UserLocationControl";
import useGeoPermission from "@/hooks/useGeoPermission";
import useUserLocation from "@/hooks/useUserLocation";

const KakaoMap = () => {
  useKakaoLoader();
  const permission = useGeoPermission();
  const userLocation = useUserLocation();

  return permission === "granted" && userLocation ? (
    <Map
      center={userLocation}
      className="w-full h-screen"
      level={3}
      isPanto={true}
    >
      <UserLocationControl userLocation={userLocation}>
        <Outlet />
      </UserLocationControl>
    </Map>
  ) : (
    <Map center={DEFAULT_POSITION} className="w-full h-screen" />
  );
};

export default KakaoMap;
