export function resolveAssetUrl(relativePath) {
  return new URL(relativePath, import.meta.url).toString();
}
