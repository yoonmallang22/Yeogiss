import { trackEvent } from "@/lib/trackEvent";
import { getScreenName } from "@/utils/ga";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        page_path?: string;
        page_title?: string;
      },
    ) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });

    trackEvent("PAGE_VIEW_CUSTOM", {
      screen_name: getScreenName(location.pathname),
    });
  }, [location]);
};

export default useGoogleAnalytics;
