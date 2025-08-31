import { useState, useEffect, useContext, type ReactNode } from "react";
import { KakaoMapContext } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import useUserLocation from "@/hooks/useUserLocation";
import useGeoPermission from "@/hooks/useGeoPermission";
import MyMarker from "@/components/userLocationControl/MyMarker";
import MeButton from "@/components/userLocationControl/MeButton";
import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { useLocation } from "react-router-dom";

const UserLocationControl = ({ children }: { children: ReactNode }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLocationButtonFloat, setIsLocationButtonFloat] = useState(false);

  const location = useLocation();
  const kakaoMap = useContext(KakaoMapContext);
  const userLocation = useUserLocation();
  const permission = useGeoPermission();

  /* 권한 상태 변화 시 자동 추적 모드 제어 */
  useEffect(() => {
    if (location.pathname === "/") {
      setIsFollowing(permission === "granted");
    }
  }, [permission, location]);

  /* 자동 추적 모드일 때만 사용자 위치로 중심 좌표 갱신 */
  useEffect(() => {
    if (userLocation && isFollowing) {
      kakaoMap.panTo(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    }
  }, [userLocation, isFollowing, kakaoMap]);

  /* '내 위치' 버튼 클릭 시 동작 */
  const handleMeButtonClick = () => {
    if (!userLocation) {
      toast("⚠ 설정에서 위치를 켜주신 후 다시 시도해 주세요.");
      return;
    }
    // 자동 추적 모드 활성화 + 지도 중심 이동
    setIsFollowing(true);
    kakaoMap.panTo(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
  };

  useEffect(() => {
    window.kakao.maps.event.addListener(kakaoMap, "dragstart", () => {
      setIsFollowing(false);
    });
    window.kakao.maps.event.addListener(kakaoMap, "zoom_changed", () => {
      setIsFollowing(false);
    });
  }, [kakaoMap]);

  useEffect(() => {
    // 길찾기 화면인 경우
    if (location.pathname === "/directions") {
      setIsLocationButtonFloat(true); // 항상 버튼이 float
      setIsFollowing(false); // 내 위치 추적 off
    }
  }, [location, setIsLocationButtonFloat]);

  return (
    <UserLocationControlContext.Provider
      value={{
        isFollowing,
        setIsFollowing,
        isLocationButtonFloat,
        setIsLocationButtonFloat,
      }}
    >
      {userLocation && <MyMarker myLocation={userLocation} />}
      <MeButton onClick={handleMeButtonClick} isFollowing={isFollowing} />
      {children}
    </UserLocationControlContext.Provider>
  );
};

export default UserLocationControl;
