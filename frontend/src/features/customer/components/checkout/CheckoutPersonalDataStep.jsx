import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FiCalendar,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";

const today = new Date();
const isoToday = today.toISOString().split("T")[0];

const personalDataSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electronico es obligatorio")
    .email("El correo electronico no es valido"),
  nombre: z
    .string()
    .min(2, "El nombre es obligatorio")
    .max(50, "El nombre no puede superar 50 caracteres"),
  apellido: z
    .string()
    .min(2, "El apellido es obligatorio")
    .max(50, "El apellido no puede superar 50 caracteres"),
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine(
      (value) => value <= isoToday,
      "La fecha de nacimiento no puede ser futura",
    ),
  dni: z.string().regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 digitos"),
  celular: z.string().regex(/^[+\d\s()-]{8,20}$/, "Ingresa un celular valido"),
  aceptaTyC: z
    .boolean()
    .refine(Boolean, "Debes aceptar Terminos y condiciones"),
});

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus-visible:border-primary-600 focus-visible:ring-1 focus-visible:ring-primary-600/50";

const CheckoutPersonalDataStep = ({ defaultValues, onContinue }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalDataSchema),
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onFormError = () => {
    toast.error("Completa los campos obligatorios para continuar");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-slate-50 p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">Datos personales</h2>
        <p className="mt-1 text-sm text-slate-600">
          Te pedimos unicamente la informacion importante para terminar la
          compra.
        </p>
      </header>

      <form
        className="space-y-5 p-5 md:p-6"
        onSubmit={handleSubmit(onContinue, onFormError)}
        noValidate
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <FiMail className="h-4 w-4 text-primary-700" />
            Email
            <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputClassName}
            placeholder="tuemail@ejemplo.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="nombre"
              className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <FiUser className="h-4 w-4 text-primary-700" />
              Nombres
              <span className="text-red-600">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              className={inputClassName}
              placeholder="Tu nombre"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="mt-1 text-xs text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="apellido"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Apellido
              <span className="ml-1 text-red-600">*</span>
            </label>
            <input
              id="apellido"
              type="text"
              className={inputClassName}
              placeholder="Tu apellido"
              {...register("apellido")}
            />
            {errors.apellido && (
              <p className="mt-1 text-xs text-red-600">
                {errors.apellido.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label
              htmlFor="fechaNacimiento"
              className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <FiCalendar className="h-4 w-4 text-primary-700" />
              Fecha de nacimiento
              <span className="text-red-600">*</span>
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              max={isoToday}
              className={inputClassName}
              {...register("fechaNacimiento")}
            />
            {errors.fechaNacimiento && (
              <p className="mt-1 text-xs text-red-600">
                {errors.fechaNacimiento.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dni"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
                
              Numero de documento
              <span className="ml-1 text-red-600">*</span>
            </label>
            <input
              id="dni"
              type="text"
              inputMode="numeric"
              className={inputClassName}
              placeholder="Ej: 40531984"
              {...register("dni")}
            />
            {errors.dni && (
              <p className="mt-1 text-xs text-red-600">{errors.dni.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="celular"
              className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <FiPhone className="h-4 w-4 text-primary-700" />
              Telefono/Celular
              <span className="text-red-600">*</span>
            </label>
            <input
              id="celular"
              type="tel"
              className={inputClassName}
              placeholder="3811234567"
              {...register("celular")}
            />
            {errors.celular && (
              <p className="mt-1 text-xs text-red-600">
                {errors.celular.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="aceptaTyC"
            className="flex items-start gap-2 text-sm text-slate-700"
          >
            <input
              id="aceptaTyC"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              {...register("aceptaTyC")}
            />
            <span>
              Estoy de acuerdo y acepto los{" "}
              <Link
                to="/terminos-condiciones"
                className="font-semibold text-primary-700 underline decoration-primary-700 underline-offset-2"
              >
                Terminos y condiciones
              </Link>
              ,{" "}
              <Link
                to="/terminos-condiciones"
                className="font-semibold text-primary-700 underline decoration-primary-700 underline-offset-2"
              >
                Politica de privacidad
              </Link>{" "}
              y{" "}
              <Link
                to="/terminos-condiciones"
                className="font-semibold text-primary-700 underline decoration-primary-700 underline-offset-2"
              >
                Bases y condiciones
              </Link>
              .
            </span>
          </label>
          {errors.aceptaTyC && (
            <p className="mt-1 text-xs text-red-600">
              {errors.aceptaTyC.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-primary-700 cursor-pointer"
        >
          <FiCheckCircle className="h-5 w-5" />
          Continuar
        </button>
      </form>
    </section>
  );
};

export default CheckoutPersonalDataStep;
