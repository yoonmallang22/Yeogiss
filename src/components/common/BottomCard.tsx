import type React from "react";

/**
 * 하단에 표출되는 카드 컴포넌트
 */
const BottomCard = ({
  children,
  ref,
}: {
  children?: React.ReactNode;
  ref: React.Ref<HTMLDivElement>;
}) => {
  return (
    <div
      ref={ref}
      className="w-[97%] rounded-2xl shadow-md bg-white p-5 space-y-2 z-10 absolute bottom-8 left-1/2 -translate-x-1/2 min-w-xs max-w-4xl text-black"
    >
      {children}
    </div>
  );
};

export default BottomCard;
