import { Link } from "react-router-dom";
import { ShoppingCart, CreditCard, Calendar, ArrowRight, Shield, Truck, Clock, Star } from "lucide-react";
import { useState } from "react";

const BannerInfo = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      icon: ShoppingCart,
      title: "¿Cómo comprar?",
      description: "Guía paso a paso para tus compras",
      linkText: "Enterate acá",
      href: "/Error404",
      color: "primary",
      badge: "Fácil"
    },
    {
      id: 2,
      icon: CreditCard,
      title: "Medios de pago",
      description: "Múltiples opciones disponibles",
      linkText: "Ver más",
      href: "/Error404",
      color: "secondary",
      badge: "12 cuotas"
    },
    {
      id: 3,
      icon: Calendar,
      title: "Retirá tu pedido gratis",
      description: "En +50 sucursales",
      linkText: "Ver puntos",
      href: "/Error404",
      color: "primary",
      badge: "Sin costo"
    },
    {
      id: 4,
      icon: Truck,
      title: "Envíos express",
      description: "Entrega en 24/48hs",
      linkText: "Ver zonas",
      href: "/Error404",
      color: "secondary",
      badge: "Rápido"
    }
  ];

  const getColorClasses = (color, ) => {
    const baseClasses = {
      primary: {
        bg: "bg-primary-100",
        hoverBg: "bg-primary-200",
        icon: "text-primary-700",
        text: "text-primary-700",
        gradient: "from-primary-500 to-primary-600",
        badge: "bg-primary-500 text-white"
      },
      secondary: {
        bg: "bg-secondary-100",
        hoverBg: "bg-secondary-200",
        icon: "text-secondary-700",
        text: "text-secondary-700",
        gradient: "from-secondary-500 to-secondary-600",
        badge: "bg-secondary-500 text-white"
      }
    };
    
    return baseClasses[color];
  };

  return (
    <div className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-bold py-2 px-4 rounded-full mb-4">
            <Shield className="h-4 w-4" />
            Compra 100% Segura
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tu experiencia de compra
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Más fácil y segura
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Todo lo que necesitás para comprar con confianza y tranquilidad
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => {
            const colors = getColorClasses(feature.color, hoveredCard === feature.id);
            const IconComponent = feature.icon;

            return (
              <div
                key={feature.id}
                className="relative group"
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-500 h-full flex flex-col ${
                  hoveredCard === feature.id 
                    ? 'shadow-2xl transform -translate-y-2 border-primary-300' 
                    : 'hover:shadow-xl'
                }`}>
                  
                  {/* Badge */}
                  <div className={`inline-flex items-center gap-1 text-xs font-bold py-1 px-3 rounded-full mb-4 ${colors.badge}`}>
                    <Star className="h-3 w-3" fill="currentColor" />
                    {feature.badge}
                  </div>

                  {/* Icon Container */}
                  <div className={`p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-5 transition-all duration-300 ${
                    hoveredCard === feature.id ? colors.hoverBg : colors.bg
                  } group-hover:scale-110`}>
                    <IconComponent className={`h-8 w-8 ${colors.icon}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Link */}
                  <Link
                    to={feature.href}
                    className={`inline-flex items-center gap-2 font-semibold ${
                      colors.text
                    } group/link transition-all duration-300 mt-auto pt-4 border-t border-gray-100`}
                  >
                    <span>{feature.linkText}</span>
                    <ArrowRight className={`h-4 w-4 transform transition-transform duration-300 ${
                      hoveredCard === feature.id ? 'translate-x-1' : 'group-hover/link:translate-x-1'
                    }`} />
                  </Link>
                </div>

                {/* Background Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}></div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Bar */}
        <div className="mt-10 md:mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Atención personalizada</p>
                <p className="text-primary-100 text-sm">Asesoramiento profesional 24/7</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Garantía de calidad</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span>Devoluciones fáciles</span>
              </div>
            </div>

            <Link
              to="/ayuda"
              className="bg-white text-primary-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Centro de Ayuda
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-gray-200">
          {[
            { text: "Pagos seguros", icon: Shield },
            { text: "Envíos a todo el país", icon: Truck },
            { text: "Soporte 24/7", icon: Clock }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-600 text-sm">
              <item.icon className="h-4 w-4 text-primary-600" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Efectos decorativos de fondo */}
      <div className="absolute left-10 top-1/4 w-20 h-20 bg-primary-200 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute right-10 bottom-1/4 w-16 h-16 bg-secondary-200 rounded-full blur-2xl opacity-30 -z-10"></div>
    </div>
  );
};

export default BannerInfo;