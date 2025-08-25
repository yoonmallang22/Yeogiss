import { memo } from "react";
import { MapMarker } from "react-kakao-maps-sdk";
import type { LatLng } from "@/types/geolocation.type";
import myMarkerImage from "@/assets/my-marker.svg";

type MyMarkerProps = {
  myLocaiton: LatLng;
};

const MyMarkerComponent = ({ myLocaiton }: MyMarkerProps) => {
  return (
    <MapMarker
      position={myLocaiton}
      image={{ src: myMarkerImage, size: { width: 26, height: 26 } }}
    />
  );
};

const MyMarker = memo(MyMarkerComponent);

export default MyMarker;
