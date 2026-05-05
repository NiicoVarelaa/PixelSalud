import { DatePickerDay } from "@components/molecules";

export const DateInput = ({ id, label, value, onChange }) => {
  return (
    <DatePickerDay
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      labelClassName="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1"
      buttonClassName="w-full h-10 rounded-lg border border-slate-200 bg-gray-50 px-3  text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-green-500"
    />
  );
};
