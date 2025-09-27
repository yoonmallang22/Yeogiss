import { trackEvent } from "@/lib/trackEvent";
import { getScreenName, getDeviceInfo } from "@/utils/ga";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PermissionState = "granted" | "denied" | "prompt";

const useGeoPermission = (): PermissionState => {
  const [permission, setPermission] = useState<PermissionState>("prompt");

  useEffect(() => {
    if (!navigator.permissions) {
      // Permissions API를 지원하지 않는 경우 → 기본값 유지
      toast("⚠ 기기에서 위치 기능을 지원하지 않아 위치 확인이 불가능해요.");
      return;
    }

    let permissionStatus: PermissionStatus;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        permissionStatus = status;
        // 초기 권한 상태 반영
        const initialState = status.state;
        setPermission(initialState);
        const { device, os } = getDeviceInfo();
        // 1. 홈 화면 첫 진입 시 → 자동으로 권한 요청 팝업 노출
        if (initialState === "prompt") {
          trackEvent("LOCATION_PERMISSION_REQUESTED", {
            screen_name: getScreenName(location.pathname),
          });
        }

        // 실제 위치 접근 시도
        if (status.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            () => {
              setPermission("granted"); // 위치 접근 성공 → permission 그대로 유지
            },
            (err) => {
              // 권한 거부 또는 기타 오류 발생
              if (err.code === err.PERMISSION_DENIED) {
                setPermission("denied");
              }
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
          );
        }

        // 권한 변경 이벤트 등록
        status.onchange = () => {
          const newState: PermissionState = status.state;
          setPermission(newState);

          if (newState === "granted") {
            trackEvent("LOCATION_PERMISSION_GRANTED", { device, os });
          } else if (newState === "denied") {
            trackEvent("LOCATION_PERMISSION_DENIED", { device, os });
          }
        };
      })
      .catch((err) => {
        toast("⚠ 위치 확인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
        if (err.code === 1) {
          setPermission("denied");
          return;
        }
        setPermission("prompt");
      });

    return () => {
      // cleanup: onchange 핸들러 해제
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  return permission;
};

export default useGeoPermission;
