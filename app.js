/* Restaurantes al Día — Vibras Positivas HM
   Hora real de Colombia (America/Bogota), búsqueda en vivo al abrir,
   sección Hoy que se recalcula en cada visita y noticias del robot (GitHub Actions cada 30 min). */
(function () {
  'use strict';

  var TZ = 'America/Bogota';
  var LIVE_QUERIES = [
    'cierre restaurantes Medellín',
    'restaurantes Antioquia cierres',
    'Acodres restaurantes',
    'Acoga gastronomía Medellín',
    'sector gastronómico Colombia costos'
  ];
  var FALLBACK_IMGS = [
    'https://images.pexels.com/photos/16740980/pexels-photo-16740980.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/15837093/pexels-photo-15837093.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/37024910/pexels-photo-37024910.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/37597786/pexels-photo-37597786.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/38308504/pexels-photo-38308504.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/36921556/pexels-photo-36921556.png?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/37025262/pexels-photo-37025262.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/29465176/pexels-photo-29465176.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/17264447/pexels-photo-17264447.jpeg?auto=compress&cs=tinysrgb&w=900'
  ];
  var PAGE = 9;

  /* ---------- Idioma ---------- */
  var EN = {
    brandSub: 'Vibras Positivas HM', navHoy: 'Today', navCifras: 'Numbers', navCalc: 'Calculator', navNoticias: 'News',
    refresh: 'Refresh', tickerLabel: 'Breaking', tickerLoading: 'Searching live news...',
    heroKicker: 'Citizen tracker · Medellín and Antioquia · 2026', heroTitle: 'Tables at risk',
    heroLead: 'Ingredients and payroll are eating up restaurant sales. Here are the numbers, the causes and what is happening today.',
    hs1: 'closures in Antioquia, Jan–Sep 2026', hs2: 'openings in the same period', hs3: 'of every sale goes to supplies and payroll', hs4: 'annual inflation in Medellín (Sep)',
    clockLabel: 'Colombia time',
    hoyEyebrow: 'Updates every time you open it', hoyTitle: 'Today', statusIdle: 'Getting the live search ready...',
    ojoEyebrow: 'A closer look', ojoTitle: 'Careful: there are three different numbers',
    ojoLead: 'The story mixes figures with different scopes. They are not the same and should not be compared with each other.',
    t1h: 'Medellín', t1p: 'The headline figure: closures in the city so far this year.',
    t2h: 'Antioquia', t2p: 'The infographic figure: restaurants and bars closed across the whole department from January to September.',
    t3h: 'Colombia', t3p: 'Restaurants cancelled nationwide this year, according to the Medellín Chamber of Commerce and Acoga.',
    ojoNote: 'If someone tells you "802 restaurants closed in Medellín", they are mixing data: 802 is Antioquia.',
    cifEyebrow: 'The numbers', cifTitle: 'Not a collapse: a slowdown',
    cifLead: 'In 2026 more restaurants open than close. What is falling is the opening of new businesses, and the net gain is shrinking.',
    c1title: 'Restaurants and bars in Antioquia', aperturas: 'Openings', cierres: 'Closures',
    y2025: '2025 (full year)', y2026: '2026 (Jan–Sep)', y2026p: '2026 projected to 12 months',
    c1fine: 'Projection: Vibras Positivas HM estimate using the January–September pace (figure × 12 ÷ 9). Not official data.',
    k1: 'closures per 100 openings in 2025', k2: 'closures per 100 openings in 2026', k3: 'fewer projected openings than in 2025', k4: 'change in projected closures vs 2025',
    c2title: 'Where does every $100 a restaurant sells go?',
    sMp: 'Raw materials: $43', sNom: 'Payroll: $37', sRest: '$20 left for rent, utilities, taxes, delivery... and profit',
    c2fine: 'A common industry rule is that supplies plus payroll should not exceed 60 to 65%. At 80%, one slow month puts the business in the red.',
    c3title: 'Annual inflation, September 2026', medellin: 'Medellín', nacional: 'National average',
    c4title: 'Foreign tourists in Medellín', tur25: '2025 (year)', tur26: '2026 (Jan–Sep)',
    c4fine: 'From January to September, 1.8% fewer foreign visitors arrived than in the same period of 2025 (Migración Colombia and Anato).',
    cauEyebrow: 'Why it is happening', cauTitle: 'The squeeze: costs up, customers down',
    ca1h: '2026 minimum wage', ca1p: 'The minimum wage increase, plus the extended night surcharge, hit bars and restaurants head on.',
    ca2h: 'Lunch ingredients', ca2p: 'The ingredient cost of a traditional set lunch went from about $15,505 to $18,984 per person between 2025 and 2026.',
    ca3h: 'Medellín inflation', ca3p: 'Above the national average. Food, rent, commercial utilities and taxes weigh the most.',
    ca4h: 'Fewer tourists', ca4p: 'Fewer foreigners arrived, right in the areas where food investment was concentrated.',
    ca5b: 'Less', ca5h: 'Careful customers', ca5p: 'Some people stopped eating out at lunch or order less to balance their budget.',
    calEyebrow: 'Do the math', calTitle: 'How much is left for a restaurant?',
    calLead: 'Enter the numbers of a real or imaginary business and see what is left at the end of the month.',
    fVentas: 'Monthly sales ($)', fMp: 'Raw materials (% of sales)', fNom: 'Payroll (% of sales)', fArr: 'Rent ($)', fSer: 'Utilities ($)', fOtros: 'Taxes and other costs (% of sales)',
    coLabel: 'Left for the owner',
    newsEyebrow: 'News robot every 30 minutes + live search', newsTitle: 'All the news on this story', filterPh: 'Search: Acodres, Medellín, payroll...', more: 'Show more',
    acEyebrow: 'You can help', acTitle: 'What we can do as citizens',
    a1: 'Have lunch at your neighborhood restaurant now and then. One set lunch a week keeps formal jobs alive.',
    a2: 'When ordering delivery, ask if the restaurant has its own channel: platform fees eat into its margin.',
    a3: 'Share this app and the full numbers, not just the headline. Badly told data also does damage.',
    a4: 'Follow the Gastronomy Law debate in Congress and ask your representatives what relief they propose.',
    adEyebrow: 'For restaurant owners', adTitle: 'Do you know what each dish costs you?',
    adText: 'Vibras Positivas HM builds you an app to cost your recipes, see each dish’s margin and get alerts when a supply goes up.',
    adBtn: 'Message on WhatsApp',
    srcTitle: 'Sources',
    src1: 'El Colombiano, post of October 26, 2026 with figures from the Medellín Chamber of Commerce for Antioquia, Acoga, Migración Colombia and Anato.',
    src2: 'El Colombiano: the cost of a set lunch in 2026', src3: 'El Colombiano: 2026 minimum wage and the price of bandeja paisa',
    src4: 'El Colombiano: night surcharge and burger prices', src5: 'Portafolio: Acodres asks for relief measures',
    galEyebrow: 'What is at stake', galTitle: 'The tables of Colombia', galLead: 'Behind every number there is a kitchen, a market and a family that lives from selling food.',
    credits: 'Real photos and videos from Colombia (Medellín and Bogotá) from Pexels: Andres Segura, Christian Bolaños, Enzo Renz, Carlos Hernández, Nano Erdozain and Saulo Hernández. Projections are our own estimates based on the published figures.'
  };
  var MSG = {
    es: {
      searching: 'Buscando noticias en vivo...', liveOk: 'Búsqueda en vivo lista: {n} noticias encontradas ahora.',
      liveFail: 'La búsqueda en vivo no respondió; se muestran las noticias del robot.',
      robot: 'El robot (cada 30 min) encontró noticias nuevas por última vez: {t}', robotNone: 'El robot aún no ha corrido; se muestran noticias base.',
      hoyEmpty: 'Hoy todavía no hay noticias nuevas del caso. Estas son las más recientes:',
      badgeToday: 'Hoy', badgeLive: 'En vivo', badgeRecent: 'Reciente',
      ago: 'hace {x}', min: 'min', h: 'h', d: 'días', noDate: 'Fecha no disponible',
      none: 'No hay noticias que coincidan con su búsqueda.', updated: 'Última actualización de esta pantalla: {t} (hora de Colombia)',
      mBad: 'Pierde plata. Con estos costos el negocio no se sostiene: hay que subir precios, bajar desperdicio o renegociar el arriendo.',
      mTight: 'Margen muy apretado. Un mes flojo o un alza de insumos lo pone en rojo.',
      mOk: 'Margen sano para el sector. Vigile que insumos y nómina no pasen del 65%.'
    },
    en: {
      searching: 'Searching live news...', liveOk: 'Live search ready: {n} stories found right now.',
      liveFail: 'Live search did not respond; showing the robot’s news.',
      robot: 'The robot (every 30 min) last found new stories: {t}', robotNone: 'The robot has not run yet; showing base stories.',
      hoyEmpty: 'No new stories on this case yet today. These are the most recent:',
      badgeToday: 'Today', badgeLive: 'Live', badgeRecent: 'Recent',
      ago: '{x} ago', min: 'min', h: 'h', d: 'days', noDate: 'Date not available',
      none: 'No stories match your search.', updated: 'Screen last updated: {t} (Colombia time)',
      mBad: 'Losing money. With these costs the business cannot last: raise prices, cut waste or renegotiate the rent.',
      mTight: 'Very tight margin. One slow month or a supply price hike puts it in the red.',
      mOk: 'Healthy margin for the sector. Keep supplies and payroll under 65%.'
    }
  };

  var lang = 'es';
  try { lang = localStorage.getItem('rad-lang') || 'es'; } catch (e) {}
  var ES = {};

  function t(k, vars) {
    var s = (MSG[lang] && MSG[lang][k]) || MSG.es[k] || k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.replace('{' + v + '}', vars[v]); });
    return s;
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in ES)) ES[k] = el.textContent;
      el.textContent = lang === 'en' && EN[k] ? EN[k] : ES[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-ph');
      if (!el.dataset.esPh) el.dataset.esPh = el.placeholder;
      el.placeholder = lang === 'en' && EN[k] ? EN[k] : el.dataset.esPh;
    });
    document.querySelectorAll('[data-es][data-en]').forEach(function (el) { el.textContent = el.getAttribute(lang === 'en' ? 'data-en' : 'data-es'); });
    setCaption();
    document.getElementById('btnLang').textContent = lang === 'en' ? 'ES' : 'EN';
    renderAll();
    calc();
  }

  /* ---------- Hora de Colombia ---------- */
  function fmtBogota(d, opts) {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-CO', Object.assign({ timeZone: TZ }, opts)).format(d);
  }
  function bogotaDayKey(d) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  }
  function tickClock() {
    var now = new Date();
    document.getElementById('clock').textContent = fmtBogota(now, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('todayDate').textContent = fmtBogota(now, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ---------- Noticias ---------- */
  var robotItems = [], liveItems = [], robotUpdated = null, shown = PAGE;

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function cleanTitle(title, source) {
    var tt = (title || '').trim();
    if (source && tt.endsWith(' - ' + source)) tt = tt.slice(0, -(source.length + 3));
    return tt;
  }
  function merged() {
    var seen = {}, out = [];
    liveItems.concat(robotItems).forEach(function (it) {
      var key = norm(it.title).slice(0, 70);
      if (!key || seen[key]) return;
      seen[key] = 1; out.push(it);
    });
    out.sort(function (a, b) { return (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0); });
    return out;
  }

  function ago(dateStr) {
    var ts = Date.parse(dateStr);
    if (!ts) return t('noDate');
    var diff = (Date.now() - ts) / 60000;
    var x;
    if (diff < 60) x = Math.max(1, Math.round(diff)) + ' ' + t('min');
    else if (diff < 1440) x = Math.round(diff / 60) + ' ' + t('h');
    else return fmtBogota(new Date(ts), { day: 'numeric', month: 'short', year: 'numeric' });
    return t('ago', { x: x });
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function card(it, i, badge) {
    var img = it.image || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
    var b = badge ? '<span class="badge' + (badge === t('badgeLive') ? ' live' : '') + '">' + esc(badge) + '</span>' : '';
    return '<a class="ncard" href="' + esc(it.link) + '" target="_blank" rel="noopener">' + b +
      '<div class="nimg" style="background-image:url(\'' + esc(img) + '\')"></div>' +
      '<div class="nbody"><h3>' + esc(it.title) + '</h3>' +
      '<div class="nmeta"><span class="src">' + esc(it.source || 'Noticias') + '</span><span>' + esc(ago(it.date)) + '</span></div></div></a>';
  }

  function renderHoy() {
    var all = merged();
    var todayKey = bogotaDayKey(new Date());
    var today = all.filter(function (it) { var ts = Date.parse(it.date); return ts && bogotaDayKey(new Date(ts)) === todayKey; });
    var grid = document.getElementById('hoyGrid');
    if (!all.length) return;
    var html = '';
    if (today.length) {
      html = today.slice(0, 6).map(function (it, i) { return card(it, i, it.live ? t('badgeLive') : t('badgeToday')); }).join('');
    } else {
      html = '<p class="empty">' + esc(t('hoyEmpty')) + '</p>' +
        all.slice(0, 3).map(function (it, i) { return card(it, i, t('badgeRecent')); }).join('');
    }
    grid.innerHTML = html;
  }

  function renderNews() {
    var q = norm(document.getElementById('newsFilter').value);
    var list = merged().filter(function (it) { return !q || norm(it.title + ' ' + it.source).indexOf(q) > -1; });
    var grid = document.getElementById('newsGrid');
    grid.innerHTML = list.length ? list.slice(0, shown).map(function (it, i) { return card(it, i + 1, it.live ? t('badgeLive') : ''); }).join('')
      : '<p class="empty">' + esc(t('none')) + '</p>';
    document.getElementById('btnMore').style.display = list.length > shown ? 'block' : 'none';
  }

  function renderTicker() {
    var items = merged().slice(0, 10);
    if (!items.length) return;
    var html = items.map(function (it) { return '<a href="' + esc(it.link) + '" target="_blank" rel="noopener">' + esc(it.title) + '</a>'; }).join('');
    document.getElementById('ticker').innerHTML = html + html;
  }

  function renderStatus() {
    var rs = document.getElementById('robotStatus');
    rs.textContent = robotUpdated ? t('robot', { t: fmtBogota(new Date(robotUpdated), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }) : t('robotNone');
    document.getElementById('lastUpdate').textContent = t('updated', { t: fmtBogota(new Date(), { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) });
  }

  function renderAll() { renderHoy(); renderNews(); renderTicker(); renderStatus(); }

  function fetchTimeout(url, ms) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms);
    return fetch(url, ctrl ? { signal: ctrl.signal, cache: 'no-store' } : { cache: 'no-store' })
      .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error(r.status); return r; });
  }

  function loadRobot() {
    return fetchTimeout('data/noticias.json?t=' + Date.now(), 10000)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        robotUpdated = data.actualizado || null;
        robotItems = (data.noticias || []).map(function (n) { return { title: n.titulo, link: n.enlace, source: n.fuente, date: n.fecha, image: n.imagen }; });
      })
      .catch(function () {});
  }

  /* Búsqueda en vivo: Google Noticias por proxies públicos (si uno falla, prueba el siguiente) */
  var PROXIES = [
    function (u) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); },
    function (u) { return 'https://corsproxy.io/?url=' + encodeURIComponent(u); },
    function (u) { return 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u); }
  ];
  function rssUrl(q) { return 'https://news.google.com/rss/search?q=' + encodeURIComponent(q + ' when:30d') + '&hl=es-419&gl=CO&ceid=CO:es-419'; }

  function parseRss(xml) {
    var doc = new DOMParser().parseFromString(xml, 'text/xml');
    return Array.prototype.slice.call(doc.querySelectorAll('item')).map(function (el) {
      var src = el.querySelector('source');
      var source = src ? src.textContent.trim() : '';
      return {
        title: cleanTitle((el.querySelector('title') || {}).textContent, source),
        link: ((el.querySelector('link') || {}).textContent || '').trim(),
        date: ((el.querySelector('pubDate') || {}).textContent || '').trim(),
        source: source, live: true
      };
    }).filter(function (it) { return it.title && it.link; });
  }

  function fetchQuery(q) {
    var url = rssUrl(q), i = 0;
    function attempt() {
      if (i >= PROXIES.length) return Promise.resolve([]);
      var p = PROXIES[i++];
      return fetchTimeout(p(url), 9000).then(function (r) { return r.text(); })
        .then(function (txt) { if (txt.indexOf('<item') < 0) throw new Error('vacío'); return parseRss(txt); })
        .catch(attempt);
    }
    return attempt();
  }

  function liveSearch() {
    var st = document.getElementById('liveStatus');
    st.className = 'status'; st.textContent = t('searching');
    return Promise.all(LIVE_QUERIES.map(fetchQuery)).then(function (lists) {
      var all = [].concat.apply([], lists);
      if (all.length) {
        liveItems = all;
        st.className = 'status ok'; st.textContent = t('liveOk', { n: merged().filter(function (x) { return x.live; }).length });
      } else {
        st.className = 'status warn'; st.textContent = t('liveFail');
      }
    });
  }

  var lastRefresh = 0;
  function refresh() {
    var btn = document.getElementById('btnRefresh');
    btn.classList.add('loading'); btn.disabled = true;
    lastRefresh = Date.now();
    shown = PAGE;
    var robot = loadRobot().then(renderAll); // muestra rápido lo del robot mientras llega lo en vivo
    return Promise.all([robot, liveSearch()]).then(function () {
      renderAll();
    }).finally(function () { btn.classList.remove('loading'); btn.disabled = false; });
  }

  /* ---------- Animaciones ---------- */
  function animateCount(el) {
    var to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || '0', 10), start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur), v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function onSeen(el, fn) {
    if (!('IntersectionObserver' in window)) { fn(el); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    io.observe(el);
  }

  function setupAnimations() {
    document.querySelectorAll('.count').forEach(function (el) { onSeen(el, animateCount); });
    document.querySelectorAll('.reveal').forEach(function (el) { onSeen(el, function (x) { x.classList.add('in'); }); });
    onSeen(document.getElementById('stackBar'), function (x) { x.classList.add('in'); });
    var maxBar = 2253;
    document.querySelectorAll('.bars-group').forEach(function (g) {
      onSeen(g, function () {
        g.querySelectorAll('.bar').forEach(function (b) { b.style.height = (parseFloat(b.dataset.h) / maxBar * 100) + '%'; });
      });
    });
    document.querySelectorAll('.hbars').forEach(function (g) {
      onSeen(g, function () {
        g.querySelectorAll('.hfill').forEach(function (f) {
          var max = parseFloat(f.dataset.max || '8');
          f.style.width = (parseFloat(f.dataset.w) / max * 100) + '%';
        });
      });
    });
    var slides = document.querySelectorAll('#heroSlides .slide');
    var vid = document.getElementById('heroVideo');
    setInterval(function () {
      slides[heroCur].classList.remove('active');
      heroCur = (heroCur + 1) % slides.length;
      slides[heroCur].classList.add('active');
      if (heroCur === 0 && vid && vid.paused) vid.play().catch(function () {});
      setCaption();
    }, 7000);
    // Video de fondo de "Por qué": solo se descarga cuando la persona llega a esa sección
    var bg = document.querySelector('video.causas-photo');
    var ahorro = navigator.connection && navigator.connection.saveData;
    if (bg && !ahorro) onSeen(bg, function (v) { v.src = v.dataset.src; v.play().catch(function () {}); });
  }

  var heroCur = 0;
  var CAPTIONS = [
    ['Medellín, Antioquia', 'Medellín, Antioquia'],
    ['Almuerzo en un restaurante de Medellín', 'Lunch at a restaurant in Medellín'],
    ['Cocinero atendiendo en un restaurante de Medellín', 'A cook serving customers in Medellín'],
    ['Bandeja paisa', 'Bandeja paisa'],
    ['Carrito de comida callejera en Bogotá', 'Street food cart in Bogotá']
  ];
  function setCaption() {
    var c = document.getElementById('heroCaption');
    if (c) c.textContent = CAPTIONS[heroCur][lang === 'en' ? 1 : 0];
  }

  /* ---------- Calculadora ---------- */
  function num(id) { return parseInt(String(document.getElementById(id).value).replace(/\D/g, ''), 10) || 0; }
  function money(v) { return (v < 0 ? '−$' : '$') + Math.abs(Math.round(v)).toLocaleString('es-CO'); }
  function calc() {
    var ventas = num('fVentas');
    var mp = +document.getElementById('fMp').value, nom = +document.getElementById('fNom').value, otros = +document.getElementById('fOtros').value;
    document.getElementById('oMp').textContent = mp + '%';
    document.getElementById('oNom').textContent = nom + '%';
    document.getElementById('oOtros').textContent = otros + '%';
    var queda = ventas * (1 - (mp + nom + otros) / 100) - num('fArr') - num('fSer');
    var pct = ventas ? queda / ventas * 100 : 0;
    document.getElementById('coNum').textContent = money(queda);
    document.getElementById('coPct').textContent = pct.toFixed(1).replace('.', ',') + '%';
    var fill = document.getElementById('coFill');
    fill.style.width = Math.max(0, Math.min(100, pct * 4)) + '%';
    var box = document.getElementById('calcOut'), msg;
    box.classList.remove('bad', 'good');
    if (pct < 0) { msg = t('mBad'); box.classList.add('bad'); fill.style.background = 'var(--tomato)'; }
    else if (pct < 8) { msg = t('mTight'); fill.style.background = 'var(--mustard)'; }
    else { msg = t('mOk'); box.classList.add('good'); fill.style.background = 'var(--olive)'; }
    document.getElementById('coMsg').textContent = msg;
  }
  function setupCalc() {
    ['fVentas', 'fArr', 'fSer'].forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener('input', function () {
        var v = num(id); el.value = v ? v.toLocaleString('es-CO') : ''; calc();
      });
    });
    ['fMp', 'fNom', 'fOtros'].forEach(function (id) { document.getElementById(id).addEventListener('input', calc); });
  }

  /* ---------- Arranque ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    tickClock(); setInterval(tickClock, 1000);
    setupAnimations(); setupCalc();
    applyLang();
    document.getElementById('btnLang').addEventListener('click', function () {
      lang = lang === 'en' ? 'es' : 'en';
      try { localStorage.setItem('rad-lang', lang); } catch (e) {}
      applyLang();
    });
    document.getElementById('btnRefresh').addEventListener('click', refresh);
    document.getElementById('newsFilter').addEventListener('input', function () { shown = PAGE; renderNews(); });
    document.getElementById('btnMore').addEventListener('click', function () { shown += PAGE; renderNews(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && Date.now() - lastRefresh > 10 * 60000) refresh();
    });
    refresh();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
  });
})();
