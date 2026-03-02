export const formatTime = (dateString, options = {}) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
  });
};
