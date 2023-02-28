export const SERVER_URL = '';

export const LOCAL_URL = 'http://127.0.0.1:5000';

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? SERVER_URL + '/api/v0'
    : LOCAL_URL + '/api/v0';

let statusURL = '';
if (window.location.origin.split(':').length > 2) {
  statusURL = `ws${window.location.origin.slice(
    window.location.origin.indexOf(':'),
    window.location.origin.lastIndexOf(':')
  )}:5001`;
} else {
  statusURL = `wss${window.location.origin.slice(
    window.location.origin.indexOf(':')
  )}/status-hook`;
}

export const SERVER_STATUS_URL = statusURL;
