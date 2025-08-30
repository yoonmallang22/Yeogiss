import { useState, useEffect, useContext } from "react";
import { KakaoMapContext, Map as KakaoMap } from "react-kakao-maps-sdk";
import { toast } from "react-toastify";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_POSITION } from "@/constants/geo";
import MeButton from "@/pages/home/components/MeButton";
import MyMarker from "@/pages/home/components/MyMarker";
import useGeoPermission from "@/hooks/useGeoPermission";
import type { Bin } from "@/lib/api/bin";
import useNearbyBins from "@/hooks/useNearbyBins";
import LoadBinsButton from "@/pages/home/components/LoadBinsButton";
import BinMarkers from "@/pages/home/components/BinMarkers";
import BinInfoCard from "@/pages/home/components/BinInfoCard";
import { useNavigate } from "react-router-dom";

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
  const [binsMap, setBinsMap] = useState<Map<number, Bin>>(new Map());
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const kakaoMap = useContext(KakaoMapContext);
  const userLocation = useUserLocation();
  const permission = useGeoPermission();
  const navigate = useNavigate();

  const { data: bins } = useNearbyBins(
    userLocation
      ? [userLocation.lat, userLocation.lng]
      : [DEFAULT_POSITION.lat, DEFAULT_POSITION.lng],
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (bins) {
      addBinData(bins);
    }
  }, [bins]);

  /* 권한 상태 변화 시 자동 추적 모드 제어 */
  useEffect(() => {
    setIsFollowing(permission === "granted");
  }, [permission]);

  /* 자동 추적 모드일 때만 사용자 위치로 중심 좌표 갱신 */
  useEffect(() => {
    if (userLocation && isFollowing) {
      kakaoMap.panTo(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    }
  }, [userLocation, isFollowing, kakaoMap]);

  useEffect(() => {
    window.kakao.maps.event.addListener(kakaoMap, "dragstart", () => {
      setIsFollowing(false);
    });
    window.kakao.maps.event.addListener(kakaoMap, "zoom_changed", () => {
      setIsFollowing(false);
    });
  }, [kakaoMap]);

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

  // 쓰레기통 데이터를 추가하는 함수, 중복 데이터인 경우 업데이트 하지 않는다.
  function addBinData(newBins: Bin[]) {
    setBinsMap((prev) => {
      const copy = new Map(prev);
      newBins.forEach((bin) => {
        if (!copy.has(bin.binId)) {
          copy.set(bin.binId, bin);
        }
      });
      return copy;
    });
  }

  return (
    <>
      {userLocation && <MyMarker myLocation={userLocation} />}
      <MeButton onClick={handleMeButtonClick} isFollowing={isFollowing} />
      {/* 현재 위치에서 쓰레기통 찾기 버튼 */}
      <LoadBinsButton onLoaded={(bins) => addBinData(bins)} />

      <BinMarkers
        bins={Array.from(binsMap.values())}
        onBinClick={(bin) => setSelectedBin(bin)}
        selectedId={selectedBin?.binId}
      />

      {/* 선택된 쓰레기통이 있으면 정보 카드 컴포넌트 렌더링 */}
      {selectedBin && (
        <BinInfoCard
          info={{
            bin: selectedBin,
            arrivedSeconds: 1, // TODO: api 응답값 수정 필요
            totalDistanceMeters: 1, // TODO: api..
          }}
          showDirectionBtn={true}
          directionBtnClick={(latlng) => {
            navigate(`/directions?lat=${latlng.lat}&lng=${latlng.lng}`, {
              state: { selectedBin, arrivedSeconds: 0, totalDistanceMeters: 0 }, // TODO: api..
            });
          }}
        />
      )}
    </>
  );
};

export default Home;
