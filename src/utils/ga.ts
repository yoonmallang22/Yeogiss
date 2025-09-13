interface DeviceInfo {
  device: "mobile" | "tablet" | "desktop" | "unknown";
  os: string;
}

export const getScreenName = (pathname: string): string => {
  const mapping: Record<string, string> = {
    "/": "home",
    "/directions": "direction",
    "/intro": "splash",
  };

  return mapping[pathname] || "기타";
};

export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent || (window as any).opera;

  let device: DeviceInfo["device"] = "unknown";
  let os = "unknown";

  // OS 감지
  if (/windows phone/i.test(userAgent)) {
    os = "Windows Phone";
    device = "mobile";
  } else if (/android/i.test(userAgent)) {
    os = "Android";
    device = /mobile/i.test(userAgent) ? "mobile" : "tablet";
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    os = "iOS";
    device = /iPad/.test(userAgent) ? "tablet" : "mobile";
  } else if (/Mac/i.test(userAgent)) {
    os = "MacOS";
    device = "desktop";
  } else if (/Win/i.test(userAgent)) {
    os = "Windows";
    device = "desktop";
  } else if (/Linux/i.test(userAgent)) {
    os = "Linux";
    device = "desktop";
  }

  return { device, os };
};
