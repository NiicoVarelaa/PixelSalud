const util = require("util");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { conection } = require("../config/database");


const query = util.promisify(conection.query).bind(conection);

const login = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;

    if (!email || !contrasenia) {
      return res
        .status(400)
        .json({ error: "El campo email o contraseña está vacío"});
    }

    const consultaAdmin = `
      SELECT idAdmin AS id, nombreAdmin AS nombre, 
             emailAdmin AS email, contraAdmin AS contra, rol
      FROM Admins WHERE emailAdmin = ? AND activo = TRUE
    `;

    const consultaMedico = `
      SELECT idMedico AS id, nombreMedico AS nombre, apellidoMedico AS apellido, 
             emailMedico AS email, contraMedico AS contra
             /* Asumiendo que no tiene columna 'rol' */
      FROM Medicos WHERE emailMedico = ?
    `;

    const consultaEmp = `
      SELECT idEmpleado AS id, nombreEmpleado AS nombre, apellidoEmpleado AS apellido, 
             emailEmpleado AS email, contraEmpleado AS contra, rol
      FROM Empleados WHERE emailEmpleado = ? AND activo = TRUE
    `;

    const consultaCli = `
      SELECT idCliente AS id, nombreCliente AS nombre, apellidoCliente AS apellido, 
             emailCliente AS email, contraCliente AS contra, rol, dni
      FROM Clientes WHERE emailCliente = ?
    `;

    let user = null;
    let tipo = ""; 



 
    const admins = await query(consultaAdmin, [email]);
    if (admins.length > 0) {
      user = admins[0];
      tipo = "admin";
    } else {
      
      const medicos = await query(consultaMedico, [email]);
      if (medicos.length > 0) {
        user = medicos[0];
        tipo = "medico";
      } else {
        
        const empleados = await query(consultaEmp, [email]);
        if (empleados.length > 0) {
          user = empleados[0];
          tipo = "empleado";
        } else {
         
          const clientes = await query(consultaCli, [email]);
          if (clientes.length > 0) {
            user = clientes[0];
            tipo = "cliente";
          }
        }
      }
    }


    if (!user) {
      return res.status(400).json({ msg: "Email y/o contraseña incorrectos" });
    }
    console.log("Login - user encontrado:", user);

    const passCheck = await bcryptjs.compare(contrasenia, user.contra);
    if (!passCheck) {
      return res.status(400).json({ msg: "Email y/o contraseña incorrectos" });
    }


    let permisos = null;
    if (tipo === "admin") {
      const consultaPermisos = "SELECT * FROM Permisos WHERE idAdmin = ? AND idEmpleado IS NULL";
      const permisosData = await query(consultaPermisos, [user.id]);
      if (permisosData.length > 0) {
        permisos = {
          crear_productos: permisosData[0].crear_productos,
          modificar_productos: permisosData[0].modificar_productos,
          modificar_ventasE: permisosData[0].modificar_ventasE,
          modificar_ventasO: permisosData[0].modificar_ventasO,
          ver_ventasTotalesE: permisosData[0].ver_ventasTotalesE,
          ver_ventasTotalesO: permisosData[0].ver_ventasTotalesO
        };
      }
    } else if (tipo === "empleado") {
      const consultaPermisos = "SELECT * FROM Permisos WHERE idEmpleado = ? AND idAdmin IS NULL";
      const permisosData = await query(consultaPermisos, [user.id]);
      console.log("PERMISOS ENCONTRADOS (Empleado):", permisosData)
      if (permisosData.length > 0) {
        permisos = {
          crear_productos: permisosData[0].crear_productos,
          modificar_productos: permisosData[0].modificar_productos,
          modificar_ventasE: permisosData[0].modificar_ventasE,
          modificar_ventasO: permisosData[0].modificar_ventasO,
          ver_ventasTotalesE: permisosData[0].ver_ventasTotalesE,
          ver_ventasTotalesO: permisosData[0].ver_ventasTotalesO
        };
      }
    }
    
    const role = user.rol ? user.rol : tipo;

    const payload = {
      id: user.id,
      role: role,
      permisos: permisos, 
    };

    
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    // Incluir dni solo si es cliente
    const extra = {};
    if (tipo === "cliente" && user.dni) {
      extra.dni = user.dni;
    }
    return res.status(200).json({
      msg: "Inicio de sesión exitoso",
      tipo, 
      token,
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido || "",
      permisos: permisos,
      rol: payload.role,
      ...extra
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Server error", error });
  }
};

module.exports = { login };

