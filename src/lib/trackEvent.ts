import { GA_EVENTS } from "../constants/ga";

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

export const trackEvent = (
  eventName: keyof typeof GA_EVENTS,
  params?: EventParams,
) => {
  if (!window.gtag) return;

  window.gtag("event", GA_EVENTS[eventName], {
    ...params,
  });
};
