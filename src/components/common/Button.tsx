const CLASS = {
  base: "px-7 py-2 rounded-full text-sm font-medium transition cursor-pointer",
  primary: "bg-secondary text-white",
  secondary: "bg-[#EAFAEA] text-secondary",
  disabled: "bg-disabled text-white disabled:cursor-not-allowed",
};

/**
 * 공통 버튼 컴포넌트
 */
const Button = ({
  children: text,
  variant = "primary",
  ...rest
}: {
  children?: string;
  variant?: "primary" | "secondary" | "disabled";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...rest}
      className={`${CLASS.base} ${CLASS[variant]}${rest.className ? rest.className : ''}`}
    >
      {text}
    </button>
  );
};
export default Button;
