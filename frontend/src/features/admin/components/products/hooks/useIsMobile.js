import { useState, useEffect } from "react";

/**
 * Custom hook para detectar si estamos en vista móvil
 * @param {number} breakpoint - Ancho en px para considerar móvil (default: 768)
 * @returns {boolean} true si es vista móvil
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    // Inicializar con el valor actual para evitar flash
    return typeof window !== "undefined"
      ? window.innerWidth < breakpoint
      : false;
  });

  useEffect(() => {
    // Handler para actualizar el estado
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Agregar listener
    window.addEventListener("resize", handleResize);

    // Limpiar listener
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};
