const jwt = require("jsonwebtoken")

const auth = async (req, res , next)=>{
    try {
        const authHeader = req.header("auth") || req.header("authorization");
        console.log('Headers recibidos:', req.headers);
        console.log('Auth header:', authHeader);

        const token = authHeader?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({msg: "Token ausente, acceso denegado"})
        }

        const payload = jwt.verify(token, process.env.SECRET_KEY)
        req.user = payload;
        next()
        
    } catch (error) {
        console.error("Error en middleware auth:", error.name)

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({msg: "Token expirado"})
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({msg: "Token no valido"})
        }

        res.status(500).json({msg:"Server error al validar Token", error})
    }
}

module.exports = auth;
