import { useState } from "react";
import { X, Save, Loader2, Sparkles } from "lucide-react";
import { useProductMutations } from "../hooks/useProductMutations";
import ImageUploader from "./ImageUploader";
import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";

const inputClass = `
  w-full px-4 py-3 text-sm rounded-xl
  bg-cream/40 dark:bg-white/5
  border border-cream dark:border-white/8
  text-charcoal dark:text-stone-100
  placeholder:text-charcoal/30 dark:placeholder:text-white/20
  focus:outline-none focus:ring-2 focus:ring-chile/30 focus:border-chile/40
  transition-all
`;

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-white/40 mb-1.5";

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
          onSuccess: () => onClose(),
        },
      );
    } catch (error) {
      notify.error("Error", error.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto lg:pl-70 transition-all duration-300">
      <div className="bg-softwhite dark:bg-[#1a1816] w-full max-w-3xl rounded-2xl shadow-2xl dark:shadow-black/60 border border-cream dark:border-white/8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div
          className={`px-6 py-5 flex items-center justify-between border-b border-cream dark:border-white/8 ${isEditing ? "bg-mostaza/8 dark:bg-mostaza/10" : "bg-hoja/8 dark:bg-hoja/10"}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${isEditing ? "bg-mostaza/15 dark:bg-mostaza/20" : "bg-hoja/15 dark:bg-hoja/20"}`}
            >
              <Sparkles
                size={18}
                className={isEditing ? "text-mostaza" : "text-hoja"}
              />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-charcoal dark:text-stone-100">
                {isEditing ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <p className="text-[11px] text-charcoal/40 dark:text-white/30 font-medium">
                {isEditing
                  ? "Modifica los detalles del platillo"
                  : "Agrega un nuevo platillo al menú"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal/30 dark:text-white/30 hover:bg-cream dark:hover:bg-white/8 hover:text-charcoal dark:hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className={labelClass}>Nombre del platillo</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="Ej. Tacos al Pastor"
                  className={inputClass}
                />
              </div>

              {/* Categoría + Precio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className={inputClass + " cursor-pointer"}
                  >
                    <option value="">Seleccionar</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Precio ($)</label>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Disponible toggle */}
              <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-cream/40 dark:bg-white/5 border border-cream dark:border-white/8">
                <div>
                  <p className="text-sm font-semibold text-charcoal dark:text-stone-200">
                    Visible en el menú
                  </p>
                  <p className="text-[11px] text-charcoal/40 dark:text-white/30 mt-0.5">
                    Los clientes podrán verlo y ordenarlo
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      is_available: !p.is_available,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_available ? "bg-hoja" : "bg-charcoal/20 dark:bg-white/15"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.is_available ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              {/* Descripción */}
              <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Ingredientes, alergenos, preparación especial..."
                  className={inputClass + " resize-none"}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4 flex flex-col">
              <div>
                <label className={labelClass}>Imagen del producto</label>
                <ImageUploader
                  defaultImage={initialData?.image_url}
                  isUploading={isUploadingImage}
                  onImageSelect={(file) => setSelectedFile(file)}
                />
              </div>

              {/* Quote */}
              <div className="hidden lg:block flex-1 p-4 rounded-xl bg-mostaza/5 dark:bg-mostaza/8 border border-dashed border-mostaza/20 dark:border-mostaza/15">
                <p className="text-sm text-charcoal/50 dark:text-white/35 italic font-serif leading-relaxed">
                  "Un buen taco no se le niega a nadie. Asegúrate de que la foto
                  se vea tan bien como sabe."
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 px-4 py-3 rounded-xl border border-cream dark:border-white/8 text-sm font-semibold text-charcoal/60 dark:text-white/40 hover:bg-cream dark:hover:bg-white/5 transition-all disabled:opacity-40 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className={`flex-1 px-4 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-60 cursor-pointer
                    ${isEditing ? "bg-mostaza hover:bg-mostaza/90 shadow-mostaza/20" : "bg-hoja hover:bg-hoja/90 shadow-hoja/20"}`}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {isPending
                    ? "Guardando..."
                    : isEditing
                      ? "Actualizar"
                      : "Crear producto"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
