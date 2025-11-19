import { useEffect, useState } from "react";
import splashImage from "@/src/assets/splash.svg";

const Splash = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 1500); // 1.5초 후 fadeout 시작
    const timer2 = setTimeout(() => setVisible(false), 2000); // 2초 후 완전히 제거

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img src={splashImage} className="select-none w-[120px]" />
    </div>
  );
};

export default Splash;
