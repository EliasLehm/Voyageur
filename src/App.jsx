import { useState, useEffect } from "react";

// ─── Config from .env ───
const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY || '';
const BOOKING_AID = import.meta.env.VITE_BOOKING_AID || '';
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY || '';

// ─── Password Protection ───
// Add your passwords here. Anyone with one of these can access the site.
const PASSWORDS = ["voyageur2025", "travel", "luxus"];
// Set to false to disable password protection entirely:
const PASSWORD_ENABLED = true;

// ─── i18n ───
const T = {
  de: {
    title: "Voyageur",
    sub: "Hotels · Orte · Restaurants · Aktivitäten",
    sub2: "Kuratiert aus Boutique-Reisemagazinen und Insider-Quellen",
    plan: "Reise Planen",
    surprise: "Überrasch mich",
    where: "Wohin?",
    wherePh: "z.B. Griechenland, Japan, Bhutan, Oman...",
    whereHint: "Inseln, Städte, Länder, Regionen",
    focus: "Fokus (optional)",
    focusPh: "z.B. Kykladen, Tokio, Paro-Tal...",
    budget: "Budget (gesamt p.P.)",
    duration: "Dauer",
    days: "Tage",
    travelers: "Reisende",
    style: "Reisestil",
    generated: "Für {d} Tage werden generiert:",
    total: "gesamt",
    search: "{n} Empfehlungen laden",
    searchSur: "{dest} entdecken",
    chooseDest: "Bitte Ziel wählen",
    researching: "Recherchiere aktuelle Empfehlungen...",
    scanning: "Durchsuche Insider-Quellen...",
    curating: "Kuratiere Reiseführer...",
    guide: "Reiseführer",
    recs: "Empfehlungen",
    all: "Alle",
    newSearch: "Neue Suche",
    map: "Karte",
    save: "Merken",
    saved: "Gemerkt",
    savedTitle: "Gemerkt",
    totalPp: "Gesamt p.P.",
    free: "Kostenlos",
    freeAccess: "frei zugänglich",
    nightsPp: "{d} Nächte p.P.",
    dinnerPp: "Abendessen p.P.",
    perPerson: "pro Person",
    mapsLink: "Maps",
    infoLink: "Info",
    bookingLink: "Buchen",
    tip: "Tipp",
    aiRec: "AI-Empfehlung",
    sources: "Quellen-Favoriten (optional)",
    sourcesPh: "z.B. Condé Nast, AFAR, ELLE Travel...",
    sourcesHint: "AI priorisiert diese Quellen bei der Recherche",
    sourceLink: "Quelle",
    surReady: "Bereit für ein Abenteuer?",
    surReveal: "Ziel enthüllen",
    surLoading: "Wähle Ziel...",
    surYour: "Dein Ziel",
    surOther: "Anderes Ziel",
    surManual: "Eigenes Ziel eingeben",
    disclaimer: "Empfehlungen per AI aus öffentlichen Quellen. Nicht mit genannten Anbietern affiliiert.",
    pw: "Diese Seite ist passwortgeschützt.",
    pwPh: "Passwort eingeben...",
    pwErr: "Falsches Passwort",
    hotel: "Hotels", place: "Orte", activity: "Aktivitäten", restaurant: "Restaurants", transport: "Transport",
    styles: {romance:"Romantik",adventure:"Abenteuer",wellness:"Wellness",culinary:"Kulinarik",culture:"Kultur",beach:"Strand & Inseln",train:"Zugreise",safari:"Safari",expedition:"Expedition",cruise:"Kreuzfahrt"},
  },
  en: {
    title: "Voyageur",
    sub: "Hotels · Places · Restaurants · Activities",
    sub2: "Curated from boutique travel magazines and insider sources",
    plan: "Plan Trip",
    surprise: "Surprise Me",
    where: "Where to?",
    wherePh: "e.g. Greece, Japan, Bhutan, Oman...",
    whereHint: "Islands, cities, countries, regions",
    focus: "Focus (optional)",
    focusPh: "e.g. Cyclades, Tokyo, Paro Valley...",
    budget: "Budget (total p.p.)",
    duration: "Duration",
    days: "days",
    travelers: "Travelers",
    style: "Travel style",
    generated: "For {d} days:",
    total: "total",
    search: "Load {n} recommendations",
    searchSur: "Explore {dest}",
    chooseDest: "Please choose destination",
    researching: "Researching current recommendations...",
    scanning: "Scanning insider sources...",
    curating: "Curating travel guide...",
    guide: "Travel Guide",
    recs: "recommendations",
    all: "All",
    newSearch: "New Search",
    map: "Map",
    save: "Save",
    saved: "Saved",
    savedTitle: "Saved",
    totalPp: "Total p.p.",
    free: "Free",
    freeAccess: "free access",
    nightsPp: "{d} nights p.p.",
    dinnerPp: "dinner p.p.",
    perPerson: "per person",
    mapsLink: "Maps",
    infoLink: "Info",
    bookingLink: "Book",
    tip: "Tip",
    aiRec: "AI Pick",
    sources: "Source favorites (optional)",
    sourcesPh: "e.g. Condé Nast, AFAR, ELLE Travel...",
    sourcesHint: "AI will prioritize these sources",
    sourceLink: "Source",
    surReady: "Ready for an adventure?",
    surReveal: "Reveal destination",
    surLoading: "Choosing...",
    surYour: "Your destination",
    surOther: "Try another",
    surManual: "Enter own destination",
    disclaimer: "AI-curated from public sources. Not affiliated with mentioned providers.",
    pw: "This site is password protected.",
    pwPh: "Enter password...",
    pwErr: "Wrong password",
    hotel: "Hotels", place: "Places", activity: "Activities", restaurant: "Restaurants", transport: "Transport",
    styles: {romance:"Romance",adventure:"Adventure",wellness:"Wellness",culinary:"Culinary",culture:"Culture",beach:"Beach & Islands",train:"Train",safari:"Safari",expedition:"Expedition",cruise:"Cruise"},
  }
};

