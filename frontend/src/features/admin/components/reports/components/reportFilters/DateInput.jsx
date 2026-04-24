import Datepicker from "react-tailwindcss-datepicker";

export const DateInput = ({ id, label, value, onChange }) => {
  // El Datepicker requiere un objeto de rango, aunque usemos fecha única
  const dateValue = {
    startDate: value || null,
    endDate: value || null,
  };

  const handleValueChange = (newValue) => {
    // Si el usuario borra la fecha, newValue es null
    onChange(newValue?.startDate || "");
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 text-xs font-semibold text-gray-600"
        >
          {label}
        </label>
      )}

      <Datepicker
        inputId={id}
        i18n={"es"}
        startWeekOn="mon"
        useRange={false}
        asSingle={true}
        value={dateValue}
        onChange={handleValueChange}
        displayFormat="DD/MM/YYYY"
        placeholder="dd/mm/aaaa"
        primaryColor="green" // Utiliza la paleta verde de Tailwind
        popoverDirection="down" // Fuerza a que se abra hacia abajo
        containerClassName="relative w-full"
        inputClassName="w-full min-h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
        toggleClassName="absolute right-0 top-0 h-full px-3 text-gray-400 transition-colors hover:text-green-600 focus:outline-none"
      />
    </div>
  );
};
