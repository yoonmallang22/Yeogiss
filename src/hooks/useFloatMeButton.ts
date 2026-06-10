import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { useContext, useLayoutEffect } from "react";

type UseFloatMeButtonOptions = {
  enabled?: boolean;
  gap?: number;
};

const DEFAULT_GAP = 10;

/**
 * 대상 요소의 높이만큼 '내 위치' 버튼을 위로 띄운다.
 */
const useFloatMeButton = (
  ref: React.RefObject<HTMLElement | null>,
  { enabled = true, gap = DEFAULT_GAP }: UseFloatMeButtonOptions = {},
) => {
  const { floatMeButton, unfloatMeButton } = useContext(
    UserLocationControlContext,
  );

  useLayoutEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    const updateOffset = () => {
      console.log(element.offsetHeight);
      floatMeButton(element.offsetHeight + gap);
    };

    updateOffset();

    const observer = new ResizeObserver(updateOffset);
    observer.observe(element);

    return () => {
      observer.disconnect();
      unfloatMeButton();
    };
  }, [enabled, floatMeButton, gap, ref, unfloatMeButton]);
};

export default useFloatMeButton;
