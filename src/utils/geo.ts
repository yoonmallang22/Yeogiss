import type { LatLng } from "@/types/geolocation.type";

export const getCurrentPosition = (
  options?: PositionOptions,
): Promise<LatLng> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      options,
    );
  });
};

export const getDistance = (p1: LatLng, p2: LatLng) => {
  const R = 6371000; // m
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * 미터 단위를 km 단위로 변환 (소수점 1자리 반올림)
 */
export function metersToKilometers(meters: number) {
  const km = meters / 1000; // 미터 → km
  const rounded = Math.round(km * 10) / 10; // 소수점 1자리 반올림
  return rounded;
}
