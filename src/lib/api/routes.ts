import ENDPOINTS from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api.type";

export interface GetRoutesParams {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  startName: string;
  endName: string;
}

interface Routes {
  totalDistanceMeters: number;
  estimatedTimeSeconds: number;
  path: { lat: number; lng: number }[];
}

type GetRoutes = (params: GetRoutesParams) => Promise<ApiResponse<Routes>>;

const fetchRoutes: GetRoutes = async (params: GetRoutesParams) => {
  const { data } = await axiosInstance.post(ENDPOINTS.GET_ROUTES, params);

  return data;
};

export default fetchRoutes;
