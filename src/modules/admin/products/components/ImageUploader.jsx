import React, { useState, useRef } from "react";
import { Upload, Loader2, ImageIcon } from "lucide-react";

export default function ImageUploader({
  onImageSelect,
  defaultImage,
  isUploading,
}) {
  const [preview, setPreview] = useState(defaultImage || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Previsualización local inmediata
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Enviamos el archivo al padre (ModalAddProduct)
    onImageSelect(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-charcoal/70 ml-1">
        Imagen del Producto
      </label>

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group
          ${
            isUploading
              ? "border-mostaza bg-mostaza/5 cursor-wait"
              : "border-cream bg-cream/5 hover:bg-cream/10 cursor-pointer"
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
          accept="image/png, image/jpeg, image/webp"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-mostaza" size={32} />
            <span className="text-xs font-medium text-mostaza animate-pulse">
              Subiendo imagen...
            </span>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
              <Upload size={28} />
              <span className="text-xs font-bold mt-1">Cambiar foto</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-3 bg-cream/30 rounded-full group-hover:scale-110 transition-transform">
              <ImageIcon className="text-charcoal/30" size={30} />
            </div>
            <span className="text-xs text-charcoal/50 mt-2 font-medium">
              Haz clic para subir la foto
            </span>
            <span className="text-[10px] text-charcoal/30 mt-1 uppercase tracking-wider">
              JPG, PNG o WEBP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
