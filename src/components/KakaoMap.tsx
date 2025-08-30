import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { DEFAULT_POSITION } from "@/constants/geo";
import { Outlet } from "react-router-dom";
import UserLocationControl from "@/components/userLocationControl/UserLocationControl";

const KakaoMap = () => {
  useKakaoLoader();

  return (
    <Map
      center={DEFAULT_POSITION}
      className="w-full h-screen"
      level={3}
      isPanto={true}
    >
      <UserLocationControl>
        <Outlet />
      </UserLocationControl>
    </Map>
  );
};

export default KakaoMap;
