import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El formulario del boletín es de cliente y solo enseña "Avisos urgentes" si la
  // lista de avisos de Brevo existe. Aquí va solo un interruptor ("1" o ""), nunca
  // ids ni claves. Docs: next.config.js > env.
  env: {
    NEWSLETTER_ALERTS: process.env.BREVO_LIST_ES_ALERTS ? "1" : "",
  },
};

export default nextConfig;
