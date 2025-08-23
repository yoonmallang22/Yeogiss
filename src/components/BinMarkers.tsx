import regularMarkerImage from '@/assets/regular-marker.svg';
import selectedMarkerImage from '@/assets/target-marker.svg';
import type { Bin } from '@/lib/api/bin';
import { useContext, useEffect } from 'react';
import { KakaoMapContext, MapMarker } from 'react-kakao-maps-sdk';

const IMAGE = {
  regular: {
    src: regularMarkerImage,
    size: { width: 16.5 * 1.5, height: 19.5 * 1.5 },
  },
  selected: {
    src: selectedMarkerImage,
    size: { width: 25 * 1.5, height: 29 * 1.5 },
  },
};

/**
 * 쓰레기통 마커들을 표시하는 컴포넌트
 * @param bins 표시할 쓰레기통 배열
 * @param moveToSelected 마커 선택 시 해당 위치로 지도를 이동할지 여부 (기본값: true)
 * @param selectedId 선택된 마커 ID
 * @param onBinClick 마커 클릭 시 호출되는 콜백 함수
 */
const BinMarkers = ({
  bins,
  moveToSelected = true,
  selectedId,
  onBinClick,
}: {
  bins: Bin[];
  moveToSelected?: boolean;
  selectedId?: number;
  onBinClick?: (bin: Bin) => void;
}) => {
  const kakaoMap = useContext(KakaoMapContext);

  // selectedId가 바뀔 때마다 해당 좌표로 지도 중심 이동
  useEffect(() => {
    // kakaoMap이 준비되지 않았거나, selectedId가 null이면 동작하지 않음
    if (!kakaoMap || selectedId === null) return;

    if (moveToSelected) {
      const selectedBin = bins.find((bin) => bin.binId === selectedId);
      if (!selectedBin) return;
      kakaoMap.setCenter(new kakao.maps.LatLng(selectedBin.lat, selectedBin.lng));
    }
  }, [selectedId, bins, kakaoMap, moveToSelected]);
  return (
    <>
      {bins &&
        bins.map((bin) => {
          return (
            <MapMarker
              key={bin.binId}
              position={{ lat: bin.lat, lng: bin.lng }}
              clickable={true}
              image={selectedId === bin.binId ? IMAGE.selected : IMAGE.regular}
              onClick={() => {
                if (onBinClick) onBinClick(bin);
              }}
            />
          );
        })}
    </>
  );
};

export default BinMarkers;
