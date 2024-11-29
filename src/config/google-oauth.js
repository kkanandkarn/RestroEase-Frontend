import axios from "axios";

export const getUserData = async (authCode) => {
  try {
    const redirectUrl = `${import.meta.env.VITE_FRONTEND_URL}`;
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code: authCode,
          client_id: import.meta.env.VITE_CLIENT_ID, // Your Google Client ID
          client_secret: import.meta.env.VITE_CLIENT_SECRET, // Your Google Client Secret
          redirect_uri: redirectUrl, // Your Redirect URI
          grant_type: "authorization_code",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Step 2: Fetch user information
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return userInfoResponse.data;
  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response?.data || error.message
    );
  }
};
