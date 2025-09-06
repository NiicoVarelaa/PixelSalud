import React, { useState } from "react";

const ModalFormularioEnvio = ({ isOpen, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    nombreDestinatario: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    referencias: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nombreDestinatario || !form.direccion || !form.ciudad) {
      alert("Por favor completa los campos obligatorios");
      return;
    }
    onConfirm(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Datos de envío</h2>
        <div className="flex flex-col gap-3">
          <input name="nombreDestinatario" placeholder="Nombre del destinatario" onChange={handleChange} className="border p-2 rounded" />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} className="border p-2 rounded" />
          <input name="direccion" placeholder="Dirección" onChange={handleChange} className="border p-2 rounded" />
          <input name="ciudad" placeholder="Ciudad" onChange={handleChange} className="border p-2 rounded" />
          <input name="provincia" placeholder="Provincia" onChange={handleChange} className="border p-2 rounded" />
          <input name="codigoPostal" placeholder="Código Postal" onChange={handleChange} className="border p-2 rounded" />
          <textarea name="referencias" placeholder="Referencias" onChange={handleChange} className="border p-2 rounded" />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-2 bg-primary-700 text-white rounded hover:bg-primary-800"
        >
          Confirmar
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full text-gray-500 hover:underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalFormularioEnvio;
