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
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <span
          className="absolute inline-flex h-full w-full rounded-full 
                               bg-green-400 opacity-25 animate-ping"
          style={{ animationDuration: "2s" }}
          aria-hidden="true"
        ></span>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex p-3 rounded-full 
                               bg-white shadow-xl transition-all duration-300 
                               transform hover:scale-110 focus:outline-none 
                               focus:ring-4 focus:ring-green-400 border-2 border-green-500"
          aria-label="Chatear con Farmacia por WhatsApp"
        >
          <img
            src={wp}
            alt="WhatsApp Chat"
            className="w-9 h-9 md:w-11 md:h-11 object-contain"
          />
        </a>
      </div>
    </div>
  );
};

export default WhatsAppButton;
