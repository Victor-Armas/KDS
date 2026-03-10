import React, { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { useProductMutations } from "../hooks/useProductMutations";
import ImageUploader from "./ImageUploader";
import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";

export default function ModalAddProduct({ onClose, categories, initialData }) {
  const isEditing = !!initialData;
  const { createMutation, updateMutation } = useProductMutations();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category_id: initialData?.category_id || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    is_available: initialData?.is_available ?? true,
    image_url: initialData?.image_url || "",
  });

  const isPending =
    createMutation.isPending || updateMutation.isPending || isUploadingImage;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadToCloudinary = async (file) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;

    const { data: sigData, error: sigError } = await supabase.functions.invoke(
      "get-cloudinary-signature",
      { body: { timestamp } },
    );

    if (sigError) throw new Error("Error de autorización: " + sigError.message);

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("api_key", sigData.apiKey);
    formDataCloud.append("timestamp", timestamp);
    formDataCloud.append("signature", sigData.signature);
    formDataCloud.append("folder", sigData.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formDataCloud },
    );

    const data = await res.json();
    if (!data.secure_url)
      throw new Error(data.error?.message || "Error al subir imagen");

    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let currentImageUrl = formData.image_url;

    try {
      if (selectedFile) {
        setIsUploadingImage(true);
        currentImageUrl = await uploadToCloudinary(selectedFile);
      }

      const finalData = { ...formData, image_url: currentImageUrl };
      const mutation = isEditing ? updateMutation : createMutation;

      mutation.mutate(
        isEditing ? { id: initialData.id, ...finalData } : finalData,
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } catch (error) {
      notify.error("Error", error.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm overflow-y-auto lg:pl-70 transition-all duration-300">
      <div className="bg-softwhite w-full max-w-4xl rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        {/* Cabecera */}
        <div
          className={`px-6 py-5 border-b border-cream flex items-center justify-between bg-cream/10 ${isEditing ? "bg-mostaza/80" : "bg-hoja/80"}`}
        >
          <div className="lg:pl-2">
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-tight">
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <p className="text-xs text-white/70 font-medium">
              Define los sabores de este platillo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Formulario Izquierda */}
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-charcoal/70 ml-1">
                  Nombre
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="Ej. Tacos al Pastor"
                  className="w-full px-4 py-3 bg-white border border-cream rounded-2xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-charcoal/70 ml-1">
                    Categoría
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-cream rounded-2xl outline-none"
                  >
                    <option value="">¿Qué es?</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-charcoal/70 ml-1">
                    Precio ($)
                  </label>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border border-cream rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-cream/50 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-bold text-charcoal">
                    ¿Disponible?
                  </span>
                  <span className="text-[10px] text-charcoal/50 uppercase font-bold tracking-wider">
                    Visible en el menú
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      is_available: !p.is_available,
                    }))
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formData.is_available ? "bg-hoja" : "bg-charcoal/20"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.is_available ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-charcoal/70 ml-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white border border-cream rounded-2xl outline-none resize-none"
                />
              </div>
            </div>

            {/* Derecha: Imagen y Botones */}
            <div className="space-y-5 flex flex-col justify-between">
              <ImageUploader
                defaultImage={initialData?.image_url}
                isUploading={isUploadingImage}
                onImageSelect={(file) => setSelectedFile(file)}
              />

              <div className="hidden lg:block p-6 bg-mostaza/5 rounded-4xl border border-mostaza/10 border-dashed">
                <p className="text-sm text-charcoal/60 italic font-serif">
                  "Un buen taco no se le niega a nadie. Asegúrate de que la foto
                  se vea tan bien como sabe."
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 px-6 py-4 border-2 border-cream rounded-2xl font-bold text-charcoal/40 hover:bg-cream/30 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className={`flex-2 px-6 py-4 ${!isEditing ? "bg-hoja" : "bg-mostaza"} text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50`}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {isPending
                    ? "Procesando..."
                    : isEditing
                      ? "Actualizar"
                      : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
