"use client";

import { Analytics } from "@vercel/analytics/next";

/** Visitas agregadas de la web, sin cookies. Las políticas de Flypet y ANTIDOP
 *  presumen de no medir nada, así que sus páginas quedan fuera aunque hablen solo de la app. */
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) =>
        /\/(flypet|antidop)(\/|$)/.test(new URL(event.url).pathname) ? null : event
      }
    />
  );
}
