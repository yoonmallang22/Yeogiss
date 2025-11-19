import { useEffect, useState } from "react";
import Splash from "@/components/Splash";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("visitedHome");

    if (!visited) {
      setShowSplash(true);
      sessionStorage.setItem("visitedHome", "true");

      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {showSplash && <Splash />}
      {!showSplash && children}
    </>
  );
};

export default AppLayout;
