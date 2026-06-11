import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDistance } from "@/utils/geo";
import RouteMap from "@/pages/direction/components/RouteMap";
import BinInfoCard from "@/pages/home/components/BinInfoCard";
import BottomCardWithMeBtnFloat from "@/components/BottomCardWithMeBtnFloat";
import { trackEvent } from "@/lib/trackEvent";
import PATH from "@/constants/path";
import useUserLocation from "@/hooks/useUserLocation";

const ARRIVAL_THRESHOLD = 20;

const Direction = () => {
  const [arrived, setArrived] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserLocation = useUserLocation();

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
  const {
    userLocation = null,
    selectedBin = null,
    routes = null,
  } = location.state ?? savedState ?? {};

  useEffect(() => {
    if (location.state) {
      localStorage.setItem(
        "directionState",
        JSON.stringify({ userLocation, selectedBin, routes }),
      );
    }
  }, [location.state, selectedBin, userLocation, routes]);

  const destination = useMemo(
    () => ({ lat: selectedBin.lat, lng: selectedBin.lng }),
    [selectedBin],
  );

  const {
    estimatedTimeSeconds = 0,
    totalDistanceMeters = 0,
    path = [],
  } = routes ?? {};

  useEffect(() => {
    if (!currentUserLocation || !destination) return;

    const arrivalDistance = getDistance(currentUserLocation, destination);

    if (arrivalDistance < ARRIVAL_THRESHOLD && !arrived) {
      setArrived(true);
    }
  }, [currentUserLocation, destination, arrived]);

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
