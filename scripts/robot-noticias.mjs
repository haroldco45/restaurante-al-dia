// Robot de noticias — Restaurantes al Día (Vibras Positivas HM)
// Corre en GitHub Actions cada 30 minutos. Busca noticias reales en Google Noticias y Bing Noticias,
// intenta traer la foto real de cada nota (og:image) y guarda data/noticias.json.
// Solo reescribe el archivo cuando hay noticias nuevas, para no generar despliegues de más en Netlify.
// Node 20+, sin dependencias.

import { readFile, writeFile } from 'node:fs/promises';

const ARCHIVO = new URL('../data/noticias.json', import.meta.url);
const MAX = 80;
const DIAS = 365;
const BUSQUEDAS = [
  'cierre restaurantes Medellín',
  'restaurantes cerrados Antioquia',
  'Acodres restaurantes',
  'Acoga gastronomía',
  'sector gastronómico Colombia costos',
  'restaurantes nómina materias primas Colombia',
  'corrientazo precio Medellín',
  'bares y restaurantes Medellín crisis'
];
const CLAVES = ['restaurant', 'gastronom', 'bares', 'acodres', 'acoga', 'corrientazo', 'comida', 'almuerzo', 'cocina', 'chef', 'hamburgues', 'bandeja'];
const UA = 'Mozilla/5.0 (compatible; RestaurantesAlDiaBot/1.0; +https://github.com/haroldco45/restaurante-al-dia)';

const dec = s => (s || '')
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/<[^>]+>/g, '').trim();
const tag = (xml, t) => { const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, 'i')); return m ? dec(m[1]) : ''; };
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

async function traer(url, ms = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'es-CO,es;q=0.9' }, signal: ctrl.signal, redirect: 'follow' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } finally { clearTimeout(t); }
}

function items(xml) { return xml.split(/<item[\s>]/i).slice(1).map(x => x.split(/<\/item>/i)[0]); }

async function google(q) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:30d')}&hl=es-419&gl=CO&ceid=CO:es-419`;
  const xml = await traer(url);
  return items(xml).map(it => {
    const fuente = tag(it, 'source');
    let titulo = tag(it, 'title');
    if (fuente && titulo.endsWith(' - ' + fuente)) titulo = titulo.slice(0, -(fuente.length + 3));
    return { titulo, enlace: tag(it, 'link'), fecha: tag(it, 'pubDate'), fuente, imagen: '' };
  });
}

async function bing(q) {
  const url = `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&setlang=es-CO&cc=CO`;
  const xml = await traer(url);
  return items(xml).map(it => {
    let enlace = tag(it, 'link');
    try { const real = new URL(enlace).searchParams.get('url'); if (real) enlace = real; } catch {}
    const img = (it.match(/<News:Image>([\s\S]*?)<\/News:Image>/i) || [])[1];
    return { titulo: tag(it, 'title'), enlace, fecha: tag(it, 'pubDate'), fuente: tag(it, 'News:Source') || hostname(enlace), imagen: img ? dec(img) : '' };
  });
}

function hostname(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } }

async function fotoReal(enlace) {
  if (!enlace || enlace.includes('news.google.com')) return '';
  try {
    const html = (await traer(enlace, 8000)).slice(0, 200000);
    const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
    return m && /^https?:\/\//.test(m[1]) ? dec(m[1]) : '';
  } catch { return ''; }
}

async function main() {
  let previo = { actualizado: null, noticias: [] };
  try { previo = JSON.parse(await readFile(ARCHIVO, 'utf8')); } catch {}

  const resultados = [];
  for (const q of BUSQUEDAS) {
    for (const fn of [google, bing]) {
      try { const r = await fn(q); resultados.push(...r); console.log(`${fn.name} "${q}": ${r.length}`); }
      catch (e) { console.log(`${fn.name} "${q}" falló: ${e.message}`); }
    }
  }

  const limite = Date.now() - DIAS * 864e5;
  const vistos = new Map();
  for (const n of [...resultados, ...(previo.noticias || [])]) {
    if (!n.titulo || !n.enlace) continue;
    const t = norm(n.titulo);
    if (!CLAVES.some(k => t.includes(k))) continue;
    const ts = Date.parse(n.fecha);
    if (ts && ts < limite) continue;
    const key = t.slice(0, 70);
    const ya = vistos.get(key);
    if (!ya) vistos.set(key, { ...n, fecha: ts ? new Date(ts).toISOString() : n.fecha });
    else if (!ya.imagen && n.imagen) ya.imagen = n.imagen;
  }

  const lista = [...vistos.values()].sort((a, b) => (Date.parse(b.fecha) || 0) - (Date.parse(a.fecha) || 0)).slice(0, MAX);

  // Fotos reales de las notas más recientes que aún no tienen
  let intentos = 0;
  for (const n of lista) {
    if (n.imagen || intentos >= 20) continue;
    intentos++;
    n.imagen = await fotoReal(n.enlace);
  }

  const antes = new Set((previo.noticias || []).map(n => norm(n.titulo).slice(0, 70)));
  const nuevas = lista.filter(n => !antes.has(norm(n.titulo).slice(0, 70))).length;
  const fotosNuevas = lista.some(n => n.imagen && !(previo.noticias || []).some(p => p.enlace === n.enlace && p.imagen === n.imagen));

  if (!nuevas && !fotosNuevas && previo.actualizado) {
    console.log('Sin noticias nuevas. No se reescribe el archivo.');
    return;
  }
  const salida = { actualizado: new Date().toISOString(), zona: 'America/Bogota', total: lista.length, noticias: lista };
  await writeFile(ARCHIVO, JSON.stringify(salida, null, 2) + '\n');
  console.log(`Guardadas ${lista.length} noticias (${nuevas} nuevas).`);
}

main().catch(e => { console.error(e); process.exit(1); });
