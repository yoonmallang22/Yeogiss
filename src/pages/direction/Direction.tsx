import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import fetchRoutes from "@/lib/api/routes";
import { getDistance } from "@/utils/geo";
import RouteMap from "@/pages/direction/components/RouteMap";
import BinInfoCard from "@/pages/home/components/BinInfoCard";
import BottomCardWithMeBtnFloat from "@/components/BottomCardWithMeBtnFloat";
import { trackEvent } from "@/lib/trackEvent";
import PATH from "@/constants/path";

const ARRIVAL_THRESHOLD = 20;

const Direction = () => {
  const [arrived, setArrived] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 로컬스토리지 안전 파싱 (초기 한 번만)
  const savedState = useMemo(() => {
    try {
      const raw = localStorage.getItem("directionState");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("directionState parse error:", e);
      return null;
    }
  }, []);

  // location.state 우선, 없으면 savedState, 없으면 기본값
  const { userLocation = null, selectedBin = null } =
    location.state ?? savedState ?? {};

  useEffect(() => {
    if (location.state) {
      localStorage.setItem(
        "directionState",
        JSON.stringify({ userLocation, selectedBin }),
      );
    }
  }, [location.state, selectedBin, userLocation]);

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

  if (arrived) {
    trackEvent("ROUTE_SEARCH_COMPLETED", {
      event: "arrival",
      route_distance: totalDistanceMeters,
      route_duration: estimatedTimeSeconds,
    });
  }

  return (
    <>
      {userLocation && (
        <RouteMap start={userLocation} end={destination} path={path} />
      )}
      {!arrived ? (
        <BinInfoCard
          info={{
            bin: { ...selectedBin, distanceMeters: totalDistanceMeters },
            arrivedSeconds: estimatedTimeSeconds,
          }}
          onClose={() => {
            navigate(PATH.HOME);

            trackEvent("ROUTE_SEARCH_COMPLETED", {
              event: "cancel",
              route_distance: totalDistanceMeters,
              route_duration: estimatedTimeSeconds,
            });
          }}
        />
      ) : (
        <BottomCardWithMeBtnFloat
          onClose={() => {
            navigate(PATH.HOME);
          }}
          className="flex flex-col items-center justify-center"
        >
          <span>목적지에 도착했어요!</span>
          <span>안내를 종료할게요.</span>
        </BottomCardWithMeBtnFloat>
      )}
    </>
  );
};

export default Direction;
