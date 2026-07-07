function getApiOrigin(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
  if (!base) return "";
  return base.replace(/\/api$/, "") || base;
}

function getFilesOrigin(): string {
  const filesBase = process.env.NEXT_PUBLIC_FILES_BASE_URL?.replace(/\/$/, "");
  if (filesBase) return filesBase;
  return getApiOrigin();
}
const LEGACY_MEDIA_HOSTS = [
  "http://mepharmacies.com",
  "https://mepharmacies.com",
  "http://www.mepharmacies.com",
  "https://www.mepharmacies.com",
  "http://pharmacy.subcodeco.com",
  "https://pharmacy.subcodeco.com",
];

function rewriteLegacyHost(url: string): string {
  const origin = getApiOrigin();
  if (!origin) return url;

  for (const legacy of LEGACY_MEDIA_HOSTS) {
    if (url.startsWith(legacy)) {
      return `${origin}${url.slice(legacy.length)}`;
    }
  }

  return url;
}

/**
 * Turns API-relative media paths into absolute URLs the browser can load.
 */
export function resolveMediaUrl(
  url: string | null | undefined,
): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return rewriteLegacyHost(trimmed);
  }

  const origin = getFilesOrigin();
  if (!origin) return trimmed;

  if (trimmed.startsWith("/")) {
    return `${origin}${trimmed}`;
  }

  if (trimmed.startsWith("storage/")) {
    return `${origin}/${trimmed}`;
  }

  return `${origin}/${trimmed}`;
}

export function isVoiceMediaUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.startsWith("data:audio")) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes(".webm") ||
    lower.includes(".mp3") ||
    lower.includes(".wav") ||
    lower.includes(".ogg") ||
    lower.includes(".m4a")
  );
}

export function isImageMedia(
  fileType: string | null | undefined,
  fileUrl: string | null | undefined,
): boolean {
  if (!fileUrl || isVoiceMediaUrl(fileUrl)) return false;
  if (fileType === "voice") return false;
  if (fileType === "image") return true;
  if (fileUrl.startsWith("data:image")) return true;
  if (fileType === "text" || fileType === null) {
    const lower = fileUrl.toLowerCase();
    return /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(lower);
  }
  return true;
}
