import { useState, useEffect, useCallback, useContext } from "react";
import { KakaoMapContext, Map as KakaoMap } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_POSITION } from "@/constants/geo";
import MeButton from "@/pages/home/components/MeButton";
import MyMarker from "@/pages/home/components/MyMarker";

const Home = () => {
  useKakaoLoader();
  const userLocation = useUserLocation();

  return (
    <KakaoMap
      center={userLocation ?? DEFAULT_POSITION}
      className="w-full h-screen"
      level={3}
      isPanto={true}
    >
      <MapCore />
    </KakaoMap>
  );
};

const MapCore = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const kakaoMap = useContext(KakaoMapContext);
  const userLocation = useUserLocation();

  /* 위치 권한 상태 변경 처리 */
  const handlePermissionChange = useCallback((status: PermissionStatus) => {
    if (status.state === "granted") {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, []);

  /* 위치 권한 확인 */
  useEffect(() => {
    if (!navigator.permissions) return;

    let permissionStatus: PermissionStatus | null = null;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      permissionStatus = status;

      // 초기 상태 반영
      handlePermissionChange(status);

      // 권한 변경 이벤트 등록
      status.onchange = () => handlePermissionChange(status);
    });

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null; // cleanup
      }
    };
  }, [handlePermissionChange]);

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

  return (
    <>
      {userLocation && <MyMarker myLocation={userLocation} />}
      <MeButton onClick={handleMeButtonClick} isFollowing={isFollowing} />
    </>
  );
};

export default Home;
