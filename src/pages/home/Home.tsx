import { useState, useEffect, useRef, useCallback } from "react";
import { Map } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_POSITION } from "@/constants/geo";
import MeButton from "@/pages/home/components/MeButton";
import MyMarker from "@/pages/home/components/MyMarker";

const Home = () => {
  useKakaoLoader();

  const [isFollowing, setIsFollowing] = useState(false);
  const [center, setCenter] = useState(DEFAULT_POSITION);
  const userLocation = useUserLocation();
  const mapRef = useRef<kakao.maps.Map | null>(null);

  /* 지도 중심 이동 헬퍼 */
  const moveMapCenter = useCallback((lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setCenter(new kakao.maps.LatLng(lat, lng));
    }
  }, []);

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
      setCenter(userLocation);
      moveMapCenter(userLocation.lat, userLocation.lng);
    }
  }, [userLocation, isFollowing, moveMapCenter]);

  /* '내 위치' 버튼 클릭 시 동작 */
  const handleMeButtonClick = () => {
    if (!userLocation) {
      toast("⚠ 설정에서 위치를 켜주신 후 다시 시도해 주세요.");
      return;
    }
    // 자동 추적 모드 활성화 + 지도 중심 이동
    setIsFollowing(true);
    moveMapCenter(userLocation.lat, userLocation.lng);
  };

  /* 지도 드래그 or 줌 시 자동 추적 해제 + 중심 좌표 저장 */
  const handleDragOrZoom = () => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      setCenter({ lat: currentCenter.getLat(), lng: currentCenter.getLng() });
    }
    setIsFollowing(false);
  };

  return (
    <div className="w-full h-screen">
      <Map
        center={center}
        className="w-full h-full"
        level={3}
        ref={mapRef}
        onDragStart={handleDragOrZoom}
        onZoomChanged={handleDragOrZoom}
      >
        {userLocation && <MyMarker myLocation={userLocation} />}
      </Map>

      <MeButton onClick={handleMeButtonClick} isFollowing={isFollowing} />
    </div>
  );
};

export default Home;
