interface MeButtonProps {
  onClick: () => void;
  isFollowing: boolean;
}

const FollowIcon = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
  >
    <rect width="30" height="30" rx="15" fill="white" />
    <path
      d="M15 22C15.9193 22 16.8295 21.8189 17.6788 21.4672C18.5281 21.1154 19.2997 20.5998 19.9497 19.9497C20.5998 19.2997 21.1154 18.5281 21.4672 17.6788C21.8189 16.8295 22 15.9193 22 15M15 22C13.1435 22 11.363 21.2625 10.0503 19.9497C8.7375 18.637 8 16.8565 8 15M15 22V24M22 15C22 14.0807 21.8189 13.1705 21.4672 12.3212C21.1154 11.4719 20.5998 10.7003 19.9497 10.0503C19.2997 9.40024 18.5281 8.88463 17.6788 8.53284C16.8295 8.18106 15.9193 8 15 8M22 15H24M15 8C13.1435 8 11.363 8.7375 10.0503 10.0503C8.7375 11.363 8 13.1435 8 15M15 8V6M8 15H6"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="15" cy="15.0001" r="2.56579" stroke={color} strokeWidth={1.5} />
  </svg>
);

const MeButton = ({ onClick, isFollowing }: MeButtonProps) => {
  const strokeColor = isFollowing ? "#00B94E" : "#A5A5A5";

  return (
    <button
      className="absolute top-2.5 right-2.5 z-[1000] cursor-pointer"
      onClick={onClick}
    >
      <FollowIcon color={strokeColor} />
    </button>
  );
};

export default MeButton;
