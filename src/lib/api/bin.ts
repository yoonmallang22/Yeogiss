import ENDPOINTS from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api.type";

export interface Bin {
  binId: number;
  lat: number;
  lng: number;
  roadAddress: string;
  detailAddress: string;
  distanceMeters: number;
  type: "GENERAL" | "RECYCLE";
}

export type GetNearByBins = (
  lat: number,
  lng: number,
  radiusMeters?: number,
) => Promise<ApiResponse<Bin[]>>;

/**
 * 위도/경도 기준 radiusMeters 거리 내의 쓰레기통 리스트를 가져오는 함수
 */
export const getNearbyBins: GetNearByBins = async (lat, lng, radiusMeters) => {
  const response = await axiosInstance.get(ENDPOINTS.GET_BINS, {
    params: { currentLat: lat, currentLng: lng, radiusMeters },
  });

  return response.data;
};

export type GetBinById = ({
  binId,
  currentLat,
  currentLng,
}: {
  binId: number;
  currentLat: number;
  currentLng: number;
}) => Promise<ApiResponse<Bin>>;

/**
 * 쓰레기통 ID로 쓰레기통 정보를 가져오는 함수
 */
export const getBinById: GetBinById = async ({
  binId,
  currentLat,
  currentLng,
}) => {
  console.log(ENDPOINTS.GET_BIN({ binId, currentLat, currentLng }));
  const response = await axiosInstance.get(
    ENDPOINTS.GET_BIN({ binId, currentLat, currentLng }),
  );
  return response.data;
};
