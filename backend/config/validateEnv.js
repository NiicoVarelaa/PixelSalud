const requiredVars = {
  database: ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"],
  server: ["PORT"],
  auth: ["SECRET_KEY"],
  payment: ["MP_ACCESS_TOKEN"],
  urls: ["FRONTEND_URL", "BACKEND_URL"],
  email: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"],
};

const optionalVars = {
  payment: ["MP_WEBHOOK_SECRET"],
};


function validateEnv() {
  const missing = [];
  const warnings = [];

  Object.entries(requiredVars).forEach(([category, vars]) => {
    vars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push({ category, varName });
      }
    });
  });

  Object.entries(optionalVars).forEach(([category, vars]) => {
    vars.forEach((varName) => {
      if (!process.env[varName]) {
        warnings.push({ category, varName });
      }
    });
  });

  if (missing.length > 0) {
    console.error("\n❌ ERROR: Faltan variables de entorno requeridas:\n");

    const grouped = missing.reduce((acc, { category, varName }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(varName);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([category, vars]) => {
      console.error(`📂 ${category.toUpperCase()}:`);
      vars.forEach((varName) => {
        console.error(`   • ${varName}`);
      });
      console.error("");
    });

    console.error("💡 Solución:");
    console.error("   1. Copia el archivo .env.example como .env");
    console.error("   2. Completa las variables faltantes en .env");
    console.error("   3. Reinicia el servidor\n");

    process.exit(1); 
  }

  if (warnings.length > 0) {
    console.warn("\n⚠️  Variables opcionales no configuradas:\n");

    const grouped = warnings.reduce((acc, { category, varName }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(varName);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([category, vars]) => {
      console.warn(`📂 ${category.toUpperCase()}:`);
      vars.forEach((varName) => {
        console.warn(`   • ${varName}`);
      });
    });
    console.warn("");
  }

  validateEmailPort();
  validateJWTSecret();
  validateURLs();

  console.log("✅ Variables de entorno validadas correctamente\n");
}

function validateEmailPort() {
  const port = process.env.SMTP_PORT;
  if (port && !["465", "587", "25"].includes(port)) {
    console.warn(
      `⚠️  SMTP_PORT="${port}" no es un puerto SMTP estándar (465, 587, 25)`,
    );
  }
}

function validateJWTSecret() {
  const secret = process.env.SECRET_KEY;
  if (secret && secret.length < 32) {
    console.warn(
      "⚠️  SECRET_KEY es muy corta (< 32 caracteres). Se recomienda usar una clave más segura.",
    );
    console.warn(
      "   Genera una con: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
  }
}

function validateURLs() {
  const frontendUrl = process.env.FRONTEND_URL;
  const backendUrl = process.env.BACKEND_URL;

  if (frontendUrl && frontendUrl.endsWith("/")) {
    console.warn(
      '⚠️  FRONTEND_URL no debe terminar en "/" (se eliminará automáticamente)',
    );
  }

  if (backendUrl && backendUrl.endsWith("/")) {
    console.warn(
      '⚠️  BACKEND_URL no debe terminar en "/" (se eliminará automáticamente)',
    );
  }

  if (process.env.NODE_ENV === "production") {
    if (frontendUrl && frontendUrl.includes("localhost")) {
      console.warn(
        '⚠️  FRONTEND_URL usa "localhost" en producción. ¿Es correcto?',
      );
    }
    if (backendUrl && backendUrl.includes("localhost")) {
      console.warn(
        '⚠️  BACKEND_URL usa "localhost" en producción. ¿Es correcto?',
      );
    }
  }
}

function printEnvInfo() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 PIXEL SALUD - Configuración del Servidor");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`📊 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Puerto: ${process.env.PORT}`);
  console.log(
    `🗃️  Base de datos: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`,
  );
  console.log(
    `🔐 JWT Secret: ${process.env.SECRET_KEY ? "✓ Configurado" : "✗ Falta"}`,
  );
  console.log(
    `💳 MercadoPago: ${process.env.MP_ACCESS_TOKEN ? "✓ Configurado" : "✗ Falta"}`,
  );
  console.log(`📧 Email SMTP: ${process.env.SMTP_USER || "No configurado"}`);
  console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || "No definida"}`);
  console.log(`🔗 Backend URL: ${process.env.BACKEND_URL || "No definida"}`);

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

module.exports = {
  validateEnv,
  printEnvInfo,
};
