import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_POSITION } from "@/constants/geo";
import { Outlet } from "react-router-dom";
import UserLocationControl from "@/components/userLocationControl/UserLocationControl";

const KakaoMap = () => {
  useKakaoLoader();
  const userLocation = useUserLocation();

  return userLocation ? (
    <Map
      center={userLocation}
      className="w-full h-screen"
      level={3}
      isPanto={true}
    >
      <UserLocationControl>
        <Outlet />
      </UserLocationControl>
    </Map>
  ) : (
    <Map center={DEFAULT_POSITION} className="w-full h-screen" />
  );
};

export default KakaoMap;
