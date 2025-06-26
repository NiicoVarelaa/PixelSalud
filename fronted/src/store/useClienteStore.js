import axios from "axios";

export const getCliente = async () =>{
    try {
      const usuariosResponse = await axios.get("http://localhost:5000/clientes");
      const usuarios = usuariosResponse.data;
      const usuarioLogueado = usuarios.find((user) => user.logueado === 1);

      if (!usuarioLogueado) {
        console.log("Usuario no encontrado o logueado.");
        return;
      }

      const idCliente = usuarioLogueado.idCliente;
      return idCliente
    } catch (error) {
        console.error("Usuario no encontrado o logueado." + error)
    }
}
