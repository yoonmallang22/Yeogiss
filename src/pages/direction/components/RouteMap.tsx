import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapMarker, Polyline } from "react-kakao-maps-sdk";
import fetchRoutes from "@/lib/api/routes";
import type { LatLng } from "@/types/geolocation.type";
import startMarkerImage from "@/assets/start-marker.svg";
import endMarkerImage from "@/assets/end-marker.svg";

type RouteMapProps = {
  start: LatLng;
  end: LatLng;
};

const RouteMapComponent = ({ start, end }: RouteMapProps) => {
  const { data } = useQuery({
    queryKey: ["routes", start, end],
    queryFn: () =>
      fetchRoutes({
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
        startName: "startname",
        endName: "endname",
      }),
    staleTime: 1000 * 60 * 10, // 10분 동안 캐싱
  });

  const positions = [
    { position: start, image: startMarkerImage },
    { position: end, image: endMarkerImage },
  ];

  return (
    <>
      <Polyline
        path={data?.data?.path ?? []}
        strokeWeight={6}
        strokeColor={"#2AA9A8"}
        strokeOpacity={0.9}
        strokeStyle={"solid"}
      />
      {positions.map((v, i) => {
        return (
          <MapMarker
            key={i}
            position={v.position}
            image={{ src: v.image, size: { width: 32, height: 38 } }}
          />
        );
      })}
    </>
  );
};

const RouteMap = memo(RouteMapComponent);

export default RouteMap;
