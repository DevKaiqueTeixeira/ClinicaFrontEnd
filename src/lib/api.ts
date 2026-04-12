const DEFAULT_API_URL = "http://localhost:8080";

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

  if (configuredUrl?.trim()) {
    return normalizeBaseUrl(configuredUrl.trim());
  }

  if (typeof window !== "undefined") {
    const inferredUrl = `${window.location.protocol}//${window.location.hostname}:8080`;
    return normalizeBaseUrl(inferredUrl);
  }

  return normalizeBaseUrl(DEFAULT_API_URL);
}

export function buildApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${formattedPath}`;
}
