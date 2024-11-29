const filterObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      // Remove null, undefined, or empty strings after trimming
      return (
        value !== null &&
        value !== undefined &&
        (typeof value !== "string" || value.trim() !== "")
      );
    })
  );
};

export const CRUDAPI = async (endpoint, method = "GET", data, navigate) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const url = `${BACKEND_URL}${endpoint}`;
  const token = localStorage.getItem("Authorization");

  let payload = data;
  if (data) {
    payload = filterObject(data);
  }

  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(payload) : undefined,
  };

  const response = await fetch(url, requestOptions);

  const errorStatus = [401, 423];

  if (errorStatus.includes(response.statusCode)) {
    localStorage.clear();
    navigate("/");
    return;
  }

  return response.json();
};
