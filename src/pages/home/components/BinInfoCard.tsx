import type { Bin } from "@/lib/api/bin";
import walkImage from "@/assets/bx_walk.svg";
import recycleBinIcon from "@/assets/recycle-icon.svg";
import regularBinIcon from "@/assets/regular-icon.svg";
import type { LatLng } from "@/types/geolocation.type";
import { secondsToHMS } from "@/utils/time";
import { metersToKilometers } from "@/utils/geo";
import Button from "@/components/common/Button/Button";
import BottomCardWithMeBtnFloat from "@/components/BottomCardWithMeBtnFloat";

/**
 * 쓰레기통 마커 클릭시 하단에 정보를 보여주는 컴포넌트
 */
const BinInfoCard = ({
  info: { bin, arrivedSeconds },
  loading,
  isDirectionAvailable = true,
  directionBtnClick,
  onClose,
}: {
  info: {
    bin: Bin;
    arrivedSeconds?: number;
  };
  loading?: boolean;
  isDirectionAvailable?: boolean;
  showDirectionBtn?: boolean;
  directionBtnClick?: (latlng: LatLng) => void;
  onClose?: () => void;
}) => {
  if (loading) return <Skeleton />;

  const totalDistance =
    bin.distanceMeters >= 1000
      ? `${metersToKilometers(bin.distanceMeters)}km`
      : `${bin.distanceMeters}m`;

  return (
    <BottomCardWithMeBtnFloat onClose={onClose}>
      {/* 위치명 */}
      <p className="font-bold text-base truncate mb-3">
        {bin.detailAddress ? bin.detailAddress : "쓰레기통(정보 없음)"}
      </p>

      {/* 설치 위치 */}
      <div className="flex items-center gap-2 text-sm ml-2 mb-3">
        {bin.type === "GENERAL" ? (
          <img className="w-[24px] h-[24px]" src={regularBinIcon} />
        ) : (
          <img className="w-[24px] h-[24px]" src={recycleBinIcon} />
        )}
        <span>{bin.roadAddress}</span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <img src={walkImage} />
          <div>
            {arrivedSeconds &&
              (() => {
                const [hour, minute, seconds] = secondsToHMS(arrivedSeconds);
                return (
                  <p className="font-medium text-sm">
                    {hour ? `${hour}시간 ` : ""}
                    {minute ? `${minute}분 ` : ""}
                    {hour! <= 0 && seconds ? `${seconds}초` : ""} 후 도착
                  </p>
                );
              })()}
            <p className="text-sm font-light">총 거리 {totalDistance}</p>
          </div>
        </div>
        {/* 버튼 */}
        {directionBtnClick && (
          <Button
            variant={isDirectionAvailable ? "primary" : "disabled"}
            onClick={async () => {
              directionBtnClick({ lat: bin.lat, lng: bin.lng });
            }}
          >
            길 안내
          </Button>
        )}
      </div>
    </BottomCardWithMeBtnFloat>
  );
};

const Skeleton = () => {
  return (
    <BottomCardWithMeBtnFloat>
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-5 bg-gray-300 rounded w-full"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
    </BottomCardWithMeBtnFloat>
  );
};

export default BinInfoCard;
