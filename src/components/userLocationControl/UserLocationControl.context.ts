import { createContext } from "react";

type TUserLocationControlContext = {
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;

  isLocationButtonFloat: boolean;
  float: number;
  /**
   * '내 위치' 버튼을 띄우는 함수, 하단으로 부터 얼마나 띄울지 px 단위로 전달
   */
  floatMeButton: (bottom: number) => void;
  unfloatMeButton: () => void;
};

export const UserLocationControlContext =
  createContext<TUserLocationControlContext>({
    isFollowing: false,
    setIsFollowing: () => {},

    isLocationButtonFloat: false,
    float: 0,
    floatMeButton: () => {},
    unfloatMeButton: () => {},
  });
