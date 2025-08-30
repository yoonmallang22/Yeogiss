import { useState, useEffect } from "react";
import useUserLocation from "@/hooks/useUserLocation";
import { DEFAULT_POSITION } from "@/constants/geo";
import type { Bin } from "@/lib/api/bin";
import useNearbyBins from "@/hooks/useNearbyBins";
import LoadBinsButton from "@/pages/home/components/LoadBinsButton";
import BinMarkers from "@/pages/home/components/BinMarkers";
import BinInfoCard from "@/pages/home/components/BinInfoCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [binsMap, setBinsMap] = useState<Map<number, Bin>>(new Map());
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);

  const userLocation = useUserLocation();
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
              state: {
                userLocation,
                selectedBin,
                arrivedSeconds: 0,
                totalDistanceMeters: 0,
              }, // TODO: api..
            });
          }}
        />
      )}
    </>
  );
};

export default Home;
