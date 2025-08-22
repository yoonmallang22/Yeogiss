interface MeButtonProps {
  onClick: () => void;
}

const MeButton = ({ onClick }: MeButtonProps) => {
  return (
    <button
      className="absolute top-2.5 right-2.5 z-[1000] cursor-pointer"
      onClick={onClick}
    >
      내 위치
    </button>
  );
};

export default MeButton;
