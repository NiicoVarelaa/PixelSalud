const authService = require("../services/AuthService");
const clientesService = require("../services/ClientesService");
const cuponesService = require("../services/CuponesService");
const { enviarCuponBienvenida } = require("../helps/EnvioMail");
const { Auditoria } = require("../helps");

const buildFrontendRedirect = (params = {}, options = {}) => {
  const { useGoogleFrontend = false } = options;
  const targetFrontendUrl = useGoogleFrontend
    ? process.env.GOOGLE_FRONTEND_URL || process.env.FRONTEND_URL
    : process.env.FRONTEND_URL;
  const frontendUrl = (targetFrontendUrl || "http://localhost:5173").replace(
    /\/$/,
    "",
  );
  const query = new URLSearchParams(params).toString();
  return `${frontendUrl}/login${query ? `?${query}` : ""}`;
};

const login = async (req, res, next) => {
  try {
    const { email, contrasenia } = req.body;
    const resultado = await authService.login(email, contrasenia);

    await Auditoria.registrarLoginExitoso(
      {
        id: resultado.id,
        email: resultado.email,
        nombre: resultado.nombre,
        apellido: resultado.apellido || "",
        rol: resultado.rol,
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    await Auditoria.registrarLoginFallido(
      req.body.email || "email_no_proporcionado",
      error.message,
      req,
    );

    next(error);
  }
};

const registrarCliente = async (req, res, next) => {
  try {
    const {
      nombreCliente,
      apellidoCliente,
      contraCliente,
      emailCliente,
      dniCliente,
      fechaNacimiento,
    } = req.body;

    const resultado = await clientesService.crearCliente({
      nombreCliente,
      apellidoCliente,
      contraCliente,
      emailCliente,
      dni: dniCliente,
      fechaNacimiento,
    });

    const idCliente = resultado.idCliente || resultado.insertId;

    try {
      const cupon = await cuponesService.crearCuponBienvenida(idCliente);

      await enviarCuponBienvenida(
        emailCliente,
        nombreCliente,
        cupon.codigo,
        cupon.valorDescuento,
        cupon.fechaVencimiento,
      );
    } catch (cuponError) {
      console.error("Error creando cupón de bienvenida:", cuponError.message);
    }

    res.status(201).json({
      mensaje: "Cliente registrado exitosamente",
      idCliente,
    });
  } catch (error) {
    next(error);
  }
};

const startGoogleAuth = async (req, res, next) => {
  try {
    const googleOAuthUrl = process.env.GOOGLE_OAUTH_URL;

    if (googleOAuthUrl && /^https?:\/\//.test(googleOAuthUrl)) {
      return res.redirect(googleOAuthUrl);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return res.status(503).json({
        status: "fail",
        message:
          "Registro con Google no configurado. Define GOOGLE_CLIENT_ID y GOOGLE_REDIRECT_URI en el backend.",
      });
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "select_account");

    return res.redirect(authUrl.toString());
  } catch (error) {
    next(error);
  }
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(
      buildFrontendRedirect(
        {
          oauth_error: "Google no devolvió código de autorización",
        },
        { useGoogleFrontend: true },
      ),
    );
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.redirect(
        buildFrontendRedirect(
          {
            oauth_error: "Falta configuración OAuth de Google en backend",
          },
          { useGoogleFrontend: true },
        ),
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return res.redirect(
        buildFrontendRedirect(
          {
            oauth_error: "No se pudo obtener token de Google",
          },
          { useGoogleFrontend: true },
        ),
      );
    }

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      return res.redirect(
        buildFrontendRedirect(
          {
            oauth_error: "No se pudo obtener perfil de Google",
          },
          { useGoogleFrontend: true },
        ),
      );
    }

    if (profile.email_verified === false) {
      return res.redirect(
        buildFrontendRedirect(
          {
            oauth_error: "El email de Google no está verificado",
          },
          { useGoogleFrontend: true },
        ),
      );
    }

    const authResult = await authService.loginWithGoogle({
      email: profile.email,
      nombre: profile.given_name || profile.name || "Cliente",
      apellido: profile.family_name || "Google",
    });

    await Auditoria.registrarLoginExitoso(
      {
        id: authResult.id,
        email: authResult.email,
        nombre: authResult.nombre,
        apellido: authResult.apellido || "",
        rol: authResult.rol,
      },
      req,
    );

    const encodedPayload = Buffer.from(
      JSON.stringify(authResult),
      "utf8",
    ).toString("base64url");

    return res.redirect(
      buildFrontendRedirect(
        { oauth: encodedPayload },
        { useGoogleFrontend: true },
      ),
    );
  } catch (error) {
    await Auditoria.registrarLoginFallido("google_oauth", error.message, req);

    return res.redirect(
      buildFrontendRedirect(
        {
          oauth_error: "No se pudo completar el acceso con Google",
        },
        { useGoogleFrontend: true },
      ),
    );
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const resultado = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const resultado = await authService.logoutUser(refreshToken);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    const userId = req.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const resultado = await authService.logoutAllSessions(userId);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  registrarCliente,
  startGoogleAuth,
  googleCallback,
  refreshToken,
  logout,
  logoutAll,
};
