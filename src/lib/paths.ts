const cleanBase = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = '/') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}` || '/';
}
