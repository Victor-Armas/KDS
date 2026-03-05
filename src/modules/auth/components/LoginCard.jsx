import React from "react";
import FormLogin from "./FormLogin";

export default function LoginCard({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  handleSubmit,
  error,
}) {
  return (
    <div className="bg-softwhite/95 rounded-2xl shadow-2xl p-8 border border-cream">
      <h2 className="text-2xl font-serif text-charcoal text-center mb-6">
        Iniciar sesión
      </h2>

      <FormLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}
