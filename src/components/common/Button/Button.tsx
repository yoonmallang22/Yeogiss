import BUTTON_STYLE from "@/components/common/Button/Button.style";
import type { ReactNode } from "react";

/**
 * 공통 버튼 컴포넌트
 */
const Button = ({
  children: text,
  variant = "primary",
  ...rest
}: {
  children?: ReactNode;
  variant?: keyof typeof BUTTON_STYLE;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...rest}
      className={`${BUTTON_STYLE.base} ${BUTTON_STYLE[variant]} ${rest.className ? rest.className : ""}`}
      disabled={variant === "disabled" ? true : rest.disabled}
    >
      {text}
    </button>
  );
};
export default Button;
