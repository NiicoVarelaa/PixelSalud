import wp from "@assets/iconos/whatsapp.png";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const PRE_TEXT =
  "Hola, me gustaría recibir asesoramiento sobre un producto de la farmacia.";

const WhatsAppButton = () => {
  if (!WHATSAPP_NUMBER) {
    console.error(
      "ERROR: VITE_WHATSAPP_NUMBER no está configurado en el .env. Revisar la configuración de Vite.",
    );
    return null;
  }

  const encodedMessage = encodeURIComponent(PRE_TEXT);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
      role="region"
      aria-label="Botón de WhatsApp para atención"
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear con Farmacia por WhatsApp"
        tabIndex={0}
        className={`
          group relative flex items-center justify-center
          rounded-full bg-white shadow-lg border-2 border-green-500
          focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400
          transition-all duration-200
          w-14 h-14 sm:w-16 sm:h-16
          hover:scale-105 active:scale-95
        `}
      >
        <img
          src={wp}
          alt=""
          role="presentation"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          draggable={false}
        />
        <span className="sr-only">Chatear con Farmacia por WhatsApp</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
