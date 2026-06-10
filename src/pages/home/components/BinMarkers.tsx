import regularMarkerImage from "@/assets/regular-marker.svg";
import selectedMarkerImage from "@/assets/target-marker.svg";
import type { Bin } from "@/lib/api/bin";
import { useContext } from "react";
import {
  KakaoMapContext,
  MapMarker,
  MarkerClusterer,
} from "react-kakao-maps-sdk";

// 마커 이미지, 기존 이미지 사이즈의 1.5배
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
 * @param id 필터링 옵션 등이 변경될 때 리렌더를 위해 엘리먼트에 전달할 키
 * @param onBinClick 마커 클릭 시 호출되는 콜백 함수
 */
const BinMarkers = ({
  bins,
  id,
  moveToSelected = true,
  selectedId,
  onBinClick,
}: {
  bins: Bin[];
  id: string;
  moveToSelected?: boolean;
  selectedId?: number;
  onBinClick?: (bin: Bin) => void;
}) => {
  const kakaoMap = useContext(KakaoMapContext);

  if (bins.length === 0) return null;

  return (
    <MarkerClusterer
      key={id}
      averageCenter={true}
      minLevel={5}
      styles={[
        {
          width: "40px",
          height: "40px",
          background: "linear-gradient(to right, #A72FE7, #8225B4F2, #5D1A81)",
          border: "1px solid #fff",
          borderRadius: "50%",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "14px",
          fontWeight: "700",
        },
      ]}
    >
      {bins.map((bin) => {
        return (
          <MapMarker
            key={`${bin.binId}-${id}`}
            position={{ lat: bin.lat, lng: bin.lng }}
            clickable={true}
            image={selectedId === bin.binId ? IMAGE.selected : IMAGE.regular}
            onClick={() => {
              if (onBinClick) {
                onBinClick(bin);
              }
              if (moveToSelected) {
                kakaoMap.panTo(new kakao.maps.LatLng(bin.lat, bin.lng));
              }
            }}
          />
        );
      })}
    </MarkerClusterer>
  );
};

export default BinMarkers;
