import React from "react";
import { toast } from "sonner";

// 1. Imports de imágenes (Vite los procesa correctamente)
import taquitoSuccess from "@/img/taquitoLike.png";
import chileError from "@/img/chileError.png";
import aguacateInfo from "@/img/aguacateInfo.png";
import taquitoBasura from "@/img/taquitoBasura.png";

const toastConfig = {
  success: {
    border: "border-hoja",
    image: taquitoSuccess,
    animation: "animate-bounce",
  },
  error: {
    border: "border-chile",
    image: chileError,
    animation: "animate-shake",
  },
  info: {
    border: "border-mostaza",
    image: aguacateInfo,
    animation: "animate-pulse",
  },
  delete: {
    border: "border-hoja",
    image: taquitoBasura,
    animation: "animate-pulse",
  },
};

const TacoToast = ({ title, message, variant = "success" }) => {
  const config = toastConfig[variant] || toastConfig.success;

  return (
    <div
      className={`
        flex items-center gap-3 sm:gap-4 
        bg-softwhite border-l-10 ${config.border} 
        px-3 py-1 sm:px-4 sm:py-1.5 
        rounded
        shadow-xl 
        /* Responsive Width: Casi pantalla completa en móvil, fijo en desktop */
        w-[calc(100vw-2rem)] sm:w-auto sm:max-w-sm sm:min-w-[320px] 
        pointer-events-auto ring-1 ring-charcoal/5 
        animate-in fade-in slide-in-from-right-5
      `}
    >
      {/* IMAGEN: Un poco más pequeña en móvil para ahorrar espacio vertical */}
      <div className="shrink-0">
        <img
          src={config.image}
          alt={variant}
          className={`w-12 h-12 sm:w-16 sm:h-16 object-contain ${config.animation}`}
        />
      </div>

      {/* TEXTOS: Ajuste de jerarquía para pantallas pequeñas */}
      <div className="flex flex-col min-w-0 space-y-0.5 sm:space-y-1">
        <h4 className="font-serif font-bold text-charcoal text-sm sm:text-base leading-tight truncate">
          {title}
        </h4>
        <p className="text-charcoal/70 text-[10px] sm:text-xs font-medium leading-tight line-clamp-2">
          {message}
        </p>
      </div>
    </div>
  );
};

export const notify = {
  success: (title, message) => {
    toast.custom(() => (
      <TacoToast variant="success" title={title} message={message} />
    ));
  },
  error: (title, message) => {
    toast.custom(() => (
      <TacoToast variant="error" title={title} message={message} />
    ));
  },
  info: (title, message) => {
    toast.custom(() => (
      <TacoToast variant="info" title={title} message={message} />
    ));
  },
  delete: (title, message) => {
    toast.custom(() => (
      <TacoToast variant="delete" title={title} message={message} />
    ));
  },
};
