import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiClient from "@utils/apiClient";
import Header from "@features/public/components/navigation/Header";
import Footer from "@features/public/components/footer/Footer";

const NewsletterBaja = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Procesando tu solicitud...");

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("El enlace de desuscripción es inválido.");
        return;
      }

      try {
        const response = await apiClient.get(
          `/newsletter/baja?token=${encodeURIComponent(token)}`,
        );

        setStatus("success");
        setMessage(response.data?.message || "Te desuscribiste correctamente.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message ||
            "No pudimos procesar la desuscripción. El enlace puede haber expirado.",
        );
      }
    };

    run();
  }, [token]);

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>

          <p
            className={`mt-4 text-base ${
              status === "success" ? "text-green-700" : "text-gray-700"
            }`}
          >
            {status === "loading" ? "Procesando..." : message}
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsletterBaja;
