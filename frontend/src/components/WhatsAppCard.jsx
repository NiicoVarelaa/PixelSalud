import wp from "../assets/iconos/whatsapp.png"; 

const WHATSAPP_NUMBER = "5491112345678"; 

const WhatsAppCard = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:row-span-2 flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group">
    <div className="p-6 md:p-8 flex flex-col items-center justify-center flex-1">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-20"></div>
        <div className="relative rounded-full p-4 border-2 border-primary-700 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <img
            src={wp}
            className="h-12 w-12 md:h-14 md:w-14 "
            alt="Whatsapp"
          />
        </div>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-900">
        ¿Necesitas ayuda?
      </h3>
      <p className="text-gray-700 text-lg text-center mb-8 leading-relaxed">
        Nuestros farmacéuticos están disponibles las 24hs para asesorarte
      </p>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl w-full"
      >
        Chatear por WhatsApp
      </a>
      <p className="text-primary-700 text-sm font-medium mt-4">
        Respuesta inmediata
      </p>
    </div>
  </div>
);

export default WhatsAppCard;