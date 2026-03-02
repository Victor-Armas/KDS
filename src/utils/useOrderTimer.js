import { useEffect, useState } from "react";

const getMinutesDiff = (dateString) => {
  if (!dateString) return 0;

  const created = new Date(dateString);
  const now = new Date();

  return Math.floor((now - created) / 60000);
};

const formatElapsedTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;

  if (minutes < 1440) return "+1h";

  const days = Math.floor(minutes / 1440);
  return `+${days} día${days > 1 ? "s" : ""}`;
};

const getStatusConfig = (minutes) => {
  if (minutes >= 20) {
    return {
      status: "danger",
      styles: "bg-red-100 text-red-800 border-red-500",
      styleCard: "border-red-500",
      bgButton: "bg-red-500 hover:bg-red-600",
    };
  }

  if (minutes >= 10) {
    return {
      status: "warning",
      styles: "bg-yellow-100 text-yellow-800 border-yellow-500",
      styleCard: "border-yellow-500",
      bgButton: "bg-yellow-500 hover:bg-yellow-600",
    };
  }

  return {
    status: "success",
    styles: "bg-emerald-100 text-emerald-800 border-emerald-500",
    styleCard: "border-emerald-500",
    bgButton: "bg-emerald-500 hover:bg-emerald-600",
  };
};

export const useOrderTimer = (dateString) => {
  const [minutes, setMinutes] = useState(() => getMinutesDiff(dateString));

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(getMinutesDiff(dateString));
    }, 60000);

    return () => clearInterval(interval);
  }, [dateString]);

  const displayTime = formatElapsedTime(minutes);
  const { status, styles, styleCard, bgButton } = getStatusConfig(minutes);

  return { minutes, displayTime, status, styles, styleCard, bgButton };
};
