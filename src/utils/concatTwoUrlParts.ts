// concat if has prefix, like ['/api/users', 'profile'] => /api/users/profile
export function concatTwoUrlParts(prefix: string, urlPart: string) {
  const joinedUrl = [prefix, urlPart]
    .map(str => (str ? str.trim() : ''))
    .filter(Boolean)
    .join('/');

  return removeDoubleSlashes(joinedUrl);
}

function removeDoubleSlashes(str: string): string {
  const index = str.indexOf('//');
  if (index == -1) {
    return str;
  }
  return removeDoubleSlashes(str.replaceAll('//', '/'));
}
