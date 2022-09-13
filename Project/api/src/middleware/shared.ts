import { google } from "googleapis";

export function makeOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URL
  );
}