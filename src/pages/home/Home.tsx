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
import useFirstLocationGrantedEffect from "@/hooks/useFirstLocationGrantedEffect";
import useGeoPermission from "@/hooks/useGeoPermission";

const DIRECTION_MAX_DISTANCE_METERS = 500;

const Home = () => {
  // 최초 쓰레기통의 로드 여부
  const [loaded, setLoaded] = useState(false);
  // 쓰레기통 데이터
  const [bins, setBins] = useState<Bin[]>([]);
  // 화면에 선택된 쓰레기통 상태
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const permission = useGeoPermission();
  const kakaoMap = useContext(KakaoMapContext);
  const navigate = useNavigate();

  const { setIsFollowing, userLocation } = useContext(
    UserLocationControlContext,
  );

  // 접속시 서울에서 벗어나면 토스트 메시지 처리
  useFirstLocationGrantedEffect(permission, () => {
    if (userLocation === null) return;

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
  });

  // 초기에 사용자 주변의 쓰레기통 정보를 불러오기 위해 loaded 상태를 사용, 1회만 실행한다.
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
          // 현재 사용자 위치를 기준으로 쓰레기통 정보를 보여주어야 하므로, 초기 조회한 쓰레기통 데이터의 거리 정보를 0으로 세팅
          const tempBin: Bin = { ...bin, distanceMeters: 0 };
          setSelectedBin(tempBin);
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
