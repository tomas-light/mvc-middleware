export function toKebabCase(url: string) {
  url = url.trim();
  if (!url) {
    return '';
  }

  const firstChar = url[0].toLowerCase();

  const restPart = url.substring(1).replaceAll(/[A-Z]/g, char => {
    return '-' + char.toLowerCase();
  });

  return firstChar + restPart;
}
