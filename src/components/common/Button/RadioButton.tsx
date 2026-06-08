import BUTTON_STYLE from "@/components/common/Button/Button.style";
import type { ReactNode } from "react";

/**
 * 공통 라디오 버튼 컴포넌트
 */
const RadioButton = ({
  children: text,
  variant = "primary",
  ...rest
}: {
  children?: ReactNode;
  variant?: keyof typeof BUTTON_STYLE;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label
      className={`${BUTTON_STYLE.base} ${BUTTON_STYLE[variant]} ${rest.className ? rest.className : ""}`}
    >
      <input
        type="radio"
        className="sr-only"
        {...rest}
        disabled={variant === "disabled" ? true : rest.disabled}
      />
      {text}
    </label>
  );
};

export default RadioButton;
