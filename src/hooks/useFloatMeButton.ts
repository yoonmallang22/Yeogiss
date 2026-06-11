import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { useContext, useLayoutEffect } from "react";

type UseFloatMeButtonOptions = {
  enabled?: boolean;
  gap?: number;
};

/**
 * 대상 요소의 높이만큼 '내 위치' 버튼을 위로 띄운다.
 */
const useFloatMeButton = (
  ref: React.RefObject<HTMLElement | null>,
  { enabled = true, gap = 0 }: UseFloatMeButtonOptions = {},
) => {
  const { setMeButtonBottom, resetMeButtonBottom } = useContext(
    UserLocationControlContext,
  );

  useLayoutEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    const updateOffset = () => {
      setMeButtonBottom(element.offsetHeight + gap);
    };

    updateOffset();

    const observer = new ResizeObserver(updateOffset);
    observer.observe(element);

    return () => {
      observer.disconnect();
      resetMeButtonBottom();
    };
  }, [enabled, gap, ref, resetMeButtonBottom, setMeButtonBottom]);
};

export default useFloatMeButton;
