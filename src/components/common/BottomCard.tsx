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
  ref?: React.Ref<HTMLDivElement>;
  onClose?: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      className={`${className} w-full rounded-t-2xl shadow-[0px_-2px_4px_#00000033] bg-white space-y-2 p-5 z-2000 absolute bottom-0 left-1/2 -translate-x-1/2 min-w-xs text-black]`}
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
