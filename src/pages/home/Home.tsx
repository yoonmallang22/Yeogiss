import { useState, useEffect, useContext } from "react";
import { getBinById, getNearbyBins, type Bin } from "@/lib/api/bin";
import LoadBinsButton from "@/pages/home/components/LoadBinsButton";
import BinMarkers from "@/pages/home/components/BinMarkers";
import BinInfoCard from "@/pages/home/components/BinInfoCard";
import { useNavigate } from "react-router-dom";
import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { KakaoMapContext } from "react-kakao-maps-sdk";
import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";
import { toast } from "react-toastify";

const DIRECTION_MAX_DISTANCE_METERS = 500;

const Home = () => {
  // 최초 로드 여부
  const [loaded, setLoaded] = useState(false);
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const kakaoMap = useContext(KakaoMapContext);
  const navigate = useNavigate();

  const { setIsFollowing, userLocation } = useContext(
    UserLocationControlContext,
  );

  useEffect(() => {
    // 초기 로드 (마운트 시 1회만 실행)
    if (!kakaoMap || !userLocation || loaded) return;

    getNearbyBins(userLocation.lat, userLocation.lng).then((response) => {
      if (response.data.length) {
        setBins(response.data);
      }
      setLoaded(true);
    });
  }, [userLocation, loaded, kakaoMap]);

  // 선택된 쓰레기통이 길찾기 가능한 거리 내에 없으면 토스트 메시지 처리
  useEffect(() => {
    if (
      toast.isActive("direction-unavailable") === false &&
      selectedBin &&
      selectedBin.distanceMeters > DIRECTION_MAX_DISTANCE_METERS
    ) {
      toast("⚠ 가까운 위치(500m 이내)에서만 길 안내가 제공돼요.", {
        toastId: "direction-unavailable",
      });
    }
  }, [selectedBin]);

  // 지도 클릭시 선택된 쓰레기통 초기화
  useEffect(() => {
    window.kakao.maps.event.addListener(kakaoMap, "click", clearBinStates);

    return () => {
      window.kakao.maps.event.removeListener(kakaoMap, "click", clearBinStates);
    };
  }, [kakaoMap]);

  // 쓰레기통 관련 상태를 초기화
  const clearBinStates = () => {
    setSelectedBin(null);
  };

  // 접속시 서울에서 벗어나면 토스트 메시지 처리
  useEffect(() => {
    if (userLocation) {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(
        userLocation.lng,
        userLocation.lat,
        (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const region = result[0].region_1depth_name;
            if (region !== "서울특별시") {
              toast("⚠ 현재는 서울시 쓰레기통 위치 정보만 지원돼요.");
            }
          }
        },
      );
    }
  }, [userLocation]);

  // 유저가 위치 권한 거부한 경우 렌더링 X
  if (!userLocation) return null;

  return (
    <>
      {/* 현재 위치에서 쓰레기통 찾기 버튼 */}
      <LoadBinsButton
        onLoaded={(bins) => {
          setBins(bins);
        }}
      />
      <BinMarkers
        bins={bins}
        onBinClick={(bin) => {
          trackEvent("TRASH_BIN_MARKER_CLICKED", {
            method: "click",
            marker_id: selectedBin?.binId,
            marker_type: selectedBin?.type,
            screen_name: getScreenName(location.pathname),
          });

          if (!userLocation) return;
          clearBinStates();
          setIsFollowing(false);

          getBinById({
            binId: bin.binId,
            currentLat: userLocation.lat,
            currentLng: userLocation.lng,
          }).then((response) => {
            setSelectedBin(response.data);
          });
        }}
        selectedId={selectedBin?.binId}
      />

      {/* 선택된 쓰레기통이 있으면 정보 카드 컴포넌트 렌더링 */}
      {selectedBin && (
        <BinInfoCard
          info={{
            bin: selectedBin,
            totalDistanceMeters: selectedBin.distanceMeters,
          }}
          isDirectionAvailable={
            selectedBin.distanceMeters <= DIRECTION_MAX_DISTANCE_METERS
          }
          onClose={clearBinStates}
          directionBtnClick={() => {
            navigate("/directions", {
              state: { userLocation, selectedBin },
            });

            trackEvent("ROUTE_SEARCH_INITIATED", {
              method: "click",
              start_point: JSON.stringify(userLocation),
              end_point: JSON.stringify({
                lat: selectedBin.lat,
                lng: selectedBin.lng,
              }),
            });
          }}
        />
      )}
    </>
  );
};

export default Home;
