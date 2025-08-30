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
        setPermission(status.state as PermissionState);

        // 권한 변경 이벤트 등록
        status.onchange = () => {
          setPermission(status.state as PermissionState);
        };
      })
      .catch(() => {
        // Permissions API 동작 실패 시 fallback
        toast("⚠ 위치 확인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
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
