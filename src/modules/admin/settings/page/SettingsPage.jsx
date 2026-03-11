import { useState, useEffect } from "react";
import {
  Store,
  Clock,
  Phone,
  MapPin,
  Globe,
  Save,
  Loader2,
  Power,
  Utensils,
  Instagram,
  Facebook,
  AlertCircle,
} from "lucide-react";
import {
  useSettings,
  useUpdateSettings,
  useToggleOpen,
} from "../hooks/useSettings";

// ── Helpers ────────────────────────────────────────────────────────────────────
const DAYS = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const DEFAULT_HOURS = DAYS.reduce((acc, d) => {
  acc[d.key] = { open: "09:00", close: "22:00", closed: false };
  return acc;
}, {});

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-cream dark:border-white/6 bg-softwhite dark:bg-[#1a1816] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-cream dark:border-white/6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-chile/10 dark:bg-chile/15 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-chile" />
        </div>
        <div>
          <p className="text-sm font-bold text-charcoal dark:text-stone-100">
            {title}
          </p>
          {subtitle && (
            <p className="text-[11px] text-charcoal/45 dark:text-white/30">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-charcoal/45 dark:text-white/30">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-cream dark:border-white/8 bg-white dark:bg-white/5 text-sm text-charcoal dark:text-stone-100 placeholder:text-charcoal/30 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-chile/25 transition-all";

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending: isSaving } = useUpdateSettings();
  const { mutate: toggleOpen, isPending: isToggling } = useToggleOpen();

  const [form, setForm] = useState({
    restaurant_name: "",
    tagline: "",
    phone: "",
    address: "",
    website: "",
    instagram: "",
    facebook: "",
    hours: DEFAULT_HOURS,
  });

  // Sincronizar cuando llegan los datos
  useEffect(() => {
    if (!settings) return;
    setForm({
      restaurant_name: settings.restaurant_name ?? "",
      tagline: settings.tagline ?? "",
      phone: settings.phone ?? "",
      address: settings.address ?? "",
      website: settings.website ?? "",
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      hours: settings.hours ?? DEFAULT_HOURS,
    });
  }, [settings]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setHour = (day, field, value) =>
    setForm((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: { ...prev.hours[day], [field]: value },
      },
    }));

  const toggleDayClosed = (day) =>
    setForm((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: { ...prev.hours[day], closed: !prev.hours[day].closed },
      },
    }));

  const handleSave = () => {
    updateSettings({
      restaurant_name: form.restaurant_name,
      tagline: form.tagline,
      phone: form.phone,
      address: form.address,
      website: form.website,
      instagram: form.instagram,
      facebook: form.facebook,
      hours: form.hours,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-cream dark:bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal dark:text-stone-100">
            Ajustes
          </h1>
          <p className="text-sm text-charcoal/50 dark:text-white/40 mt-0.5">
            Configura la información de tu restaurante
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-hoja text-white rounded-xl font-bold text-sm hover:bg-hoja/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-hoja/20 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* ── Estado del restaurante ── */}
      <div
        className={`rounded-2xl border-2 p-5 flex items-center justify-between gap-4 transition-all ${
          settings?.is_open
            ? "border-hoja/30 bg-hoja/5 dark:bg-hoja/8"
            : "border-chile/30 bg-chile/5 dark:bg-chile/8"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              settings?.is_open ? "bg-hoja text-white" : "bg-chile text-white"
            }`}
          >
            <Power size={18} />
          </div>
          <div>
            <p className="font-bold text-charcoal dark:text-stone-100 text-sm">
              Estado del restaurante
            </p>
            <p
              className={`text-xs font-medium ${
                settings?.is_open ? "text-hoja" : "text-chile"
              }`}
            >
              {settings?.is_open
                ? "Abierto — aceptando pedidos"
                : "Cerrado — no se aceptan pedidos"}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => toggleOpen(!settings?.is_open)}
          disabled={isToggling}
          className={`relative w-14 h-7 rounded-full transition-all cursor-pointer disabled:opacity-50 ${
            settings?.is_open ? "bg-hoja" : "bg-charcoal/20 dark:bg-white/15"
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
              settings?.is_open ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* ── Información general ── */}
      <Section
        icon={Store}
        title="Información general"
        subtitle="Nombre, eslogan y datos de contacto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre del restaurante">
            <input
              value={form.restaurant_name}
              onChange={set("restaurant_name")}
              placeholder="Ej. Sabores de México"
              className={inputCls}
            />
          </Field>
          <Field label="Eslogan">
            <input
              value={form.tagline}
              onChange={set("tagline")}
              placeholder="Ej. Cocina Mexicana Auténtica"
              className={inputCls}
            />
          </Field>
          <Field label="Teléfono">
            <div className="relative">
              <Phone
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25"
              />
              <input
                value={form.phone}
                onChange={set("phone")}
                placeholder="+52 55 1234 5678"
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
          <Field label="Sitio web">
            <div className="relative">
              <Globe
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25"
              />
              <input
                value={form.website}
                onChange={set("website")}
                placeholder="https://tusabores.mx"
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Dirección">
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-3 text-charcoal/30 dark:text-white/25"
                />
                <textarea
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Calle, número, colonia, ciudad..."
                  rows={2}
                  className={`${inputCls} pl-9 resize-none`}
                />
              </div>
            </Field>
          </div>
        </div>
      </Section>

      {/* ── Redes sociales ── */}
      <Section
        icon={Globe}
        title="Redes sociales"
        subtitle="Tus perfiles en redes"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Instagram">
            <div className="relative">
              <Instagram
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25"
              />
              <input
                value={form.instagram}
                onChange={set("instagram")}
                placeholder="@tusabores"
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
          <Field label="Facebook">
            <div className="relative">
              <Facebook
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25"
              />
              <input
                value={form.facebook}
                onChange={set("facebook")}
                placeholder="facebook.com/tusabores"
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
        </div>
      </Section>

      {/* ── Horarios ── */}
      <Section
        icon={Clock}
        title="Horarios"
        subtitle="Configura el horario de cada día"
      >
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => {
            const day = form.hours?.[key] ?? {
              open: "09:00",
              close: "22:00",
              closed: false,
            };
            return (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  day.closed
                    ? "bg-charcoal/3 dark:bg-white/3 opacity-50"
                    : "bg-cream/40 dark:bg-white/4"
                }`}
              >
                {/* Día */}
                <span className="w-20 text-xs font-bold text-charcoal/70 dark:text-white/50 shrink-0">
                  {label}
                </span>

                {/* Horas */}
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={day.open}
                    onChange={(e) => setHour(key, "open", e.target.value)}
                    disabled={day.closed}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-cream dark:border-white/8 bg-white dark:bg-white/5 text-xs text-charcoal dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-chile/20 disabled:cursor-not-allowed"
                  />
                  <span className="text-charcoal/30 dark:text-white/20 text-xs font-bold">
                    —
                  </span>
                  <input
                    type="time"
                    value={day.close}
                    onChange={(e) => setHour(key, "close", e.target.value)}
                    disabled={day.closed}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-cream dark:border-white/8 bg-white dark:bg-white/5 text-xs text-charcoal dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-chile/20 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Toggle cerrado */}
                <button
                  onClick={() => toggleDayClosed(key)}
                  className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    day.closed
                      ? "bg-chile/10 text-chile border border-chile/20"
                      : "bg-cream dark:bg-white/6 text-charcoal/40 dark:text-white/25 border border-cream dark:border-white/8 hover:border-chile/20 hover:text-chile"
                  }`}
                >
                  {day.closed ? "CERRADO" : "Cerrar"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 bg-mostaza/8 dark:bg-mostaza/10 rounded-xl border border-mostaza/15">
          <AlertCircle size={14} className="text-mostaza shrink-0 mt-0.5" />
          <p className="text-[11px] text-charcoal/60 dark:text-white/40">
            Los horarios son informativos. El estado{" "}
            <strong>Abierto/Cerrado</strong> del toggle de arriba controla si se
            aceptan pedidos en tiempo real.
          </p>
        </div>
      </Section>

      {/* ── Botón guardar bottom ── */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-hoja text-white rounded-xl font-bold text-sm hover:bg-hoja/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-hoja/20 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {isSaving ? "Guardando..." : "Guardar todos los cambios"}
        </button>
      </div>
    </div>
  );
}
