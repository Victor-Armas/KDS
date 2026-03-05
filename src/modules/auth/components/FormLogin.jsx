import React from "react";

export default function FormLogin({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  handleSubmit,
  error,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-chile text-sm text-center bg-chile/10 py-2 rounded-lg">
          {error.message}
        </p>
      )}
      {/* Email */}
      <div>
        <label className="block text-sm text-charcoal mb-1">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          placeholder="correo@ejemplo.com"
          className="w-full px-4 py-3 rounded-xl bg-cream border border-cream focus:outline-none focus:ring-2 focus:ring-hoja transition"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm text-charcoal mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-cream border border-cream focus:outline-none focus:ring-2 focus:ring-hoja transition"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-chile hover:bg-chile/90 text-softwhite font-semibold tracking-wide transition-all duration-300 shadow-lg cursor-pointer"
      >
        {isLoading ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
}
