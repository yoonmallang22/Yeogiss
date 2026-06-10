import BackDrop from "@/components/common/BackDrop";
import BottomCard from "@/components/common/BottomCard";
import Button from "@/components/common/Button/Button";
import { getPrivacyThirdPartyConsent } from "@/lib/api/routes";
import { usePrivacyThirdPartyConsentFlow } from "@/lib/contexts/PrivacyThirdPartyConsentFlowContext";

/**
 * 길안내 버튼 클릭 후 개인정보 제3자 동의가 필요한 사용자인 경우 화면에 표시되는 컴포넌트
 */
const PrivacyThirdPartyConsentCard = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  const {
    resetFlow: resetThirdPartyConsentFlow,
    toggleConsentPopupOpen,
    completeFlow: completeThirdPartyConsentFlow,
  } = usePrivacyThirdPartyConsentFlow();

  return (
    <BackDrop
      content={
        <BottomCard
          onClose={() => {
            resetThirdPartyConsentFlow();
            if (onClose) onClose();
          }}
          className="px-6 py-7 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-3 mb-0">
            <p className="text-lg font-bold mb-0">
              길 안내를 위해
              <br /> 위치 정보 동의가 필요해요
            </p>
            <p className="text-xs mb-0">
              길 안내가 끝나면 내 위치와 목적지는 바로 삭제돼요
            </p>
            <button
              type="button"
              onClick={toggleConsentPopupOpen}
              className="flex items-center gap-1 text-[#9E9E9E] text-xs self-start mb-0"
            >
              내 위치정보 제3자 제공 동의{" "}
              <svg
                width="4"
                height="8"
                viewBox="0 0 4 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.978835 0.1959L3.83125 3.52649C3.88472 3.58841 3.92716 3.66209 3.95613 3.74326C3.98509 3.82443 4 3.9115 4 3.99943C4 4.08737 3.98509 4.17443 3.95613 4.25561C3.92716 4.33678 3.88472 4.41045 3.83125 4.47238L0.978835 7.80296C0.925801 7.8654 0.862705 7.91495 0.793186 7.94877C0.723667 7.98259 0.649102 8 0.573791 8C0.498481 8 0.423915 7.98259 0.354397 7.94877C0.284878 7.91495 0.221782 7.8654 0.168748 7.80296C0.115278 7.74104 0.072837 7.66737 0.0438743 7.58619C0.0149116 7.50502 0 7.41796 0 7.33002C0 7.24208 0.0149116 7.15502 0.0438743 7.07385C0.072837 6.99267 0.115278 6.919 0.168748 6.85708L2.62183 3.99943C2.62183 3.99943 0.276172 1.26722 0.168748 1.14179C0.0613239 1.01635 0.000973859 0.846232 0.000973859 0.668843C0.000973859 0.58101 0.0157899 0.494036 0.0445766 0.412888C0.0733634 0.33174 0.115557 0.258008 0.168748 0.1959C0.276172 0.0704673 0.421871 0 0.573791 0C0.649015 0 0.723502 0.0173003 0.792999 0.0509129C0.862497 0.0845254 0.925644 0.133792 0.978835 0.1959Z"
                  fill="#9E9E9E"
                />
              </svg>
            </button>
            <Button
              variant="primary"
              className="self-center w-[95%]"
              onClick={async () => {
                // 동의 완료 처리 후 길안내 재시작
                const response = await getPrivacyThirdPartyConsent();
                if (response.statusCode >= 200 && response.statusCode < 300) {
                  completeThirdPartyConsentFlow();
                }
              }}
            >
              동의하고 길 안내받기
            </Button>
          </div>
        </BottomCard>
      }
    />
  );
};

export default PrivacyThirdPartyConsentCard;
