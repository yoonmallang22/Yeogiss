const API_VERSION = "v1";

const ENDPOINTS = {
  GET_BINS: "api/" + API_VERSION + "/bins/nearby",
  GET_ROUTES: "api/" + API_VERSION + "/routes",
  GET_BIN: ({
    binId,
    currentLat,
    currentLng,
  }: {
    binId: number;
    currentLat: number;
    currentLng: number;
  }) =>
    "api/" +
    API_VERSION +
    "/bins/" +
    binId +
    `?currentLat=${currentLat}&currentLng=${currentLng}`,
};

export default ENDPOINTS;
