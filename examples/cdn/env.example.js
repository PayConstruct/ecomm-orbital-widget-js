/*
 * This config is expected to be your server config, when making a request for creating a payment.
 * Please be careful, and ensure that you have security set before exposing these details such as CORS and rate limit.
 */

;(() => {
  window.env = {
    API_URL: '',
    API_KEY: '',
    PAYLOAD: {},
  }
})()
