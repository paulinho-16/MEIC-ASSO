import { google } from "googleapis";

export function makeOAuth2Client() {
  return new google.auth.OAuth2(
    /* YOUR_CLIENT_ID */ "481578171203-0fullfcoebthn7ui8715pir8len72et0.apps.googleusercontent.com",
    /* YOUR_CLIENT_SECRET */ "grand-ward-345617",
    /* YOUR_REDIRECT_URL */ "http://localhost:8080"
  );
}