const CUR = [{c:"EUR",s:"€"},{c:"USD",s:"$"},{c:"GBP",s:"£"},{c:"CHF",s:"CHF"}];
const STY_KEYS = [{id:"romance",e:"🌹"},{id:"adventure",e:"⛰️"},{id:"wellness",e:"🧘"},{id:"culinary",e:"🍽️"},{id:"culture",e:"🏛️"},{id:"beach",e:"🏝️"},{id:"train",e:"🚂"},{id:"safari",e:"🦒"},{id:"expedition",e:"🧭"},{id:"cruise",e:"🛥️"}];
const CAT_DATA = [
  {k:"hotel",i:"🏨",c:"#1B3A5C",bg:"#E8EDF2"},
  {k:"place",i:"📍",c:"#2E5A88",bg:"#E5EBF0"},
  {k:"activity",i:"✨",c:"#3A7CA5",bg:"#E3EEF5"},
  {k:"restaurant",i:"🍽️",c:"#C4704E",bg:"#F2EBE7"},
  {k:"transport",i:"✈️",c:"#6B7B8D",bg:"#EBEEF0"},
];
const G = "#1B3A5C", BG = "#FAFAF8", FG = "#1A1A1A";
const FF = "'Outfit',sans-serif", SF = "'Cormorant Garamond',serif", DF = "'Playfair Display',serif";

function getCounts(d) {
  if (d <= 3) return {hotel:2,place:3,activity:2,restaurant:3,transport:2};
  if (d <= 7) return {hotel:3,place:5,activity:3,restaurant:5,transport:2};
  if (d <= 14) return {hotel:4,place:8,activity:5,restaurant:7,transport:3};
  return {hotel:5,place:10,activity:6,restaurant:9,transport:3};
}

