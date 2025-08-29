import reloadImage from "@/assets/restart.svg";

function LoadBinsButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10 flex items-center gap-2 text-sm cursor-pointer"
      onClick={onClick}
    >
      <img src={reloadImage} alt="쓰레기통 더보기" />이 위치에서 다시 찾기
    </button>
  );
}

export default LoadBinsButton;
