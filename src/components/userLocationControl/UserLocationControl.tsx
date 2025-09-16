import { useState, useEffect, useContext, type ReactNode } from "react";
import { KakaoMapContext } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import MyMarker from "@/components/userLocationControl/MyMarker";
import MeButton from "@/components/userLocationControl/MeButton";
import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { useLocation } from "react-router-dom";
import type { LatLng } from "@/types/geolocation.type";
import useMapTracking from "@/hooks/useMapTracking";

// 위치권한 있을때만 보여지는 컴포넌트
const UserLocationControl = ({
  userLocation,
  children,
}: {
  userLocation?: LatLng;
  children?: ReactNode;
}) => {
  // home 진입시 자동 추적 on
  const [isFollowing, setIsFollowing] = useState(true);
  const [isLocationButtonFloat, setLocationButtonFloat] = useState(false);
  // 하단으로부터 MeButton을 몇 px 띄울지
  const [float, setFloat] = useState(0);
  const location = useLocation();
  const kakaoMap = useContext(KakaoMapContext);

  useMapTracking(kakaoMap, {
    onFollowingEnd: () => setIsFollowing(false), // 🔹 여기서 자동추적 off
  });

  /* 자동 추적 모드일 때만 사용자 위치로 중심 좌표 갱신 */
  useEffect(() => {
    if (!isFollowing || !userLocation) return;

    kakaoMap.panTo(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
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
    // 길찾기 화면인 경우
    if (location.pathname === "/directions") {
      setLocationButtonFloat(true); // 항상 버튼이 float
      setIsFollowing(false); // 내 위치 추적 off
    }
  }, [location, setLocationButtonFloat]);

  // 내 위치 버튼을 띄우는 함수
  const floatMeButton = (bottom: number) => {
    setLocationButtonFloat(true);
    setFloat(bottom);
  };

  // 내 위치 버튼을 원래 위치로 옮기는 함수
  const unfloatMeButton = () => {
    setLocationButtonFloat(false);
    setFloat(0);
  };

  // 위치권한이 없으면 내 위치 버튼만 렌더링한다.
  if (!userLocation) return <MeButton onClick={handleMeButtonClick} isFollowing={false} />;

  return (
    <UserLocationControlContext.Provider
      value={{
        userLocation,
        isFollowing,
        setIsFollowing,
        float,
        isLocationButtonFloat,
        floatMeButton,
        unfloatMeButton,
      }}
    >
      {userLocation && <MyMarker myLocation={userLocation} />}
      <MeButton onClick={handleMeButtonClick} isFollowing={isFollowing} />
      {children}
    </UserLocationControlContext.Provider>
  );
};

export default UserLocationControl;
