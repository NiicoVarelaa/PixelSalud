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

const enviarCorreoRecuperacion = async (to, nombre, token) => {
  // Ajusta el puerto del frontend si es distinto a 5173
  // IMPORTANTE: Uso '?token=' porque así lo espera tu frontend en useLocation()
  const link = `http://localhost:5173/reset-password?token=${token}`; 

  const mailOptions = {
    from: process.env.SMTP_FROM || 'PixelSalud <no-reply@pixelsalud.com>',
    to,
    subject: 'Recuperación de Contraseña - PixelSalud',
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
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = { 
    enviarConfirmacionCliente, 
    enviarCorreoRecuperacion 
};
