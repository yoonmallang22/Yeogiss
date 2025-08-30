import { useLocation } from "react-router-dom";
import RouteMap from "@/pages/direction/components/RouteMap";
import BinInfoCard from "@/pages/home/components/BinInfoCard";

const Direction = () => {
  const location = useLocation();
  const { userLocation, selectedBin, arrivedSeconds, totalDistanceMeters } =
    location.state || {};

  const destination = { lat: selectedBin.lat, lng: selectedBin.lng };

  return (
    <>
      {userLocation && <RouteMap start={userLocation} end={destination} />}
      <BinInfoCard
        info={{
          bin: selectedBin,
          arrivedSeconds: 1,
          totalDistanceMeters: 1,
        }}
      />
    </>
  );
};

export default Direction;
