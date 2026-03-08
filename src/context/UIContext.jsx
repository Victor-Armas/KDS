import React, { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  // En desktop suele empezar abierto (true), en móvil cerrado.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <UIContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
