const util = require("util");
const { conection } = require("../config/database");
const bcryptjs = require("bcryptjs");

const query = util.promisify(conection.query).bind(conection);

// controllers/empleados.js

const getEmpleados = (req, res) => {
  // Quitamos el "WHERE e.activo = true" para que traiga TODOS
  const consulta = `
    SELECT e.*, 
           p.crear_productos, 
           p.modificar_productos, 
           p.modificar_ventasE, 
           p.ver_ventasTotalesE 
    FROM Empleados e
    LEFT JOIN Permisos p ON e.idEmpleado = p.idEmpleado
  `;

  conection.query(consulta, (err, results) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener empleados" });
    }
    res.status(200).json({ msg: "Exito", results });
  });
};


const getEmpleadosBajados = (req, res)=>{
  const consulta = "select * from empleados where activo = false"
   conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los empleados dados de baja:", err);
      return res.status(500).json({ error: "Error al obtener los empleados dados de baja" });
    }
    if (results.length === 0) {
        return res.status(404).json({ error: "No hay empleados dados de baja" });
    }
    res.status(200).json(results);
  });
}

const getEmpleado = (req, res)=>{
  const id = req.params.id
  const consulta = "select * from empleados where idEmpleado=?"
  conection.query(consulta,[id],(err,results)=>{
    if (err) {
      console.error("Error al obtener empleado:", err);
      return res.status(500).json({ error: "Error al obtener empleado" });
    }
    
    res.status(200).json(results);
  })
}

const createEmpleado = async (req, res) => {
  // 1. Recibimos 'dniEmpleado' y 'permisos'
  const { nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, contraEmpleado, permisos } = req.body;

  try {
      let salt = await bcryptjs.genSalt(10);
      let contraEncrip = await bcryptjs.hash(contraEmpleado, salt);

      // Verificar si existe
      const existQuery = "SELECT * FROM Empleados WHERE emailEmpleado = ? OR dniEmpleado = ?";
      
      conection.query(existQuery, [emailEmpleado, dniEmpleado], (err, results) => {
          if (err) return res.status(500).json({ error: "Error al verificar datos" });
          if (results.length > 0) return res.status(409).json({ error: "El email o DNI ya está registrado" });

          // 2. Insertar Empleado (Incluyendo dniEmpleado)
          const insertEmpQuery = "INSERT INTO Empleados (nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, contraEmpleado, activo) VALUES (?, ?, ?, ?, ?, 1)";
          
          conection.query(insertEmpQuery, [nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, contraEncrip], (err, resultEmp) => {
              if (err) {
                  console.error("Error creando empleado:", err);
                  return res.status(500).json({ error: "Error al crear empleado" });
              }

              const idNuevoEmpleado = resultEmp.insertId;

              // 3. Insertar Permisos (Si se enviaron)
              if (permisos) {
                  const insertPermisos = `
                      INSERT INTO Permisos (idEmpleado, crear_productos, modificar_productos, modificar_ventasE, ver_ventasTotalesE) 
                      VALUES (?, ?, ?, ?, ?)
                  `;
                  
                  conection.query(insertPermisos, [
                      idNuevoEmpleado, 
                      permisos.crear_productos, 
                      permisos.modificar_productos, 
                      permisos.modificar_ventasE, 
                      permisos.ver_ventasTotalesE
                  ], (err) => {
                      if (err) console.error("Error guardando permisos (pero el empleado se creó):", err);
                      res.status(201).json({ message: "Empleado y permisos creados correctamente" });
                  });
              } else {
                  res.status(201).json({ message: "Empleado creado correctamente (sin permisos definidos)" });
              }
          });
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error del servidor" });
  }
};

const updateEmpleado = async (req, res) => {
  const id = req.params.id;
  const { nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, contraEmpleado, permisos } = req.body;

  try {
    // --- LÓGICA DE SEGURIDAD DE CONTRASEÑA Y DNI ---
    let queryEmp = "";
    let paramsEmp = [];

    // Si escribe contraseña nueva
    if (contraEmpleado && contraEmpleado.trim().length > 0) {
        const salt = await bcryptjs.genSalt(10);
        const contraEncrip = await bcryptjs.hash(contraEmpleado, salt);
        
        queryEmp = "UPDATE Empleados SET nombreEmpleado=?, apellidoEmpleado=?, dniEmpleado=?, emailEmpleado=?, contraEmpleado=? WHERE idEmpleado=?";
        paramsEmp = [nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, contraEncrip, id];
    } else {
        // Si NO escribe contraseña
        queryEmp = "UPDATE Empleados SET nombreEmpleado=?, apellidoEmpleado=?, dniEmpleado=?, emailEmpleado=? WHERE idEmpleado=?";
        paramsEmp = [nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, id];
    }
    // -----------------------------------------

    // 1. Ejecutar update de empleado
    await new Promise((resolve, reject) => {
        conection.query(queryEmp, paramsEmp, (err) => err ? reject(err) : resolve());
    });

    // 2. Actualizar Permisos (Si vienen)
    if (permisos) {
        const queryPermisos = `
            UPDATE Permisos SET 
            crear_productos=?, modificar_productos=?, modificar_ventasE=?, ver_ventasTotalesE=?
            WHERE idEmpleado=?
        `;
        await new Promise((resolve, reject) => {
            conection.query(queryPermisos, [
                permisos.crear_productos ? 1 : 0,
                permisos.modificar_productos ? 1 : 0,
                permisos.modificar_ventasE ? 1 : 0,
                permisos.ver_ventasTotalesE ? 1 : 0,
                id
            ], (err) => err ? reject(err) : resolve());
        });
    }

    res.status(200).json({ message: "Empleado actualizado correctamente" });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar empleado" });
  }
};

const darBajaEmpleado = (req, res) => {
  const id = req.params.id;
  const consulta = "update empleados set activo = false where idEmpleado=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al eliminar/dar de baja al empleado:", err);
      return res.status(500).json({ error: "Error al eliminar/dar de baja al empleado" });
    }
    res.status(201).json({ message: "Empleado dado de baja/eliminado con exito" });
  });
};

const reactivarEmpleado = (req, res) => {
  const id = req.params.id;
  const consulta = "update empleados set activo = true where idEmpleado=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al reactivar al empleado:", err);
      return res.status(500).json({ error: "Error al reactivar al empleado" });
    }
    res.status(201).json({ message: "Empleado reactivado con exito" });
  });
};

module.exports = {
  getEmpleados,
  getEmpleadosBajados,
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  darBajaEmpleado,
  reactivarEmpleado
};