import { buildApiUrl } from "@/lib/api";

export function getGoogleAuthorizationUrl(): string {
  return buildApiUrl("/oauth2/authorization/google");
}
