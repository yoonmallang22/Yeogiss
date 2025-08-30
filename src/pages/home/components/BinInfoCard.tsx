import type { Bin } from "@/lib/api/bin";
import walkImage from "@/assets/bx_walk.png";
import recycleBinIcon from "@/assets/recycle-bin-icon.png";
import regularBinIcon from "@/assets/regular-bin-icon.png";
import type { LatLng } from "@/types/geolocation.type";
import { secondsToHMS } from "@/utils/time";
import { metersToKilometers } from "@/utils/geo";
import Button from "@/components/common/Button";

/**
 * 쓰레기통 마커 클릭시 하단에 정보를 보여주는 컴포넌트
 */
const BinInfoCard = ({
  info: { bin, arrivedSeconds, totalDistanceMeters },
  directionBtnClick,
}: {
  info: {
    bin: Bin;
    arrivedSeconds: number;
    totalDistanceMeters: number;
  };
  directionBtnClick?: (latlng: LatLng) => void;
}) => {
  if (bin && (!arrivedSeconds || !totalDistanceMeters)) return <Skeleton />;

  const [hour, minute, seconds] = secondsToHMS(arrivedSeconds);
  const totalDistance =
    totalDistanceMeters >= 1000
      ? `${metersToKilometers(totalDistanceMeters)}km`
      : `${totalDistanceMeters}m`;

  return (
    <div className="w-[97%] rounded-2xl shadow-md bg-white p-4 space-y-2 z-10 absolute bottom-8 left-1/2 -translate-x-1/2 min-w-xs max-w-4xl text-black">
      {/* 위치명 */}
      <p className="font-medium text-base truncate">
        {bin.detailAddress ? bin.detailAddress : "쓰레기통(정보 없음)"}
      </p>

      {/* 설치 위치 */}
      <div className="flex items-center gap-2 text-sm">
        {bin.type === "regular" ? (
          <img className="w-4 h-5" src={regularBinIcon} />
        ) : (
          <img className="w-5 h-5" src={recycleBinIcon} />
        )}
        <span>{bin.roadAddress}</span>
      </div>

      {/* 시간/거리 + 버튼 */}
      <div className="flex items-center justify-between mt-2">
        {/* 시간 & 거리 */}
        <div className="flex items-center gap-2">
          <img className="w-8 h-8" src={walkImage} />
          <div>
            <p className="font-semibold">
              {hour ? `${hour}시간 ` : ""}
              {minute ? `${minute}분 ` : ""}
              {hour <= 0 && seconds ? `${seconds}초` : ""} 후 도착
            </p>
            <p className="text-xs font-light">총 거리 {totalDistance}</p>
          </div>
        </div>

        {/* 버튼 */}
        <Button
          onClick={() => {
            if (directionBtnClick)
              directionBtnClick({ lat: bin.lat, lng: bin.lng });
          }}
        >
          길 안내
        </Button>
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="w-[97%] rounded-2xl shadow-md bg-white p-4 space-y-2 z-10 absolute bottom-8 left-1/2 -translate-x-1/2 min-w-xs max-w-4xl text-black animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-5 bg-gray-300 rounded w-full"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
    </div>
  );
};

export default BinInfoCard;
