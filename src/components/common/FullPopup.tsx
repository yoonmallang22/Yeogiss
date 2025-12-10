/**
 * 풀팝업 컴포넌트
 */
const FullPopup = ({children}: {children?: React.ReactNode}) => {
  return <div className="w-full h-full z-9999 absolute top-0 left-0 bg-white">{children}</div>;
};

export default FullPopup;