import FullPopup from "@/components/common/FullPopup";
import Header from "@/components/common/Header";
import { usePrivacyThirdPartyConsentFlow } from "@/lib/contexts/PrivacyThirdPartyConsentFlowContext";

const LINK = {
  TERMS_OF_SERVICE:
    "https://amourosa.notion.site/2a649d3930d380908b04ffa3e18b5b69",
  PRIVACY_POLICY:
    "https://amourosa.notion.site/2a649d3930d380d69974e0e7c921e2b5?source=copy_link",
};

/**
 * 위치정보 제3자 동의 정책 팝업
 */
const PrivacyThirdPartyPopup = () => {
  const { toggleConsentPopupOpen } = usePrivacyThirdPartyConsentFlow();

  return (
    <FullPopup>
      <Header
        title="위치정보 제3자 제공 동의"
        onBack={toggleConsentPopupOpen}
      />
      <div className="p-6 pt-10 font-normal">
        <p className="text-sm text-gray-700 mb-5">
          길 안내 서비스 이용 시, 회원의 현재 위치정보가 카카오맵에 제공됩니다.
          안전한 개인정보 보호를 위해 최선을 다하겠습니다.
        </p>
        <h3 className="text-md font-medium mb-5">
          [필수] 위치 공유 시 개인정보 제3자 제공 동의
        </h3>
        <table className="table-auto border-collapse border border-black w-full text-sm mb-5">
          <tbody>
            <tr>
              <th className="w-32 border border-black px-3 py-2 text-left font-normal">
                제공처
              </th>
              <td className="border border-black px-3 py-2">T맵, 카카오맵</td>
            </tr>
            <tr>
              <th className="border border-black px-3 py-2 text-left font-normal">
                제공 목적
              </th>
              <td className="border border-black px-3 py-2">
                도보 경로 안내 및 위치기반 길찾기 서비스 제공
              </td>
            </tr>
            <tr>
              <th className="border border-black px-3 py-2 text-left font-normal">
                제공 항목
              </th>
              <td className="border border-black px-3 py-2">
                현재 위치(위도·경도), 목적지 좌표
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-gray-700">
          동의 거부 시 길 안내 기능 이용이 제한됩니다.
          <br />더 자세한 내용은{" "}
          <a
            href={LINK.TERMS_OF_SERVICE}
            target="_blank"
            className="underline text-blue-600"
          >
            위치기반서비스 이용약관
          </a>{" "}
          및{" "}
          <a
            href={LINK.PRIVACY_POLICY}
            target="_blank"
            className="underline text-blue-600"
          >
            개인정보처리방침
          </a>
          을 참고해 주세요.
        </p>
      </div>
    </FullPopup>
  );
};

export default PrivacyThirdPartyPopup;
