const nodemailer = require('nodemailer');

// Configura tu transporte SMTP aquí
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
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
    from: process.env.SMTP_FROM || 'PixelSalud <no-reply@pixelsalud.com>',
    to,
    subject: 'Confirmación de recepción de mensaje - PixelSalud',
    html: `<p>Hola <b>${nombre}</b>,</p>
      <p>Hemos recibido tu mensaje con el asunto: <b>${asunto}</b>.</p>
      <p>En breve nuestro equipo se pondrá en contacto contigo. ¡Gracias por comunicarte con PixelSalud!</p>
      <br><p>Este es un mensaje automático, por favor no responder.</p>`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { enviarConfirmacionCliente };
