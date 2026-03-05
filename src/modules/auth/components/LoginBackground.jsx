import React from "react";

export default function LoginBackground() {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=1974&auto=format&fit=crop)`,
        }}
      />
      <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" />
    </>
  );
}
