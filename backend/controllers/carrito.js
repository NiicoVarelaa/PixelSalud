const { conection } = require("../config/database");

/* Obtengo el carrito por id de cliente */
const getCarrito = (req, res) => {
  const id = req.params.idCliente;
  const consulta = "select * from carrito where idCliente =?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al obtener el producto" });
    }

    res.json(results); // <- Esto está bien aunque esté vacío
  });
};

/* Elimino/saco del carrito los productos que el usuario ya no desee */
const deleteCarrito = (req, res) => {

  const id = req.params.idProducto;
  const consulta = "delete from carrito where idProducto =?";

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al obtener el producto" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Productos no encontrados" });
    }
    res.json(results);
  });
};
// para vaciar el carrito una vez realizada la compra
const vaciarCarrito = (req,res) =>{
  const id = req.params.idCliente;
  const consulta = "delete from carrito where idCliente=?"

  conection.query(consulta, [id], (err,results)=>{
    if (err) {
       console.error("Error al vaciar el carrito:", err);
      return res.status(500).json({ error: "Error al vaciar el carrito" });
    }
     return res.status(201).json({ message: "Productos eliminado correctamente" });
  })
}


const incrementCarrito = (req,res)=>{
  idProducto= req.params.idProducto
  const consulta = "update productos set cantidad = cantidad + 1 where idproducto = ?"

  conection.query(consulta,[idProducto], (err, results)=>{
    if(err){
      console.error("Error al querer aumentar la cantidad", err)
      return res.status(500).json({error:"Error al querer aumentar la cantidad del producto"})
    }res.status(201).json({ message: 'Se aumento correctamente la cantidad del producto'});
  })

}

const decrementCarrito = (req,res)=>{
  idProducto= req.params.idProducto
  const consulta = "update productos set cantidad = cantidad - 1 where idproducto = ? "

  conection.query(consulta,[idProducto], (err, results)=>{
    if(err){
      console.error("Error al querer disminuir la cantidad", err)
      return res.status(500).json({error:"Error al querer disminuir la cantidad del producto"})
    }res.status(201).json({ message: 'Se disminuyo correctamente la cantidad del producto'});
  })

}


/* Agrego producto al carrito */
const addCarrito = (req,res)=>{

    const {idProducto, idCliente} = req.body
    const consulta = 'insert into Carrito (idProducto,idCliente) values (?,?)'

    conection.query(consulta,[idProducto, idCliente], (err, results)=>{
        if(err){
            console.error("Error al agregar el producto al carrito",err);
            return res.status(500).json({error:"Error al agregar el producto al carrito"})
        }
        res.status(201).json({ message: 'Producto agregado correctamente al carrito'});
    })
}

module.exports= {
    addCarrito,
    getCarrito,
    deleteCarrito, 
    incrementCarrito,
    decrementCarrito,
    vaciarCarrito
}