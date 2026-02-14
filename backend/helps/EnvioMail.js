const nodemailer = require("nodemailer");

// Configura tu transporte SMTP aquí
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER, // tu email
    pass: process.env.SMTP_PASS, // tu contraseña o app password
  },
  tls: {
    rejectUnauthorized: false, // Permitir certificados autofirmados (solo desarrollo)
  },
});

/**
 * Envía un email de confirmación al cliente
 * @param {string} to - Email del cliente
 * @param {string} nombre - Nombre del cliente
 * @param {string} asunto - Asunto del mensaje original
 */
async function enviarConfirmacionCliente(to, nombre, asunto) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "PixelSalud <no-reply@pixelsalud.com>",
    to,
    subject: "Confirmación de recepción de mensaje - PixelSalud",
    html: `<p>Hola <b>${nombre}</b>,</p>
      <p>Hemos recibido tu mensaje con el asunto: <b>${asunto}</b>.</p>
      <p>En breve nuestro equipo se pondrá en contacto contigo. ¡Gracias por comunicarte con PixelSalud!</p>
      <br><p>Este es un mensaje automático, por favor no responder.</p>`,
  };
  await transporter.sendMail(mailOptions);
}

const enviarCorreoRecuperacion = async (to, nombre, token) => {
  // Ajusta el puerto del frontend si es distinto a 5173
  // IMPORTANTE: Uso '?token=' porque así lo espera tu frontend en useLocation()
  const link = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || "PixelSalud <no-reply@pixelsalud.com>",
    to,
    subject: "Recuperación de Contraseña - PixelSalud",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #16a34a;">Hola ${nombre},</h1>
        <p>Recibimos una solicitud para restablecer tu contraseña en PixelSalud.</p>
        <p>Haz clic en el siguiente botón para crear una nueva clave:</p>
        <div style="margin: 30px 0;">
            <a href="${link}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
        </div>
        <p style="font-size: 12px; color: #666;">Este enlace expira en 1 hora. Si no fuiste tú, simplemente ignora este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Envía un email de confirmación de compra al cliente
 * @param {string} to - Email del cliente
 * @param {string} nombre - Nombre del cliente
 * @param {number} idVentaO - ID de la venta
 * @param {number} totalPago - Total pagado
 * @param {Array} productos - Array de productos comprados
 */
async function enviarConfirmacionCompra(
  to,
  nombre,
  idVentaO,
  totalPago,
  productos,
) {
  const ARSformatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  const productosHTML = productos
    .map(
      (p) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${p.nombreProducto}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${p.cantidad}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${ARSformatter.format(p.precioUnitario)}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
        ${ARSformatter.format(p.cantidad * p.precioUnitario)}
      </td>
    </tr>
  `,
    )
    .join("");

  const mailOptions = {
    from: process.env.SMTP_FROM || "PixelSalud <no-reply@pixelsalud.com>",
    to,
    subject: `✅ Confirmación de Compra #${idVentaO} - PixelSalud`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #16a34a; border-bottom: 3px solid #16a34a; padding-bottom: 10px;">
          ¡Gracias por tu compra!
        </h1>
        
        <p style="font-size: 16px;">Hola <b>${nombre}</b>,</p>
        
        <p>Tu pago se ha procesado exitosamente. A continuación encontrarás los detalles de tu compra:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Orden:</strong> #${idVentaO}</p>
          <p style="margin: 5px 0;"><strong>Estado:</strong> <span style="color: #16a34a;">Pagado ✓</span></p>
          <p style="margin: 5px 0;"><strong>Total:</strong> <span style="font-size: 18px; color: #16a34a; font-weight: bold;">${ARSformatter.format(totalPago)}</span></p>
        </div>

        <h2 style="color: #333; margin-top: 30px;">Productos comprados:</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #16a34a;">Producto</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #16a34a;">Cant.</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #16a34a;">Precio Unit.</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #16a34a;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
          <tfoot>
            <tr style="background-color: #f3f4f6; font-weight: bold;">
              <td colspan="3" style="padding: 15px; text-align: right; font-size: 16px;">TOTAL:</td>
              <td style="padding: 15px; text-align: right; color: #16a34a; font-size: 18px;">
                ${ARSformatter.format(totalPago)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #ecfccb; padding: 15px; border-left: 4px solid #16a34a; margin: 30px 0;">
          <p style="margin: 0; font-size: 14px;">
            <strong>¿Qué sigue?</strong><br>
            Tu pedido está listo para ser retirado en nuestra sucursal. Te esperamos pronto.
          </p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          Este es un mensaje automático, por favor no responder. Si tenés consultas, contactanos a través de nuestro sitio web.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #16a34a; font-weight: bold; font-size: 16px;">¡Gracias por confiar en PixelSalud! ❤️</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  enviarConfirmacionCliente,
  enviarCorreoRecuperacion,
  enviarConfirmacionCompra,
};
