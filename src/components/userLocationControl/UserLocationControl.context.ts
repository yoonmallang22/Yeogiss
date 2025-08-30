import { createContext } from "react";

type TUserLocationControlContext = {
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  isLocationButtonFloat: boolean;
  setIsLocationButtonFloat: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserLocationControlContext = createContext<TUserLocationControlContext>({
  isFollowing: false,
  setIsFollowing: () => {},
  isLocationButtonFloat: false,
  setIsLocationButtonFloat: () => {},
});