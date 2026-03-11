import { useState, useRef } from "react";
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
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onImageSelect(file);
  };

  return (
    <div
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={`
        relative h-44 border-2 border-dashed rounded-xl
        flex flex-col items-center justify-center overflow-hidden
        transition-all group
        ${
          isUploading
            ? "border-mostaza/50 bg-mostaza/5 dark:bg-mostaza/8 cursor-wait"
            : "border-cream dark:border-white/10 hover:border-chile/40 dark:hover:border-chile/30 bg-cream/20 dark:bg-white/3 hover:bg-cream/40 dark:hover:bg-white/5 cursor-pointer"
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
          <Loader2 className="animate-spin text-mostaza" size={28} />
          <span className="text-xs font-semibold text-mostaza animate-pulse">
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
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white gap-1">
            <Upload size={24} />
            <span className="text-xs font-bold">Cambiar imagen</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <div className="p-3 rounded-xl bg-cream dark:bg-white/8 group-hover:scale-110 transition-transform">
            <ImageIcon
              size={24}
              className="text-charcoal/25 dark:text-white/20"
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal/40 dark:text-white/30">
              Haz clic para subir
            </p>
            <p className="text-[10px] text-charcoal/25 dark:text-white/20 mt-0.5 uppercase tracking-wider">
              JPG · PNG · WEBP
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
