const ABSOLUTE_URL_PREFIXES = ["http://", "https://", "//", "data:", "blob:"];

export function resolveImageUrl(image) {
  if (!image || typeof image !== "string") return "";

  const value = image.trim();
  if (!value) return "";

  const lower = value.toLowerCase();
  const isAbsolute = ABSOLUTE_URL_PREFIXES.some((prefix) =>
    lower.startsWith(prefix),
  );

  return isAbsolute ? value : "";
}
