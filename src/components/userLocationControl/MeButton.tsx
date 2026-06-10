import { UserLocationControlContext } from "@/components/userLocationControl/UserLocationControl.context";
import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";
import { useContext } from "react";

interface MeButtonProps {
  onClick: () => void;
  isFollowing: boolean;
}

const FollowIcon = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={45}
    height={45}
    viewBox="0 0 45 45"
    fill="none"
  >
    <g filter="url(#filter0_dd_590_1462)">
      <rect x={3.45898} y={3} width={38} height={38} rx={19} fill="white" />
      <path
        d="M22.459 29C23.3782 29 24.2885 28.8189 25.1378 28.4672C25.987 28.1154 26.7587 27.5998 27.4087 26.9497C28.0587 26.2997 28.5744 25.5281 28.9261 24.6788C29.2779 23.8295 29.459 22.9193 29.459 22M22.459 29C20.6025 29 18.822 28.2625 17.5092 26.9497C16.1965 25.637 15.459 23.8565 15.459 22M22.459 29V31M29.459 22C29.459 21.0807 29.2779 20.1705 28.9261 19.3212C28.5744 18.4719 28.0587 17.7003 27.4087 17.0503C26.7587 16.4002 25.987 15.8846 25.1378 15.5328C24.2885 15.1811 23.3782 15 22.459 15M29.459 22H31.459M22.459 15C20.6025 15 18.822 15.7375 17.5092 17.0503C16.1965 18.363 15.459 20.1435 15.459 22M22.459 15V13M15.459 22H13.459"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={22.4589}
        cy={22.0001}
        r={2.56579}
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
    <defs>
      <filter
        id="filter0_dd_590_1462"
        x={0.458984}
        y={0.5}
        width={44}
        height={44}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={0.5} />
        <feGaussianBlur stdDeviation={1.5} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_590_1462"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={0.5} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_590_1462"
          result="effect2_dropShadow_590_1462"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_590_1462"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const MeButton = ({ onClick, isFollowing }: MeButtonProps) => {
  const strokeColor = isFollowing ? "#00B94E" : "#A5A5A5";
  const { float } = useContext(UserLocationControlContext);
  return (
    <button
      className={`absolute left-2.5 z-[10] cursor-pointer`}
      style={{ bottom: float }}
      onClick={() => {
        onClick();

        trackEvent("CURRENT_LOCATION_SELECTED", {
          method: "click",
          screen_name: getScreenName(location.pathname),
        });
      }}
    >
      <FollowIcon color={strokeColor} />
    </button>
  );
};

export default MeButton;
