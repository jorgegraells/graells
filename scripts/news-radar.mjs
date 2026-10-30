// Radar de última hora: lee feeds RSS/Atom de fuentes fiables y lista lo
// publicado en las últimas horas, ordenado por relevancia para el blog.
// Uso: node scripts/news-radar.mjs [--hours 3]
// Sin dependencias. Lo ejecuta la rutina "radar de noticias" cada 2 horas.

const FEEDS = [
  // Público general en España
  ["INCIBE ciudadanía", "https://www.incibe.es/ciudadania/avisos/feed"],
  ["INCIBE empresas", "https://www.incibe.es/empresas/avisos/feed"],
  ["INCIBE-CERT alerta temprana", "https://www.incibe.es/incibe-cert/alerta-temprana/avisos/feed"],
  // Ciberseguridad
  ["CISA avisos", "https://www.cisa.gov/cybersecurity-advisories/all.xml"],
  ["CISA noticias", "https://www.cisa.gov/news.xml"],
  ["BleepingComputer", "https://www.bleepingcomputer.com/feed/"],
  ["The Hacker News", "https://feeds.feedburner.com/TheHackersNews"],
  ["The Record", "https://therecord.media/feed"],
  ["Krebs on Security", "https://krebsonsecurity.com/feed/"],
  // IA: caídas y anuncios
  ["Estado de Claude", "https://status.claude.com/history.rss"],
  ["Estado de OpenAI", "https://status.openai.com/history.rss"],
  ["OpenAI", "https://openai.com/news/rss.xml"],
  ["Google IA", "https://blog.google/technology/ai/rss/"],
  // Señal temprana
  ["Hacker News (+300)", "https://hnrss.org/frontpage?points=300"],
];

// Pesos orientativos: el agente decide, esto solo ordena la lista
const KEYWORDS = [
  [5, /ransomware|hack(ed|eo|ers?)?\b|breach|brecha|stolen|robo|roban|heist|leak|filtraci[oó]n|exfiltrat/i],
  [4, /phishing|smishing|vishing|scam|estafa|fraude|fraud|suplant|impersonat|deepfake/i],
  [4, /outage|down\b|ca[ií]da|degraded|elevated errors|incident/i],
  [3, /zero-day|0-day|actively exploited|explotad|vulnerab|CVE-\d{4}/i],
  [3, /whatsapp|instagram|gmail|outlook|iphone|android|banco|bank|bizum|correos|dgt|hacienda|seguridad social/i],
  [3, /chatgpt|openai|claude|anthropic|gemini|copilot|\bAI\b|\bIA\b|inteligencia artificial|LLM|agent/i],
  [2, /binance|crypto|bitcoin|cripto/i],
  [2, /AI Act|NIS2|regulat|reglamento|ley |GDPR|RGPD|multa|fine/i],
  [2, /spain|españa|spanish|europ/i],
];

const hoursArg = process.argv.indexOf("--hours");
const HOURS = hoursArg > 0 ? Number(process.argv[hoursArg + 1]) || 3 : 3;
const since = Date.now() - HOURS * 3_600_000;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const decode = (s = "") =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    // Algunos feeds (INCIBE) traen el HTML escapado: se quita también tras decodificar
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tag = (xml, name) => xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"))?.[1];

function parse(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  return blocks.map((b) => {
    const atomLink = b.match(/<link[^>]*href="([^"]+)"/i)?.[1];
    const date = tag(b, "pubDate") ?? tag(b, "published") ?? tag(b, "updated") ?? tag(b, "dc:date");
    return {
      title: decode(tag(b, "title")),
      link: decode(tag(b, "link")) || atomLink || "",
      time: date ? Date.parse(decode(date)) : NaN,
      summary: decode(tag(b, "description") ?? tag(b, "summary") ?? "").slice(0, 220),
    };
  });
}

async function read([source, url]) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml,application/atom+xml,application/xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return { source, error: `HTTP ${res.status}` };
    return { source, items: parse(await res.text()) };
  } catch (e) {
    return { source, error: e.name === "TimeoutError" ? "sin respuesta en 20 s" : e.message };
  }
}

const results = await Promise.all(FEEDS.map(read));
const recent = results
  .flatMap((r) => (r.items ?? []).map((i) => ({ ...i, source: r.source })))
  .filter((i) => i.time >= since)
  .map((i) => {
    const text = `${i.title} ${i.summary}`;
    return { ...i, score: KEYWORDS.reduce((s, [w, re]) => s + (re.test(text) ? w : 0), 0) };
  })
  .sort((a, b) => b.score - a.score || b.time - a.time);

console.log(`Radar: ${recent.length} publicaciones en las últimas ${HOURS} h\n`);
for (const i of recent)
  console.log(
    `[${i.score}] ${i.source} · ${new Date(i.time).toISOString().slice(0, 16).replace("T", " ")} UTC\n    ${i.title}\n    ${i.link}${i.summary ? `\n    ${i.summary}` : ""}\n`,
  );
const failed = results.filter((r) => r.error);
if (failed.length) console.log(`Fuentes sin respuesta: ${failed.map((r) => `${r.source} (${r.error})`).join(", ")}`);
