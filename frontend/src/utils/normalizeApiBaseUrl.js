export const normalizeApiBaseUrl = (rawUrl) => {
  const sanitized = (rawUrl || "http://localhost:5000/api").replace(/\/$/, "");
  if (/\/api$/i.test(sanitized)) return sanitized;
  return `${sanitized}/api`;
};
