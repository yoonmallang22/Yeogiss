import reloadImage from "@/assets/restart.svg";
import { useContext } from "react";
import { KakaoMapContext } from "react-kakao-maps-sdk";

const LoadBinsButton = ({
  onClick,
}: {
  onClick?: (kakaoMap: kakao.maps.Map) => void;
}) => {
  const kakaoMap = useContext(KakaoMapContext);

  return (
    <button
      className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10 flex items-center gap-2 text-sm cursor-pointer"
      onClick={() => {
        if (onClick) onClick(kakaoMap);
      }}
    >
      <img src={reloadImage} alt="쓰레기통 더보기" />이 위치에서 다시 찾기
    </button>
  );
};

export default LoadBinsButton;
