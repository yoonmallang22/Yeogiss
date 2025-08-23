const CLASS = {
  base: 'px-7 py-2 rounded-full text-sm font-medium transition cursor-pointer',
  primary: 'bg-primary text-white',
  secondary: 'bg-white text-primary border-1 border-primary',
  disabled: 'bg-secondary text-white cursor-not-allowed',
};

/**
 * 공통 버튼 컴포넌트
 */
const Button = ({
  children: text,
  variant = 'primary',
  ...rest
}: {
  children?: string;
  variant?: 'primary' | 'secondary' | 'disabled';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={`${CLASS.base} ${CLASS[variant]}`} {...rest}>
      {text}
    </button>
  );
};
export default Button;
