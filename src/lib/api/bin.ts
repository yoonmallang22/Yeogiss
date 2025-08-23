import ENDPOINTS from '@/constants/api';
import axiosInstance from '@/lib/axiosInstance';

export interface Bin {
  binId: number;
  lat: number;
  lng: number;
  road_address: string;
  detail_address: string;
  distanceMeters: number;
  type: 'regular' | 'recycle';
}

export type GetNearByBins = (lat: number, lng: number, radiusMeters?: number) => Promise<Bin[]>;

export const MOCK_DATA: Bin[] = [
  {
    binId: 1,
    lat: 37.551234,
    lng: 126.987654,
    road_address: '서울특별시 중구 101번길',
    detail_address: '중구 상세 주소 1번지, 테스트용 텍스트',
    distanceMeters: 150,
    type: 'regular',
  },
  {
    binId: 2,
    lat: 37.654321,
    lng: 127.045678,
    road_address: '서울특별시 노원구 102번길',
    detail_address: '노원구 상세 주소 2번지, 테스트용 텍스트',
    distanceMeters: 320,
    type: 'recycle',
  },
  {
    binId: 3,
    lat: 37.579123,
    lng: 126.936543,
    road_address: '서울특별시 서대문구 103번길',
    detail_address: '서대문구 상세 주소 3번지, 테스트용 텍스트',
    distanceMeters: 480,
    type: 'regular',
  },
  {
    binId: 4,
    lat: 37.517234,
    lng: 127.047123,
    road_address: '서울특별시 강남구 104번길',
    detail_address: '강남구 상세 주소 4번지, 테스트용 텍스트',
    distanceMeters: 210,
    type: 'recycle',
  },
  {
    binId: 5,
    lat: 37.514321,
    lng: 127.105234,
    road_address: '서울특별시 송파구 105번길',
    detail_address: '송파구 상세 주소 5번지, 테스트용 텍스트',
    distanceMeters: 365,
    type: 'regular',
  },
  {
    binId: 6,
    lat: 37.526432,
    lng: 126.895432,
    road_address: '서울특별시 영등포구 106번길',
    detail_address: '영등포구 상세 주소 6번지, 테스트용 텍스트',
    distanceMeters: 290,
    type: 'recycle',
  },
  {
    binId: 7,
    lat: 37.551987,
    lng: 126.849123,
    road_address: '서울특별시 강서구 107번길',
    detail_address: '강서구 상세 주소 7번지, 테스트용 텍스트',
    distanceMeters: 450,
    type: 'regular',
  },
  {
    binId: 8,
    lat: 37.566123,
    lng: 126.901234,
    road_address: '서울특별시 마포구 108번길',
    detail_address: '마포구 상세 주소 8번지, 테스트용 텍스트',
    distanceMeters: 120,
    type: 'recycle',
  },
  {
    binId: 9,
    lat: 37.478543,
    lng: 126.951234,
    road_address: '서울특별시 관악구 109번길',
    detail_address: '관악구 상세 주소 9번지, 테스트용 텍스트',
    distanceMeters: 380,
    type: 'regular',
  },
  {
    binId: 10,
    lat: 37.574123,
    lng: 127.039123,
    road_address: '서울특별시 동대문구 110번길',
    detail_address: '동대문구 상세 주소 10번지, 테스트용 텍스트',
    distanceMeters: 530,
    type: 'recycle',
  },
];
/**
 * 위도/경도 기준 radiusMeters 거리 내의 쓰레기통 리스트를 가져오는 함수
 */
export const getNearbyBins: GetNearByBins = async (lat, lng, radiusMeters) => {
  if (import.meta.env.VITE_MOCK_FLAG) {
    return MOCK_DATA;
  }
  const response = await axiosInstance.get(ENDPOINTS.GET_BINS, {
    params: { currentLat: lat, currentLng: lng, radiusMeters },
  });

  return response.data;
};
