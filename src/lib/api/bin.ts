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
  type: "regular" | "recycle";
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
