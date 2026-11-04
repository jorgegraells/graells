"use client";

import { Analytics } from "@vercel/analytics/next";

/** Visitas agregadas de la web, sin cookies. La política de Flypet presume de no
 *  medir nada, así que sus páginas quedan fuera aunque hable solo de la app. */
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) =>
        new URL(event.url).pathname.includes("/flypet") ? null : event
      }
    />
  );
}
