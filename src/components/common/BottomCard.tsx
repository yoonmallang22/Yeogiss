import { X } from "lucide-react";
import type React from "react";

/**
 * 하단에 표출되는 카드 컴포넌트
 */
const BottomCard = ({
  children,
  ref,
  onClose,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  ref: React.Ref<HTMLDivElement>;
  onClose?: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      className={`${className} w-[97%] rounded-2xl shadow-md bg-white space-y-2 p-5 z-10 absolute bottom-8 left-1/2 -translate-x-1/2 min-w-xs max-w-4xl min-h-[132px] text-black`}
      {...rest}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      )}
      {children}
    </div>
  );
};

export default BottomCard;
