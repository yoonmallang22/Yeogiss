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

export interface Routes {
  totalDistanceMeters: number;
  estimatedTimeSeconds: number;
  path: { lat: number; lng: number }[];
}

type GetRoutes = (params: GetRoutesParams) => Promise<ApiResponse<Routes>>;

export const fetchRoutes: GetRoutes = async (params: GetRoutesParams) => {
  const { data } = await axiosInstance.post(ENDPOINTS.GET_ROUTES, params, {
    withCredentials: true,
  });

  return data;
};

export interface PrivacyThirdPartyConsent {
  agreementId: number;
  revoked: boolean;
}

/**
 * 개인정보 제3자 제공동의 api
 */
export const getPrivacyThirdPartyConsent = async (): Promise<
  ApiResponse<PrivacyThirdPartyConsent>
> => {
  const { data } = await axiosInstance.post(
    ENDPOINTS.PRIVACY_THIRD_PARTY_CONSENT,
    {},
    {
      withCredentials: true,
    },
  );

  return data;
};
