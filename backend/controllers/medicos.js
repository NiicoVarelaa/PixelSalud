const util = require("util")
const conection = require("../config/database")
const bcryptjs = require("bcryptjs")

const query = util.promisify(conection.query).bind(conection);

const getMedicos = (req, res)=>{
    const consulta = "select * from medicos"
    conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener los medicos:", err);
      return res.status(500).json({ error: "Error al obtener los medicos" });
    }
    if (results.length===0) {
      return res.status(404).json({error:"No hay medicos creados"})
    }
    res.status(200).json(results);
  });
}

const getMedicoBajados = (req, res)=>{
    const consulta = "select * from where activo = false"
       conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener los medicos:", err);
      return res.status(500).json({ error: "Error al obtener los medicos" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No hay medicos dados de baja" });
    }
    res.json(results);
  });
}

const getMedico = (req, res)=>{
    const id = req.params.id
    const consulta = "select * from medicos where idMedico = ?"

   conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el medico:", err);
      return res.status(500).json({ error: "Error al obtener el medico" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Medico no encontrado" });
    }
    res.json(results[0]);
  });
}

const createMedico = async (req, res)=>{
    const {nombreMedico, apellidoMedico, matricula, emailMedico, contraMedico} = req.body;
    const exist = "select * from medicos where emailMedico = ? or matricula = ?"

    const existMedico = await query(exist, [emailMedico, matricula])
    if (existMedico[0]) {
         return res
      .status(409)
      .json({ error: "El Medico que intentas crear, ya se encuentra creado" });
    }

    let salt = await bcryptjs.genSalt(10);
    let contraEncrip = await bcryptjs.hash(contraMedico, salt);

    const consulta = "insert into medicos (nombreMedico, apellidoMedico, matricula, emailMedico, contraMedico) values (?,?,?,?,?)"

    conection.query(consulta, [nombreMedico, apellidoMedico, matricula, emailMedico, contraEncrip],(error,results)=>{
        if (error) {
          console.error("Error al crear el medico:", error);
          return res.status(500).json({ error: "Error al crear el medico" });
        }
        res.status(201).json({ message: "Medico creado correctamente" });
    })
    
}


const 