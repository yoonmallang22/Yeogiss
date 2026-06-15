import { memo } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import type { LatLng } from "@/types/geolocation.type";
import myMarkerImage from "@/assets/my-marker.svg";

type MyMarkerProps = {
  myLocation: LatLng;
};

const MyMarkerComponent = ({ myLocation }: MyMarkerProps) => {
  return (
    <CustomOverlayMap position={myLocation}>
      <div className="relative">
        <div className="location-pulse" />
        <img
          src={myMarkerImage}
          alt="내 위치 마커"
          className="absolute left-1/2 top-1/2 w-[26px] h-[26px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </CustomOverlayMap>
  );
};

const MyMarker = memo(MyMarkerComponent);

export default MyMarker;
