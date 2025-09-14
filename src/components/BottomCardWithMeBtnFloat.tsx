import BottomCard from "@/components/common/BottomCard";
import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { useContext, useEffect, useRef } from "react";

/**
 * 하단 카드 컴포넌트, 렌더링시 '내 위치' 버튼을 띄우고
 * 언마운트시 '내 위치' 버튼을 원래 위치로 옮김
 */
const BottomCardWithMeBtnFloat = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { floatMeButton, unfloatMeButton } = useContext(
    UserLocationControlContext,
  );

  // 렌더링시 '내 위치' 버튼을 BottomCard height + 10만큼 띄우기
  useEffect(() => {
    if (!ref.current) return;
    floatMeButton(ref.current.offsetHeight + 10);
    return () => {
      unfloatMeButton();
    };
  }, [floatMeButton, unfloatMeButton]);

  return <BottomCard ref={ref}>{children}</BottomCard>;
};

export default BottomCardWithMeBtnFloat;
