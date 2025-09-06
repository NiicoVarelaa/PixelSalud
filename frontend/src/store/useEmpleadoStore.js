import axios from "axios";

export const getEmpleado = async () => {
  try {
    const EmpleadosResponse = await axios.get("http://localhost:5000/Empleados");
    const Empleados = EmpleadosResponse.data;
    const EmpleadoLogueado = Empleados.find((user) => user.logueado === 1);

    if (!EmpleadoLogueado) {
      console.log("Empleado no encontrado o no logueado.");
      return null;
    }

    const idEmpleado = EmpleadoLogueado.idEmpleado;
    return idEmpleado;
  } catch (error) {
    console.error("Error al obtener el empleado logueado:", error);
    return null;
}
};