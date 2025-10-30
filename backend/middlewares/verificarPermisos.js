const verificarRol =(rolesPermitidos)=>{
    return (req, res, next)=>{
        if (!req.user || !rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({msg: "Acceso prohibido. No tienes el rol necesario"})
        }

        next();
    }
}

const verificarPermisos = (permisoRequerido)=>{
    return (req, res , next)=>{
        if (!req.user || !req.user.permisos || !req.user.permisos[permisoRequerido]) {
            return res.status(403).json({msg:`Acceso prohibido. Se requiere el permiso: [${permisoRequerido}]`})
        }
    }
    next();
}

module.exports = {
    verificarRol,
    verificarPermisos
}