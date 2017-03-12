export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusMessage);
    error.response = response;
    throw error;
  }
}
