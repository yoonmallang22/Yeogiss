const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const API_VERSION = 'v1';

const ENDPOINTS = {
  GET_BINS: API_BASE_URL + 'api/' + API_VERSION + '/bins/nearby',
  GET_ROUTES: API_BASE_URL + 'api/' + API_VERSION + '/routes',
};

export default ENDPOINTS;
