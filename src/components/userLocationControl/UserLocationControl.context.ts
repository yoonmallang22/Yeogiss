import type { LatLng } from "@/types/geolocation.type";
import { createContext } from "react";

type TUserLocationControlContext = {
  userLocation: LatLng | null;

  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;

  meButtonBottom: number;
  /**
   * '내 위치' 버튼의 화면 하단 기준 위치를 px 단위로 지정
   */
  setMeButtonBottom: (bottom: number) => void;
  resetMeButtonBottom: () => void;
};

export const UserLocationControlContext =
  createContext<TUserLocationControlContext>({
    userLocation: null,

    isFollowing: false,
    setIsFollowing: () => {},

    meButtonBottom: 20,
    setMeButtonBottom: () => {},
    resetMeButtonBottom: () => {},
  });
