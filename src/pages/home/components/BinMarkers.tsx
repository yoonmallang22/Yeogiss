import regularMarkerImage from "@/assets/regular-marker.svg";
import selectedRegularMarkerImage from "@/assets/target-marker.svg";
import recycleMarkerImage from "@/assets/recycle-marker.svg";
import selectedRecycleMarkerImage from "@/assets/target-marker-recycle.svg";
import type { Bin } from "@/lib/api/bin";
import { useContext, useLayoutEffect, useRef } from "react";
import {
  KakaoMapContext,
  MapMarker,
  MarkerClusterer,
} from "react-kakao-maps-sdk";

// 마커 이미지와 사이즈
const IMAGE = {
  regular: {
    src: regularMarkerImage,
    size: { width: 32, height: 34 },
  },
  regularSelected: {
    src: selectedRegularMarkerImage,
    size: { width: 44, height: 53 },
  },
  recycle: {
    src: recycleMarkerImage,
    size: { width: 32, height: 34 },
  },
  recycleSelected: {
    src: selectedRecycleMarkerImage,
    size: { width: 44, height: 53 },
  },
};

const iconMap = {
  GENERAL: {
    default: IMAGE.regular,
    selected: IMAGE.regularSelected,
  },

  RECYCLE: {
    default: IMAGE.recycle,
    selected: IMAGE.recycleSelected,
  },
};

const clearClusterer = (clusterer: kakao.maps.MarkerClusterer | null) => {
  if (!clusterer) return;

  clusterer.clear();
  clusterer.setMap(null);
};

type BinMarkersParam = {
  bins: Bin[];
  clusterKey: string;
  moveToSelected?: boolean;
  selectedId?: number;
  onBinClick?: (bin: Bin) => void;
};

/**
 * 쓰레기통 마커들을 표시하는 컴포넌트
 * @param bins 표시할 쓰레기통 배열
 * @param moveToSelected 마커 선택 시 해당 위치로 지도를 이동할지 여부 (기본값: true)
 * @param selectedId 선택된 마커 ID
 * @param clusterKey 필터링 옵션 등이 변경될 때 MarkerClusterer를 다시 생성하기 위한 키
 * @param onBinClick 마커 클릭 시 호출되는 콜백 함수
 */
const BinMarkers = (param: BinMarkersParam) => {
  const {
    bins,
    clusterKey,
    selectedId,
    onBinClick,
    moveToSelected = true,
  } = param;
  const kakaoMap = useContext(KakaoMapContext);
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);

  // 클러스터가 key를 사용한 umount 처리가 정상적으로 되지 않는 문제가 있음
  // react-kakao-maps-sdk 구현을 보면 MarkerClusterer unmount 시 기본 cleanup은 setMap(null)이고
  // 마커 제거는 하위 MapMarker cleanup에 맡겨집니다. 이 순서가 Kakao SDK 내부 상태와 맞지 않으면 cluster overlay가 일부 남을 수 있다고 합니다.
  // 그래서 cleanup을 활용해 기존 클러스터를 제거해주는 작업을 진행합니다.
  useLayoutEffect(() => {
    // 컴포넌트가 unmount되면 기존 클러스터 제거
    return () => {
      clearClusterer(clustererRef.current);
      clustererRef.current = null;
    };
  }, [clusterKey]);

  // 쓰레기통의 갯수가 0이면 기존 클러스터 제거
  useLayoutEffect(() => {
    if (bins.length > 0) return;

    clearClusterer(clustererRef.current);
    clustererRef.current = null;
  }, [bins.length]);

  if (bins.length === 0) return null;

  return (
    <MarkerClusterer
      key={clusterKey}
      averageCenter={true}
      minLevel={5}
      onCreate={(clusterer) => {
        clustererRef.current = clusterer;
      }}
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
            key={`${bin.binId}-${clusterKey}`}
            position={{ lat: bin.lat, lng: bin.lng }}
            clickable={true}
            image={
              iconMap[bin.type][
                selectedId === bin.binId ? "selected" : "default"
              ]
            }
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
