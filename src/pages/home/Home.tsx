import { useState, useEffect, useContext } from "react";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_POSITION } from "@/constants/geo";
import type { Bin } from "@/lib/api/bin";
import useNearbyBins from "@/hooks/useNearbyBins";
import LoadBinsButton from "@/pages/home/components/LoadBinsButton";
import BinMarkers from "@/pages/home/components/BinMarkers";
import BinInfoCard from "@/pages/home/components/BinInfoCard";
import { useNavigate } from "react-router-dom";
import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { KakaoMapContext } from "react-kakao-maps-sdk";
import fetchRoutes, { type GetRoutesParams } from "@/lib/api/routes";

const Home = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [routesData, setRoutesData] = useState<{
    estimatedTimeSeconds: number;
    totalDistanceMeters: number;
  }>({ estimatedTimeSeconds: 0, totalDistanceMeters: 0 });

  const kakaoMap = useContext(KakaoMapContext);
  const userLocation = useUserLocation();
  const navigate = useNavigate();
  const { setIsLocationButtonFloat, setIsFollowing } = useContext(
    UserLocationControlContext,
  );

  const { data: binsData } = useNearbyBins(
    userLocation
      ? [userLocation.lat, userLocation.lng]
      : [DEFAULT_POSITION.lat, DEFAULT_POSITION.lng],
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (binsData) {
      setBins(binsData);
    }
  }, [binsData]);

  useEffect(() => {
    if (selectedBin) {
      setIsLocationButtonFloat(true);
    } else {
      setIsLocationButtonFloat(false);
    }
  }, [selectedBin, setIsLocationButtonFloat]);

  useEffect(() => {
    window.kakao.maps.event.addListener(kakaoMap, "click", clearBinStates);
  }, [kakaoMap]);

  // 쓰레기통 관련 상태를 초기화
  const clearBinStates = () => {
    setSelectedBin(null);
    setRoutesData({ estimatedTimeSeconds: 0, totalDistanceMeters: 0 });
  };

  // 유저가 위치 권한 거부한 경우 렌더링 X
  if (!userLocation) return null;

  return (
    <>
      {/* 현재 위치에서 쓰레기통 찾기 버튼 */}
      <LoadBinsButton onLoaded={(bins) => setBins(bins)} />

      <BinMarkers
        bins={bins}
        onBinClick={(bin) => {
          clearBinStates();
          setSelectedBin(bin);
          setIsFollowing(false);
          if (userLocation) {
            const params: GetRoutesParams = {
              startLat: userLocation.lat,
              startLng: userLocation.lng,
              endLat: bin.lat,
              endLng: bin.lng,
              startName: "start",
              endName: "end",
            };
            fetchRoutes(params).then((response) => {
              const { estimatedTimeSeconds, totalDistanceMeters } =
                response.data;
              setRoutesData({ estimatedTimeSeconds, totalDistanceMeters });
            });
          }
        }}
        selectedId={selectedBin?.binId}
      />

      {/* 선택된 쓰레기통이 있으면 정보 카드 컴포넌트 렌더링 */}
      {selectedBin && (
        <BinInfoCard
          info={{
            bin: selectedBin,
            arrivedSeconds: routesData.estimatedTimeSeconds,
            totalDistanceMeters: routesData.totalDistanceMeters,
          }}
          showDirectionBtn={true}
          directionBtnClick={() => {
            navigate("/directions", {
              state: {
                userLocation,
                selectedBin,
                arrivedSeconds: routesData.estimatedTimeSeconds,
                totalDistanceMeters: routesData.totalDistanceMeters,
              },
            });
          }}
        />
      )}
    </>
  );
};

export default Home;
