import BottomCard from "@/components/common/BottomCard";
import useFloatMeButton from "@/hooks/useFloatMeButton";
import { useRef } from "react";

/**
 * 하단 카드가 차지하는 높이만큼 '내 위치' 버튼을 위로 띄운다.
 */
const BottomCardWithMeBtnFloat = ({
  children,
  onClose,
  ...rest
}: {
  children: React.ReactNode;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);

  useFloatMeButton(ref, { gap: 10 });

  return (
    <BottomCard ref={ref} onClose={onClose} {...rest}>
      {children}
    </BottomCard>
  );
};

export default BottomCardWithMeBtnFloat;
