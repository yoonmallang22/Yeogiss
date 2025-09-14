import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import fetchRoutes from "@/lib/api/routes";
import { getDistance } from "@/utils/geo";
import RouteMap from "@/pages/direction/components/RouteMap";
import BinInfoCard from "@/pages/home/components/BinInfoCard";
import BottomCardWithMeBtnFloat from "@/components/BottomCardWithMeBtnFloat";

const ARRIVAL_THRESHOLD = 5;

const Direction = () => {
  const [arrived, setArrived] = useState(false);

  const location = useLocation();
  const { userLocation, selectedBin } = location.state || {};
  const navigate = useNavigate();

  const destination = useMemo(
    () => ({ lat: selectedBin.lat, lng: selectedBin.lng }),
    [selectedBin],
  );

  const { data } = useQuery({
    queryKey: ["routes", userLocation, destination],
    queryFn: () =>
      fetchRoutes({
        startLat: userLocation.lat,
        startLng: userLocation.lng,
        endLat: destination.lat,
        endLng: destination.lng,
        startName: "startname",
        endName: "endname",
      }),
    staleTime: 1000 * 60 * 10, // 10분 동안 캐싱
  });

  const {
    estimatedTimeSeconds = 0,
    totalDistanceMeters = 0,
    path = [],
  } = data?.data ?? {};

  useEffect(() => {
    if (!userLocation || !destination) return;

    const arrivalDistance = getDistance(userLocation, destination);

    if (arrivalDistance < ARRIVAL_THRESHOLD && !arrived) {
      setArrived(true);
    }
  }, [userLocation, destination, arrived]);

  return (
    <>
      {userLocation && (
        <RouteMap start={userLocation} end={destination} path={path} />
      )}
      {!arrived ? (
        <BinInfoCard
          info={{
            bin: selectedBin,
            arrivedSeconds: estimatedTimeSeconds,
            totalDistanceMeters: totalDistanceMeters,
          }}
          onClose={() => {
            navigate("/");
          }}
        />
      ) : (
        <BottomCardWithMeBtnFloat
          onClose={() => {
            navigate("/");
          }}
          className="py-6 flex flex-col items-center justify-center "
        >
          <span>목적지에 도착했어요!</span>
          <span>안내를 종료할게요.</span>
        </BottomCardWithMeBtnFloat>
      )}
    </>
  );
};

export default Direction;