function DotMap({items}) {
  const pts = items.filter(r => r.lat && r.lng && Math.abs(r.lat) > 0.1);
  if (pts.length < 2) return null;
  const lats = pts.map(p=>p.lat), lngs = pts.map(p=>p.lng);
  const pad = 0.3;
  const mnLa = Math.min(...lats)-pad, mxLa = Math.max(...lats)+pad;
  const mnLn = Math.min(...lngs)-pad, mxLn = Math.max(...lngs)+pad;
  const W = 800, H = 280;
  const px = ln => ((ln-mnLn)/(mxLn-mnLn))*(W-80)+40;
  const py = la => (1-(la-mnLa)/(mxLa-mnLa))*(H-60)+30;
  return (
    <div style={{width:"100%",background:"#F4F6F8",borderBottom:`1px solid ${FG}10`,padding:"16px 0",overflow:"hidden"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:220,display:"block",margin:"0 auto",maxWidth:900}}>
        {pts.map((p,i)=>i>0?<line key={`l${i}`} x1={px(pts[i-1].lng)} y1={py(pts[i-1].lat)} x2={px(p.lng)} y2={py(p.lat)} stroke={G+"20"} strokeWidth={1} strokeDasharray="6,4"/>:null)}
        {pts.map((p,i)=>{
          const cat = CAT_DATA.find(c=>c.k===p.category);
          const cx=px(p.lng),cy=py(p.lat);
          return (
            <g key={i}>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.title+", "+p.location)}`} target="_blank" rel="noopener noreferrer">
                <circle cx={cx} cy={cy} r={14} fill={cat?.c||G} opacity={0.12}/>
                <circle cx={cx} cy={cy} r={7} fill={cat?.c||G} stroke="#fff" strokeWidth={2}/>
                <text x={cx} y={cy-18} textAnchor="middle" fill={FG+"CC"} fontSize={10} fontFamily={FF}>{p.title.length>22?p.title.slice(0,20)+"…":p.title}</text>
              </a>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Unsplash image (deployed version only)
function UnsplashImg({query, cat, style: s}) {
  const [src, setSrc] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (!UNSPLASH_KEY || !query) return;
    fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    }).then(r=>r.json()).then(d=>{
      if (d.results?.[0]?.urls?.small) setSrc(d.results[0].urls.small);
      else setErr(true);
    }).catch(()=>setErr(true));
  }, [query]);
  if (src && !err) return <img src={src} alt="" style={{...s,objectFit:"cover"}} onError={()=>setErr(true)}/>;
  return <div style={{...s,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,opacity:0.1}}>{cat?.i||"🌍"}</span></div>;
}

// Booking.com link with affiliate
function bookingUrl(name, loc) {
  const base = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(name+' '+loc)}`;
  return BOOKING_AID ? `${base}&aid=${BOOKING_AID}` : base;
}

export default function App() {
  const [authed, setAuthed] = useState(!PASSWORD_ENABLED);
  const [pwInput, setPwInput] = useState('');
  const [pwErr, setPwErr] = useState(false);
  const [lang, setLang] = useState("de");
  const t = T[lang];
  const [step, setStep] = useState(0);
  const [dest, setDest] = useState("");
  const [focus, setFocus] = useState("");
  const [budget, setBudget] = useState(3000);
  const [cur, setCur] = useState(CUR[0]);
  const [dur, setDur] = useState(7);
  const [trav, setTrav] = useState(2);
  const [styles, setStyles] = useState([]);
  const [fav, setFav] = useState("");
  const [results, setResults] = useState(null);
  const [prog, setProg] = useState(0);
  const [phase, setPhase] = useState("");
  const [err, setErr] = useState(null);
  const [exp, setExp] = useState(null);
  const [saved, setSaved] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [tab, setTab] = useState("all");
  const [surMode, setSurMode] = useState(false);
  const [surDest, setSurDest] = useState(null);
  const [surLoad, setSurLoad] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const fmt = v => cur.c==="CHF"?`CHF ${v.toLocaleString("de-CH")}`:`${cur.s}${v.toLocaleString("de-DE")}`;
  const cts = getCounts(dur);
  const totC = Object.values(cts).reduce((a,b)=>a+b,0);
  const totSaved = saved.reduce((s,i)=>s+(i.priceNum||0),0);
  const catLabel = k => t[k] || k;

  const LangSwitch = () => (
    <div style={{display:"flex",gap:4,fontFamily:FF,fontSize:11}}>
      <button onClick={()=>setLang("de")} style={{padding:"4px 10px",border:`1px solid ${lang==="de"?G:FG+"20"}`,background:lang==="de"?G+"12":"transparent",color:lang==="de"?G:FG+"88",cursor:"pointer",fontFamily:FF,fontSize:11}}>DE</button>
      <button onClick={()=>setLang("en")} style={{padding:"4px 10px",border:`1px solid ${lang==="en"?G:FG+"20"}`,background:lang==="en"?G+"12":"transparent",color:lang==="en"?G:FG+"88",cursor:"pointer",fontFamily:FF,fontSize:11}}>EN</button>
    </div>
  );

  const Lbl = ({n,txt}) => <div style={{fontFamily:FF,fontSize:11,letterSpacing:4,textTransform:"uppercase",color:G,marginBottom:12}}>{n} — {txt}</div>;

  const [surIdx, setSurIdx] = useState(-1);

  // 40 diverse destinations: cities, islands, regions, countries — shuffled each session
  const surprisePool = [
    {destination:"Tbilisi",region:"Georgien",emoji:"🏔️"},{destination:"Muskat",region:"Oman",emoji:"🏜️"},
    {destination:"Porto",region:"Portugal",emoji:"🍷"},{destination:"Okinawa",region:"Japan",emoji:"🏯"},
    {destination:"Puglia",region:"Italien",emoji:"🫒"},{destination:"Ljubljana",region:"Slowenien",emoji:"🌊"},
    {destination:"Medellín",region:"Kolumbien",emoji:"🌺"},{destination:"Kotor",region:"Montenegro",emoji:"⛰️"},
    {destination:"Samarkand",region:"Usbekistan",emoji:"🕌"},{destination:"Taipei",region:"Taiwan",emoji:"🏮"},
    {destination:"Luang Prabang",region:"Laos",emoji:"🛕"},{destination:"Kapstadt",region:"Südafrika",emoji:"🦁"},
    {destination:"Valletta",region:"Malta",emoji:"🏛️"},{destination:"Lofoten",region:"Norwegen",emoji:"🌌"},
    {destination:"Hội An",region:"Vietnam",emoji:"🏮"},{destination:"Petra",region:"Jordanien",emoji:"🏜️"},
    {destination:"Marrakesch",region:"Marokko",emoji:"🕌"},{destination:"Tulum",region:"Mexiko",emoji:"🏝️"},
    {destination:"Kyoto",region:"Japan",emoji:"⛩️"},{destination:"Hallstatt",region:"Österreich",emoji:"🏔️"},
    {destination:"Dubrovnik",region:"Kroatien",emoji:"🏰"},{destination:"Cartagena",region:"Kolumbien",emoji:"🌺"},
    {destination:"Lissabon",region:"Portugal",emoji:"🚃"},{destination:"Kapverden",region:"Atlantik",emoji:"🌋"},
    {destination:"Sansibar",region:"Tansania",emoji:"🏝️"},{destination:"Bagan",region:"Myanmar",emoji:"🛕"},
    {destination:"Azoren",region:"Portugal",emoji:"🌿"},{destination:"Siem Reap",region:"Kambodscha",emoji:"🏛️"},
    {destination:"Färöer-Inseln",region:"Dänemark",emoji:"🌫️"},{destination:"Busan",region:"Südkorea",emoji:"🌊"},
    {destination:"Cusco",region:"Peru",emoji:"🏔️"},{destination:"Neapel",region:"Italien",emoji:"🍕"},
    {destination:"Essaouira",region:"Marokko",emoji:"🌊"},{destination:"Kigali",region:"Ruanda",emoji:"🦍"},
    {destination:"Galle",region:"Sri Lanka",emoji:"🐘"},{destination:"Tromsø",region:"Norwegen",emoji:"🌌"},
    {destination:"Palawan",region:"Philippinen",emoji:"🏝️"},{destination:"Brügge",region:"Belgien",emoji:"🏰"},
    {destination:"Riga",region:"Lettland",emoji:"🏛️"},{destination:"Montevideo",region:"Uruguay",emoji:"🌅"},
  ];

  const pickSurprise = () => {
    let idx;
    do { idx = Math.floor(Math.random() * surprisePool.length); } while (idx === surIdx);
    setSurIdx(idx);
    const pick = surprisePool[idx];
    pick.tagline = lang === "de"
      ? ["Entdecke","Erlebe","Tauche ein in","Lass dich überraschen von"][Math.floor(Math.random()*4)] + ` ${pick.destination}, ${pick.region}`
      : ["Discover","Experience","Dive into","Be surprised by"][Math.floor(Math.random()*4)] + ` ${pick.destination}, ${pick.region}`;
    setSurDest(pick);
    setDest(pick.destination);
    setFocus(pick.region || "");
  };

  const search = async () => {
    setStep(2); setErr(null); setResults(null);
    const sl = STY_KEYS.filter(s=>styles.includes(s.id)).map(s=>t.styles[s.id]||s.id).join(", ");
    const c = cts;
    const isEN = lang==="en";
    const hotelBudget = Math.round(budget * 0.4);
    const restBudget = Math.round(budget * 0.05);
    const actBudget = Math.round(budget * 0.1);
    const worded = budget < 200 ? "VERY cheap: hostels, dorms, street food, free activities only." 
      : budget < 500 ? "Budget: cheap hostels, budget hotels, affordable restaurants, free attractions." 
      : budget < 1500 ? "Mid-range: 3-star hotels, good restaurants, some paid activities."
      : budget < 5000 ? "Upper mid: boutique hotels, fine dining, premium experiences."
      : "Luxury: boutique hotels <30 rooms, fine dining, exclusive experiences.";
    const basePrompt = `${dest}${focus?" "+focus:""}, STRICT BUDGET: ${fmt(budget)} TOTAL per person for ALL ${dur} days. ${trav}p. ${sl||""}
${fav?"Prioritize: "+fav+". ":""}${c.hotel} hotel, ${c.place} place, ${c.activity} activity, ${c.restaurant} restaurant, ${c.transport} transport = ${totC}.
PRICE RULES - VERY IMPORTANT:
- Hotel: max ${cur.s}${hotelBudget} TOTAL for ${dur} nights (=${cur.s}${Math.round(hotelBudget/dur)}/night)
- Restaurant: max ${cur.s}${restBudget} per dinner
- Activity: max ${cur.s}${actBudget} per activity
- ALL prices must fit within ${fmt(budget)} total budget
- ${worded}
Mix iconic+hidden gems. Real lat/lng. ${isEN?"EN":"DE"} JSON no backticks:
[{"title":"X","location":"X","description":"1 sentence","price":"${cur.s}0","priceNum":0,"category":"hotel","rating":9,"lat":0,"lng":0}]`;

    setPhase(t.curating);
    try {
      // Phase 1: Fast results
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4096,
          messages:[{role:"user",content:basePrompt}]})
      });
      if (!resp.ok) throw new Error("API "+resp.status);
      const data = await resp.json();
      const full = data.content?.map(i=>i.text||"").filter(Boolean).join("\n")||"";
      let parsed = parseJSON(full.replace(/```json|```/g,"").trim());
      if (!parsed?.length) throw new Error(isEN?"No results":"Keine Ergebnisse");
      parsed.forEach(r => { r.sourceUrl = `https://www.google.com/search?q=${encodeURIComponent(r.title+" "+r.location)}`; });
      parsed.sort((a,b)=>{const o=["hotel","place","activity","restaurant","transport"];return o.indexOf(a.category)-o.indexOf(b.category)||(a.orderHint||99)-(b.orderHint||99);});
      setResults(parsed); setStep(3);

      // Phase 2: Web search upgrade (runs silently in background)
      fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4096,
          messages:[{role:"user",content:`Search web for: hidden gems boutique hotels secret restaurants ${focus||dest} ${sl||""} 2025 2026 insider tips.
Then improve this guide. Replace generic picks with real insider finds. Keep format.
Current: ${parsed.slice(0,5).map(r=>r.title).join(", ")}
${basePrompt}
Find places NOT in typical guides. Local favorites, new openings.`}],
          tools:[{type:"web_search_20250305",name:"web_search"}]})
      }).then(r=>r.json()).then(d=>{
        const txt = d.content?.map(i=>i.text||"").filter(Boolean).join("\n")||"";
        const wp = parseJSON(txt.replace(/```json|```/g,"").trim());
        if (wp?.length >= totC * 0.7) {
          wp.forEach(r => { r.sourceUrl = `https://www.google.com/search?q=${encodeURIComponent(r.title+" "+r.location)}`; r.webVerified = true; });
          wp.sort((a,b)=>{const o=["hotel","place","activity","restaurant","transport"];return o.indexOf(a.category)-o.indexOf(b.category)||(a.orderHint||99)-(b.orderHint||99);});
          setResults(wp);
        }
      }).catch(()=>{});

    } catch(e) { console.error(e); setErr(e.message); setStep(1); }
  };

  function parseJSON(s) {
    try { return JSON.parse(s); } catch {
      const m = s.match(/\[[\s\S]*\]/);
      if (m) try { return JSON.parse(m[0]); } catch {
        const li = m[0].lastIndexOf("}");
        if (li>0) try { return JSON.parse(m[0].substring(0,li+1)+"]"); } catch {}
      }
    }
    return null;
  }

  // Shared styles
  const inp = {background:"transparent",border:"none",borderBottom:`1.5px solid ${G}40`,color:FG,fontFamily:SF,fontSize:22,fontStyle:"italic",padding:"14px 0",width:"100%",outline:"none"};
  const btn1 = {background:"transparent",border:`1.5px solid ${G}70`,color:G,fontFamily:FF,fontSize:13,letterSpacing:3,textTransform:"uppercase",padding:"18px 44px",cursor:"pointer"};
  const btn2 = {background:"transparent",border:`1.5px solid #4A8BBF40`,color:"#4A8BBF",fontFamily:FF,fontSize:12,letterSpacing:2,textTransform:"uppercase",padding:"18px 32px",cursor:"pointer"};

  // ─── PASSWORD ───
  if (!authed) return (
    <div style={{minHeight:"100vh",background:BG,color:FG,fontFamily:DF,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40}}>
      <h1 style={{fontSize:48,fontStyle:"italic",color:G,marginBottom:32}}>Voyageur</h1>
      <p style={{fontFamily:FF,fontSize:14,color:FG+"88",marginBottom:24}}>{t.pw}</p>
      <div style={{display:"flex",gap:8}}>
        <input type="password" value={pwInput} onChange={e=>{setPwInput(e.target.value);setPwErr(false)}}
          onKeyDown={e=>{if(e.key==='Enter'){if(PASSWORDS.includes(pwInput))setAuthed(true);else setPwErr(true)}}}
          placeholder={t.pwPh} style={{background:"transparent",border:`1.5px solid ${pwErr?'#C41E3A':G+'40'}`,color:FG,fontFamily:FF,fontSize:16,padding:"14px 20px",width:280,outline:"none"}}/>
        <button onClick={()=>{if(PASSWORDS.includes(pwInput))setAuthed(true);else setPwErr(true)}}
          style={{background:"transparent",border:`1.5px solid ${G}70`,color:G,fontFamily:FF,fontSize:14,padding:"14px 24px",cursor:"pointer"}}>→</button>
      </div>
      {pwErr&&<p style={{fontFamily:FF,fontSize:12,color:"#C41E3A",marginTop:12}}>{t.pwErr}</p>}
    </div>
  );

  // ─── NO API KEY ───
  if (!API_KEY) return (
    <div style={{minHeight:"100vh",background:BG,color:FG,fontFamily:DF,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40}}>
      <h1 style={{fontSize:48,fontStyle:"italic",color:G,marginBottom:24}}>Voyageur</h1>
      <p style={{fontFamily:FF,fontSize:14,color:FG+"88",marginBottom:24}}>API Key fehlt. Bitte <code style={{color:G}}>VITE_ANTHROPIC_KEY</code> in .env eintragen.</p>
      <a href="https://console.anthropic.com" target="_blank" style={{color:G,fontFamily:FF,fontSize:12}}>→ console.anthropic.com</a>
    </div>
  );

  // ─── LANDING ───
  if (step === 0) return (
    <div style={{minHeight:"100vh",background:BG,color:FG,fontFamily:DF,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",position:"relative"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Outfit:wght@200;300;400;500&display=swap" rel="stylesheet"/>
      <div style={{position:"absolute",top:20,right:20}}><LangSwitch/></div>
      <div style={{fontFamily:FF,fontSize:12,letterSpacing:8,textTransform:"uppercase",color:G,marginBottom:24}}>AI {t.guide}</div>
      <h1 style={{fontSize:"clamp(44px,10vw,96px)",fontWeight:400,fontStyle:"italic",color:G,marginBottom:14,textAlign:"center"}}>{t.title}</h1>
      <p style={{fontFamily:SF,fontSize:18,fontStyle:"italic",color:FG+"88",textAlign:"center",maxWidth:460,lineHeight:1.6,marginBottom:10}}>{t.sub}</p>
      <p style={{fontFamily:FF,fontSize:12,color:FG+"66",textAlign:"center",maxWidth:420,lineHeight:1.6,marginBottom:40}}>{t.sub2}</p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>setStep(1)} style={btn1}>{t.plan}</button>
        <button onClick={()=>{setSurMode(true);setDest("");setFocus("");setSurDest(null);setStep(1)}} style={btn2}>✦ {t.surprise}</button>
      </div>
      <p style={{fontFamily:FF,fontSize:9,color:FG+"40",textAlign:"center",maxWidth:380,marginTop:48,lineHeight:1.5}}>{t.disclaimer}</p>
    </div>
  );

  // ─── CONFIGURE ───
  if (step === 1) return (
    <div style={{minHeight:"100vh",background:BG,color:FG,fontFamily:DF}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Outfit:wght@200;300;400;500&display=swap" rel="stylesheet"/>
      <div style={{padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${FG}10`}}>
        <span onClick={()=>{setStep(0);setSurMode(false)}} style={{cursor:"pointer",fontStyle:"italic",fontSize:22,color:G}}>Voyageur</span>
        <LangSwitch/>
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"36px 20px 100px"}}>
        {/* Surprise or destination */}
        {surMode ? (
          <div style={{marginBottom:36}}>
            <Lbl n="01" txt={t.surprise}/>
            {!surDest&&<div style={{textAlign:"center",padding:"28px 0"}}>
              <p style={{fontFamily:SF,fontSize:18,fontStyle:"italic",color:FG+"88",marginBottom:20}}>{t.surReady}</p>
              <button onClick={pickSurprise} style={{...btn2,fontSize:13,padding:"14px 36px"}}>✦ {t.surReveal}</button>
            </div>}
            {surDest&&<div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:48,marginBottom:10}}>{surDest.emoji||"🌍"}</div>
              <div style={{fontFamily:FF,fontSize:10,letterSpacing:5,textTransform:"uppercase",color:G,marginBottom:6}}>{t.surYour}</div>
              <div style={{fontFamily:DF,fontSize:38,fontWeight:500,fontStyle:"italic"}}>{surDest.destination}</div>
              {surDest.region&&<div style={{fontFamily:FF,fontSize:13,color:FG+"BB",marginTop:4}}>{surDest.region}</div>}
              <p style={{fontFamily:SF,fontSize:16,fontStyle:"italic",color:FG+"88",marginTop:10,marginBottom:14}}>{surDest.tagline}</p>
              <button onClick={pickSurprise} style={{background:"transparent",border:`1px solid ${G}30`,color:G+"88",padding:"6px 18px",cursor:"pointer",fontFamily:FF,fontSize:10}}>↻ {t.surOther}</button>
            </div>}
            <div style={{textAlign:"center",marginTop:14}}>
              <button onClick={()=>{setSurMode(false);setDest("");setSurDest(null)}} style={{background:"transparent",border:"none",color:FG+"77",cursor:"pointer",fontFamily:FF,fontSize:11,textDecoration:"underline"}}>{t.surManual} →</button>
            </div>
          </div>
        ) : (
          <div style={{marginBottom:36}}>
            <Lbl n="01" txt={t.where}/>
            <input value={dest} onChange={e=>setDest(e.target.value)} placeholder={t.wherePh} style={inp}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <span style={{fontFamily:FF,fontSize:11,color:FG+"99"}}>{t.whereHint}</span>
              <button onClick={()=>{setSurMode(true);setSurDest(null)}} style={{background:"transparent",border:`1px solid ${G}35`,color:G,padding:"4px 12px",cursor:"pointer",fontFamily:FF,fontSize:10}}>✦ {t.surprise}</button>
            </div>
          </div>
        )}

        {(dest||surDest)&&<div style={{marginBottom:36}}>
          <Lbl n="02" txt={t.focus}/>
          <input value={focus} onChange={e=>setFocus(e.target.value)} placeholder={t.focusPh} style={{...inp,fontSize:19}}/>
        </div>}

        <div style={{marginBottom:36}}>
          <Lbl n="03" txt={t.budget}/>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {CUR.map(c=><button key={c.c} onClick={()=>setCur(c)} style={{padding:"8px 16px",border:`1px solid ${cur.c===c.c?G:FG+"18"}`,background:cur.c===c.c?G+"14":"transparent",color:cur.c===c.c?G:FG+"AA",cursor:"pointer",fontFamily:FF,fontSize:12}}>{c.c}</button>)}
          </div>
          <div style={{fontFamily:SF,fontSize:40,fontWeight:300,color:G,marginBottom:14}}>{fmt(budget)}</div>
          <input type="range" min={50} max={150000} step={budget<1000?50:budget<5000?100:500} value={budget} onChange={e=>setBudget(+e.target.value)} style={{width:"100%",accentColor:G}}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
          {[{n:"04",lbl:t.duration,val:dur,set:setDur,min:1,max:60,unit:t.days},{n:"05",lbl:t.travelers,val:trav,set:setTrav,min:1,max:12,unit:""}].map(x=>(
            <div key={x.n}>
              <Lbl n={x.n} txt={x.lbl}/>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={()=>x.set(Math.max(x.min,x.val-1))} style={{width:40,height:40,border:`1px solid ${G}40`,background:"transparent",color:G,cursor:"pointer",fontSize:18,fontFamily:FF,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontFamily:SF,fontSize:30,fontWeight:300,minWidth:60,textAlign:"center"}}>{x.val} {x.unit&&<span style={{fontSize:13,color:FG+"99"}}>{x.unit}</span>}</span>
                <button onClick={()=>x.set(Math.min(x.max,x.val+1))} style={{width:40,height:40,border:`1px solid ${G}40`,background:"transparent",color:G,cursor:"pointer",fontSize:18,fontFamily:FF,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginBottom:36,padding:14,border:`1px solid ${G}18`,background:G+"06"}}>
          <div style={{fontFamily:FF,fontSize:10,color:G,marginBottom:4}}>{t.generated.replace("{d}",dur)}</div>
          <div style={{fontFamily:FF,fontSize:11,color:FG+"BB",lineHeight:1.8,display:"flex",flexWrap:"wrap",gap:"4px 14px"}}>
            {CAT_DATA.map(c=><span key={c.k}>{c.i} {cts[c.k]} {catLabel(c.k)}</span>)}
            <span style={{color:G,fontWeight:500}}>= {totC} {t.total}</span>
          </div>
        </div>

        <div style={{marginBottom:36}}>
          <Lbl n="06" txt={t.style}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {STY_KEYS.map(s=><button key={s.id} onClick={()=>setStyles(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}
              style={{padding:"10px 16px",border:`1px solid ${styles.includes(s.id)?G:FG+"18"}`,background:styles.includes(s.id)?G+"12":"transparent",color:styles.includes(s.id)?G:FG+"BB",cursor:"pointer",fontFamily:FF,fontSize:12,display:"flex",alignItems:"center",gap:6}}>{s.e} {t.styles[s.id]||s.id}</button>)}
          </div>
        </div>

        <div style={{marginBottom:36}}>
          <Lbl n="07" txt={t.sources}/>
          <input value={fav} onChange={e=>setFav(e.target.value)} placeholder={t.sourcesPh}
            style={{...inp,fontSize:16}}/>
          <div style={{fontFamily:FF,fontSize:10,color:FG+"77",marginTop:6}}>{t.sourcesHint}</div>
        </div>

        {err&&<div style={{padding:14,marginBottom:20,border:"1px solid #C41E3A55",background:"#C41E3A0A",fontFamily:FF,fontSize:12,color:"#C41E3A",textAlign:"center"}}>{err}</div>}
        <div style={{display:"flex",justifyContent:"center"}}>
          <button onClick={search} disabled={!dest&&!surDest} style={{...btn1,width:"100%",maxWidth:440,opacity:(dest||surDest)?1:0.3,cursor:(dest||surDest)?"pointer":"not-allowed"}}>
            {dest?t.search.replace("{n}",totC):surDest?`✦ ${t.searchSur.replace("{dest}",surDest.destination)}`:t.chooseDest}
          </button>
        </div>
      </div>
    </div>
  );

  // ─── SEARCHING ───
  if (step === 2) return (
    <div style={{minHeight:"100vh",background:BG,color:FG,fontFamily:FF,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",color:G,marginBottom:20}}>{phase || t.curating}</div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:G,opacity:0.3,animation:`pulse 1.2s ease-in-out ${i*0.3}s infinite`}}/>)}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
      <div style={{fontFamily:SF,fontSize:20,fontStyle:"italic",color:FG+"66",marginTop:8}}>{focus||dest}</div>
      <div style={{fontFamily:FF,fontSize:10,color:FG+"44",marginTop:16}}>{lang==="de"?"Kann bis zu 15 Sekunden dauern...":"May take up to 15 seconds..."}</div>
    </div>
  );

  // ─── RESULTS ───
  const filtered = tab==="all"?results:(results||[]).filter(r=>r.category===tab);
  const cc = {}; CAT_DATA.forEach(c=>{cc[c.k]=(results||[]).filter(r=>r.category===c.k).length});

  return (
    <div style={{minHeight:"100vh",background:BG,color:FG,fontFamily:DF}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Outfit:wght@200;300;400;500&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${FG}0D`,position:"sticky",top:0,background:BG+"F0",zIndex:50,backdropFilter:"blur(12px)"}}>
        <span onClick={()=>setStep(0)} style={{cursor:"pointer",fontStyle:"italic",fontSize:20,color:G}}>Voyageur</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <LangSwitch/>
          <button onClick={()=>setShowMap(!showMap)} style={{padding:"6px 12px",border:`1px solid ${showMap?G:FG+"18"}`,background:showMap?G+"12":"transparent",color:showMap?G:FG+"88",cursor:"pointer",fontFamily:FF,fontSize:10}}>🗺️ {t.map}</button>
          <button onClick={()=>setStep(1)} style={{padding:"6px 12px",border:`1px solid ${FG+"18"}`,background:"transparent",color:FG+"AA",cursor:"pointer",fontFamily:FF,fontSize:10}}>← {t.newSearch}</button>
        </div>
      </div>

      {/* Map */}
      {showMap && <DotMap items={results||[]}/>}

      {/* Summary */}
      <div style={{padding:"20px 20px 0",maxWidth:1000,margin:"0 auto"}}>
        <div style={{fontFamily:FF,fontSize:10,letterSpacing:3,textTransform:"uppercase",color:G,marginBottom:6}}>
          {results?.length||0} {t.recs} · {focus||dest} · {fmt(budget)} / {dur} {t.days}
        </div>
        <h2 style={{fontSize:28,fontWeight:400,fontStyle:"italic",marginBottom:10}}>{focus||dest} {t.guide}</h2>
      </div>

      {/* Tabs */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 20px",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{display:"flex",borderBottom:`1px solid ${FG}10`,minWidth:"max-content"}}>
          {[{k:"all",l:`${t.all} (${results?.length||0})`,i:""},...CAT_DATA.map(c=>({k:c.k,l:`${catLabel(c.k)} (${cc[c.k]||0})`,i:c.i}))].map(x=>(
            <button key={x.k} onClick={()=>setTab(x.k)} style={{padding:"10px 14px",border:"none",borderBottom:tab===x.k?`2px solid ${G}`:"2px solid transparent",background:"transparent",color:tab===x.k?G:FG+"99",cursor:"pointer",fontFamily:FF,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{x.i} {x.l}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"20px 20px 120px"}}>
        {tab==="all"?CAT_DATA.map(cat=>{
          const items=(results||[]).filter(r=>r.category===cat.k);
          if(!items.length) return null;
          return (
            <div key={cat.k} style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:16}}>{cat.i}</span>
                <span style={{fontFamily:FF,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:cat.c}}>{catLabel(cat.k)}</span>
                <div style={{flex:1,height:"0.5px",background:cat.c+"22"}}/>
                <span style={{fontFamily:FF,fontSize:11,color:FG+"88"}}>{items.length}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                {items.map((r,i)=><Card key={i} r={r} cat={cat} idx={i}/>)}
              </div>
            </div>
          );
        }):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {(filtered||[]).map((r,i)=><Card key={i} r={r} cat={CAT_DATA.find(c=>c.k===r.category)||CAT_DATA[0]} idx={i}/>)}
          </div>
        )}
      </div>

      {/* Saved FAB */}
      {saved.length>0&&<button onClick={()=>setShowSaved(!showSaved)} style={{position:"fixed",bottom:20,right:20,background:`linear-gradient(135deg,${G},#4A8BBF)`,color:"#fff",border:"none",padding:"12px 20px",cursor:"pointer",fontFamily:FF,fontSize:10,letterSpacing:2,textTransform:"uppercase",zIndex:100,borderRadius:2,boxShadow:"0 4px 16px rgba(27,58,92,0.3)"}}>🧳 {saved.length} · {fmt(totSaved)}</button>}

      {/* Saved panel */}
      {showSaved&&<div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(380px,90vw)",background:"#fff",borderLeft:`1px solid ${FG}10`,zIndex:200,overflowY:"auto",boxShadow:"-8px 0 32px rgba(0,0,0,0.08)"}}>
        <div style={{padding:20,borderBottom:`1px solid ${FG}0D`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:SF,fontSize:18,fontStyle:"italic"}}>{dest} — {t.savedTitle}</div>
          <button onClick={()=>setShowSaved(false)} style={{background:"transparent",border:"none",color:FG+"99",fontSize:18,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"14px 20px"}}>
          {saved.map((it,i)=><div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${FG}08`,display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontSize:13,fontWeight:500}}>{it.title}</div><div style={{fontFamily:FF,fontSize:10,color:FG+"88"}}>{it.location}</div><div style={{fontFamily:SF,fontSize:15,color:G,marginTop:3}}>{it.price}</div></div>
            <button onClick={()=>setSaved(saved.filter(s=>s.title!==it.title))} style={{background:"transparent",border:"none",color:"#C41E3A",cursor:"pointer",opacity:0.4,fontSize:14}}>✕</button>
          </div>)}
        </div>
        <div style={{padding:"16px 20px",borderTop:`1px solid ${G}22`,background:G+"06",position:"sticky",bottom:0}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:FF,fontSize:10,color:FG+"99"}}>{t.totalPp}</span><span style={{fontFamily:SF,fontSize:24,color:G}}>{fmt(totSaved)}</span></div>
        </div>
      </div>}
    </div>
  );

  function Card({r,cat,idx}) {
    const isSv = saved.find(s=>s.title===r.title);
    const isExp = exp===`${cat.k}-${idx}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.title+", "+r.location)}`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(r.title+" "+r.location)}`;
    const bookLink = bookingUrl(r.title, r.location);
    const imgQuery = r.title + " " + r.location;

    return (
      <div onClick={()=>setExp(isExp?null:`${cat.k}-${idx}`)} style={{background:"#fff",border:`1px solid ${FG}0D`,overflow:"hidden",cursor:"pointer",transition:"box-shadow 0.3s, transform 0.3s",borderRadius:3}}>
        {/* Image */}
        <div style={{height:120,background:`linear-gradient(135deg,${cat.bg},#fff)`,position:"relative",overflow:"hidden"}}>
          {UNSPLASH_KEY
            ? <UnsplashImg query={imgQuery} cat={cat} style={{width:"100%",height:"100%",position:"absolute",top:0,left:0}}/>
            : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}><span style={{fontSize:36,opacity:0.1}}>{cat.i}</span></div>
          }
          <div style={{position:"absolute",top:8,left:8,background:"#ffffffDD",padding:"3px 8px",fontFamily:FF,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:cat.c,borderRadius:1}}>{cat.i} {catLabel(cat.k)}</div>
          <div style={{position:"absolute",bottom:8,right:8,background:"#ffffffDD",padding:"3px 8px",fontFamily:FF,fontSize:8,color:FG+"BB",borderRadius:1}}>{t.aiRec}</div>
          {r.orderHint&&<div style={{position:"absolute",top:8,right:8,background:"#ffffffDD",padding:"3px 6px",fontFamily:FF,fontSize:8,color:FG+"88",borderRadius:1}}>#{r.orderHint}</div>}
        </div>

        <div style={{padding:"14px 16px"}}>
          <h4 style={{fontSize:15,fontWeight:500,marginBottom:2,lineHeight:1.3}}>{r.title}</h4>
          <div style={{fontFamily:SF,fontSize:13,fontStyle:"italic",color:G+"99",marginBottom:2}}>{r.location}</div>
          {r.duration&&<div style={{fontFamily:FF,fontSize:10,color:FG+"77",marginBottom:6}}>⏱ {r.duration}</div>}
          <p style={{fontFamily:FF,fontSize:12,lineHeight:1.7,color:FG+"CC",marginBottom:6}}>{r.description}</p>

          {isExp&&<div style={{marginBottom:8,paddingTop:8,borderTop:`1px solid ${FG}0A`}}>
            {r.bookingTip&&<div style={{padding:8,background:G+"06",border:`1px solid ${G}14`,fontFamily:FF,fontSize:11,color:G+"AA",marginBottom:8,borderRadius:2}}>💡 {r.bookingTip}</div>}
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              {r.sourceUrl&&<a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:"#fff",background:G,fontFamily:FF,fontSize:10,textDecoration:"none",padding:"5px 12px",borderRadius:2,fontWeight:500}}>↗ {t.sourceLink}</a>}
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:G,fontFamily:FF,fontSize:10,textDecoration:"none",borderBottom:`1px solid ${G}30`}}>📍 {t.mapsLink}</a>
              <a href={searchUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:G,fontFamily:FF,fontSize:10,textDecoration:"none",borderBottom:`1px solid ${G}30`}}>🔗 {t.infoLink}</a>
              {r.category==="hotel"&&<a href={bookLink} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:"#003580",fontFamily:FF,fontSize:10,textDecoration:"none",borderBottom:"1px solid #00358030",fontWeight:500}}>🏨 {t.bookingLink}</a>}
            </div>
          </div>}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",borderTop:`1px solid ${FG}0A`,paddingTop:8}}>
            <div>
              <div style={{fontFamily:SF,fontSize:19,fontWeight:300,color:G}}>{r.priceNum===0?t.free:r.price}</div>
              <div style={{fontFamily:FF,fontSize:8,color:FG+"77"}}>{r.priceNum===0?t.freeAccess:r.category==="hotel"?t.nightsPp.replace("{d}",dur):r.category==="restaurant"?t.dinnerPp:t.perPerson}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {r.rating&&<span style={{fontFamily:FF,fontSize:11,color:G}}>★ {typeof r.rating==="number"?r.rating.toFixed(1):r.rating}</span>}
              <button onClick={e=>{e.stopPropagation();const ex=saved.find(s=>s.title===r.title);setSaved(ex?saved.filter(s=>s.title!==r.title):[...saved,r])}}
                style={{padding:"6px 12px",border:`1px solid ${G}40`,background:isSv?G+"15":"transparent",color:G,cursor:"pointer",fontFamily:FF,fontSize:9,letterSpacing:1,textTransform:"uppercase",borderRadius:1}}>
                {isSv?"✓":t.save}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
