import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

const handlers = [
  http.post("https://api.yogiss.site/api/v1/routes", () => {
    console.log("Mocked /api/v1/routes called");
    return new HttpResponse(null, {
      status: 401,
    });
  }),
];

export const worker = setupWorker(...handlers);
