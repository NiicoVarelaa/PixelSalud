/**
 * Configuración de animaciones con Framer Motion
 * Archivo centralizado para mantener consistencia en todos los componentes
 */

/**
 * Variantes de animación para fade in desde abajo (mobile-first)
 */
export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

/**
 * Variantes para lista de items (stagger children)
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Variantes para items individuales en lista
 */
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Animación de colapso/expansión (accordion)
 */
export const collapseVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
      opacity: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

/**
 * Animación para botones con hover/tap
 */
export const buttonVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * Animación para el badge de filtros activos
 */
export const badgePulse = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/**
 * Transiciones suaves para elementos interactivos
 */
export const smoothTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/**
 * Animación para iconos que rotan (chevron, etc)
 */
export const rotateIcon = (isOpen) => ({
  rotate: isOpen ? 180 : 0,
  transition: { duration: 0.3, ease: "easeInOut" },
});

/**
 * Animación de entrada para el header (mobile-first)
 */
export const headerVariants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Shimmer loading effect para estados de carga
 */
export const shimmerVariants = {
  initial: {
    backgroundPosition: "-1000px 0",
  },
  animate: {
    backgroundPosition: "1000px 0",
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity,
    },
  },
};
