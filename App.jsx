import { useState } from "react";
import { SITE } from "./siteConfig";

// Photos are read automatically from these folders (just drop images in):
const glob = (m) => Object.entries(m).sort(([a],[b]) => a.localeCompare(b, undefined, {numeric:true}))
  .map(([path, url]) => ({ url, label: path.split("/").pop().replace(/\.[^.]+$/, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ") }));
const GALLERY = glob(import.meta.glob("./photos/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", { eager:true, query:"?url", import:"default" }));
const DESIGNS = glob(import.meta.glob("./photos/designs/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", { eager:true, query:"?url", import:"default" }));

const RED = "#E63946";
const RED_DARK = "#b02a34";
const RED_GLOW = "#E6394622";
const UNSPLASH_TATTOO = "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=1600&q=80&fit=crop";

const testimonials = [
  { name: "Maya R.", stars: 5, review: "Absolutely mind-blowing work. The detail on my sleeve is beyond anything I imagined. This studio is in a league of its own.", location: "Mumbai" },
  { name: "Kiran S.", stars: 5, review: "Walked in with zero ideas, walked out with a masterpiece. The consultation changed everything. Total legends.", location: "Delhi" },
  { name: "Priya T.", stars: 5, review: "Three years later and it still looks fresh. The aftercare guidance was incredible. Zero regrets, maximum art.", location: "Pune" },
  { name: "Arjun V.", stars: 4, review: "High-end vibes from the moment you walk in. Came for a small piece and left planning a full back piece. It's that good.", location: "Bangalore" },
];

const SECTIONS = ["HOME","GALLERY","DESIGNS","REVIEWS","BOOK","VISIT"];

function Stars({ n }) {
  return (
    <div style={{ display:"flex", gap:"4px", marginBottom:"12px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="18" height="18" viewBox="0 0 16 16" fill={i<=n ? RED : "#333"}>
          <polygon points="8,1 10.1,6 15.5,6.3 11.5,9.8 12.8,15.1 8,12.1 3.2,15.1 4.5,9.8 0.5,6.3 5.9,6"/>
        </svg>
      ))}
    </div>
  );
}

function PhotoGrid({ items, empty, preferred, onPrefer }) {
  if (!items.length) return (
    <div style={{ border:"1px dashed #2a2a2a", borderRadius:"4px", padding:"4rem 1rem", textAlign:"center", color:"#666", fontSize:"16px", letterSpacing:"1px" }}>{empty}</div>
  );
  return (
    <div className="grid3">
      {items.map((it, i) => {
        const on = preferred?.includes(i);
        return (
          <div key={it.url} className="photo-card" style={{ position:"relative", aspectRatio:"3/4", background:"#111", borderRadius:"4px", overflow:"hidden",
            border: on ? `2px solid ${RED}` : "2px solid transparent", boxShadow: on ? `0 0 24px ${RED_GLOW}` : "none" }}>
            <img src={it.url} alt={it.label} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)", padding:"16px", display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:"8px" }}>
              <span style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"20px", color:"#fff", letterSpacing:"2px", textTransform:"capitalize" }}>{it.label}</span>
              {onPrefer && (
                <button onClick={() => onPrefer(i)} style={{ background:on?RED:"rgba(255,255,255,0.14)", border:`1px solid ${on?RED:"rgba(255,255,255,0.3)"}`, color:"#fff", padding:"12px 0", borderRadius:"3px", fontFamily:"'Bebas Neue', cursive", fontSize:"15px", letterSpacing:"3px", cursor:"pointer", width:"100%" }}>
                  {on ? "✓ ADDED TO PREFERENCE" : "ADD TO PREFERENCE"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Inkology() {
  const [preferred, setPreferred] = useState([]);
  const [form, setForm] = useState({ name:"", email:"", phone:"", idea:"", placement:"", date:"", website:"" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const togglePrefer = (i) => setPreferred(p => p.includes(i) ? p.filter(x=>x!==i) : [...p, i]);
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const submit = async () => {
    if (!(form.name && form.email && form.idea)) { setError("Please fill your name, email and idea."); return; }
    setSending(true); setError("");
    try {
      const r = await fetch("/.netlify/functions/book", { method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...form, designs: preferred.map(i => DESIGNS[i]?.label).filter(Boolean) }) });
      if (!r.ok) throw new Error();
      setSubmitted(true);
    } catch { setError(`Could not send. Please WhatsApp us on ${SITE.phone}.`); }
    setSending(false);
  };

  return (
    <div style={{ fontFamily:"'Oswald', sans-serif", background:"#080808", color:"#e8e2d9", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;500;600&family=Permanent+Marker&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${RED}; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: ${RED}; }
        .card-overlay { opacity: 0 !important; }
        .upload-card:hover .card-overlay { opacity: 1 !important; }
        .upload-card-filled .card-overlay { opacity: 1 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        .hero-title { animation: fadeUp 1s ease forwards; }
        .hero-sub { animation: fadeUp 1s ease 0.3s forwards; opacity:0; }
        .hero-cta { animation: fadeUp 1s ease 0.6s forwards; opacity:0; }
        input, textarea { background: #111 !important; color: #e8e2d9 !important; font-family: 'Oswald', sans-serif !important; font-size:16px !important; border: 1px solid #2a2a2a !important; padding: 14px 16px !important; width:100% !important; outline:none !important; border-radius:3px !important; transition: border 0.2s !important; }
        input:focus, textarea:focus { border-color: ${RED} !important; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        .grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .grid2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .formgrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .photo-card { transition: transform .25s; } .photo-card:hover { transform: scale(1.02); }
        button:focus-visible, a:focus-visible { outline:2px solid ${RED}; outline-offset:2px; }
        .stats { flex-wrap:wrap; }
        @media (max-width: 900px) {
          .nav-links { display:none !important; }
          nav { padding:0 1rem !important; }
          section { padding-left:1.25rem !important; padding-right:1.25rem !important; padding-top:70px !important; padding-bottom:70px !important; }
          #home { padding-top:0 !important; padding-bottom:0 !important; }
          .grid3 { grid-template-columns:repeat(2,1fr); }
          .grid2, .formgrid { grid-template-columns:1fr; }
          .formgrid > div { grid-column:1/-1 !important; }
          .stats > div { padding:12px 18px !important; flex:1 1 40%; }
          .mapbox { grid-template-columns:1fr !important; }
        }
        @media (max-width: 480px) { .grid3 { grid-template-columns:1fr; } }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        background:"rgba(6,6,6,0.95)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid #1a1a1a",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 2.5rem", height:"68px"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"32px", height:"32px", background:RED, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>☠</div>
          <span style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"30px", color:"#fff", letterSpacing:"4px" }}>
            INKOLOGY
          </span>
        </div>
        <div className="nav-links" style={{ display:"flex", gap:"2rem" }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => scrollTo(s.toLowerCase())} style={{
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Bebas Neue', cursive", fontSize:"17px", letterSpacing:"3px",
              color:"#666", transition:"color 0.2s",
            }}
              onMouseEnter={e=>e.target.style.color=RED}
              onMouseLeave={e=>e.target.style.color="#666"}
            >{s}</button>
          ))}
        </div>
        <button onClick={()=>scrollTo("book")} style={{
          background:RED, color:"#fff", border:"none",
          fontFamily:"'Bebas Neue', cursive", fontSize:"16px", letterSpacing:"3px",
          padding:"10px 28px", cursor:"pointer", borderRadius:"3px", transition:"background 0.2s"
        }}
          onMouseEnter={e=>e.target.style.background=RED_DARK}
          onMouseLeave={e=>e.target.style.background=RED}
        >BOOK NOW</button>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight:"100vh", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        {/* Real background image */}
        <img src={UNSPLASH_TATTOO} alt="tattoo artist" style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"center 30%", opacity:0.28
        }} onError={e => e.target.style.display="none"} />
        {/* Gradient overlay */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.6) 50%, rgba(8,8,8,1) 100%)" }} />
        {/* Scanline effect */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)", pointerEvents:"none", zIndex:2 }} />

        <div style={{ position:"relative", zIndex:3, textAlign:"center", padding:"0 2rem", maxWidth:"900px" }}>
          <p className="hero-sub" style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"18px", letterSpacing:"10px", color:RED, marginBottom:"20px", display:"block" }}>
            ✦ MUMBAI'S PREMIER TATTOO STUDIO ✦
          </p>
          <h1 className="hero-title" style={{
            fontFamily:"'Bebas Neue', cursive",
            fontSize:"clamp(80px, 18vw, 180px)",
            lineHeight:0.85, letterSpacing:"6px",
            color:"#fff",
            textShadow:"0 0 80px rgba(230,57,70,0.3)",
          }}>
            INK<span style={{ color:RED }}>OL</span>OGY
          </h1>
          <p className="hero-sub" style={{
            fontFamily:"'Oswald', sans-serif", fontSize:"clamp(16px, 2.5vw, 22px)",
            color:"#bbb", letterSpacing:"4px", margin:"24px 0 40px",
            fontWeight:300, textTransform:"uppercase"
          }}>
            Where Your Skin Becomes the Canvas
          </p>
          <div className="hero-cta" style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>scrollTo("book")} style={{
              background:RED, color:"#fff", border:"none",
              fontFamily:"'Bebas Neue', cursive", fontSize:"20px", letterSpacing:"4px",
              padding:"16px 52px", cursor:"pointer", borderRadius:"3px",
              boxShadow:`0 0 30px ${RED_GLOW}`, transition:"all 0.2s"
            }}
              onMouseEnter={e=>{ e.target.style.background=RED_DARK; e.target.style.transform="scale(1.04)"; }}
              onMouseLeave={e=>{ e.target.style.background=RED; e.target.style.transform="scale(1)"; }}
            >BOOK A SESSION</button>
            <button onClick={()=>scrollTo("gallery")} style={{
              background:"transparent", color:"#fff",
              border:"2px solid rgba(255,255,255,0.3)",
              fontFamily:"'Bebas Neue', cursive", fontSize:"20px", letterSpacing:"4px",
              padding:"16px 52px", cursor:"pointer", borderRadius:"3px", transition:"all 0.2s"
            }}
              onMouseEnter={e=>{ e.target.style.borderColor="#fff"; }}
              onMouseLeave={e=>{ e.target.style.borderColor="rgba(255,255,255,0.3)"; }}
            >VIEW WORK</button>
          </div>
        </div>

        {/* Bottom strip stats */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, zIndex:4,
          background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)",
          borderTop:"1px solid #1a1a1a",
          display:"flex", justifyContent:"center", gap:"0"
        }}>
          {[["500+","TATTOOS DONE"],["8+","YEARS EXP"],["100%","CUSTOM ART"],["⭐ 4.9","RATED"]].map(([n,l],i)=>(
            <div key={i} style={{
              padding:"20px 48px", textAlign:"center",
              borderRight: i < 3 ? "1px solid #1a1a1a" : "none"
            }}>
              <div style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"32px", color:RED, letterSpacing:"2px" }}>{n}</div>
              <div style={{ fontFamily:"'Oswald', sans-serif", fontSize:"11px", color:"#666", letterSpacing:"3px", marginTop:"2px" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>
      {/* ── GALLERY ── */}
      <section id="gallery" style={{ padding:"100px 3rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          {/* Section header */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"50px", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", letterSpacing:"6px", color:RED, marginBottom:"8px" }}>OUR WORK</p>
              <h2 style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"clamp(48px, 6vw, 80px)", color:"#fff", lineHeight:1, letterSpacing:"3px" }}>
                PAST <span style={{ WebkitTextStroke:"1px #fff", color:"transparent" }}>TATTOOS</span>
              </h2>
            </div>
            <p style={{ fontFamily:"'Oswald', sans-serif", fontWeight:300, fontSize:"16px", color:"#888", maxWidth:"320px", lineHeight:1.7 }}>
              A look at our recent work, done with love for every client.
            </p>
          </div>

          <PhotoGrid items={GALLERY} empty="New work coming soon ✦" />
        </div>
      </section>

      {/* ── AVAILABLE DESIGNS ── */}
      <section id="designs" style={{ padding:"100px 3rem", background:"#050505", borderTop:"1px solid #111", borderBottom:"1px solid #111" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"50px", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", letterSpacing:"6px", color:RED, marginBottom:"8px" }}>CHOOSE YOURS</p>
              <h2 style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"clamp(48px, 6vw, 80px)", color:"#fff", lineHeight:1, letterSpacing:"3px" }}>
                AVAILABLE <span style={{ WebkitTextStroke:"1px #fff", color:"transparent" }}>DESIGNS</span>
              </h2>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontFamily:"'Oswald', sans-serif", fontWeight:300, fontSize:"16px", color:"#888", lineHeight:1.7 }}>
                Flash & custom designs ready to tattoo.<br/>Tap “Add to preference”, we'll confirm your slot.
              </p>
              {preferred.length > 0 && (
                <div style={{ marginTop:"10px", background:RED, color:"#fff", display:"inline-block", padding:"6px 20px", borderRadius:"3px", fontFamily:"'Bebas Neue', cursive", fontSize:"16px", letterSpacing:"2px" }}>
                  {preferred.length} DESIGN{preferred.length > 1 ? "S" : ""} PREFERRED ✓
                </div>
              )}
            </div>
          </div>

          <PhotoGrid items={DESIGNS} empty="Designs coming soon ✦" preferred={preferred} onPrefer={togglePrefer} />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" style={{ padding:"100px 3rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"60px" }}>
            <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", letterSpacing:"6px", color:RED, marginBottom:"8px" }}>REAL CLIENTS</p>
            <h2 style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"clamp(48px, 6vw, 80px)", color:"#fff", letterSpacing:"3px", lineHeight:1 }}>
              WHAT THEY <span style={{ WebkitTextStroke:"1px #fff", color:"transparent" }}>SAY</span>
            </h2>
          </div>

          <div className="grid2">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background:"#0d0d0d",
                border:"1px solid #1a1a1a",
                borderTop: i < 2 ? `3px solid ${RED}` : "1px solid #1a1a1a",
                padding:"2.5rem", borderRadius:"4px",
                transition:"border-color 0.2s"
              }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=RED}
                onMouseLeave={e=>e.currentTarget.style.borderColor= i<2 ? RED : "#1a1a1a"}
              >
                <Stars n={t.stars} />
                <p style={{ fontFamily:"'Oswald', sans-serif", fontWeight:300, fontSize:"18px", color:"#ccc", lineHeight:1.8, marginBottom:"1.5rem", fontStyle:"italic" }}>
                  "{t.review}"
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                  <div style={{ width:"44px", height:"44px", background:RED, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue', cursive", fontSize:"20px", color:"#fff", flexShrink:0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"20px", color:"#fff", letterSpacing:"2px" }}>{t.name}</p>
                    <p style={{ fontFamily:"'Oswald', sans-serif", fontSize:"12px", color:RED, letterSpacing:"3px", textTransform:"uppercase", marginTop:"2px" }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="book" style={{ padding:"100px 3rem", background:"#050505", borderTop:"1px solid #111" }}>
        <div style={{ maxWidth:"820px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"60px" }}>
            <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", letterSpacing:"6px", color:RED, marginBottom:"8px" }}>LET'S CREATE</p>
            <h2 style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"clamp(48px, 6vw, 80px)", color:"#fff", letterSpacing:"3px", lineHeight:1 }}>
              BOOK A <span style={{ color:RED }}>SESSION</span>
            </h2>
            <p style={{ fontFamily:"'Oswald', sans-serif", fontWeight:300, fontSize:"16px", color:"#999", marginTop:"16px", letterSpacing:"1px", lineHeight:1.7 }}>
              Ready to get inked? Fill in your details and we'll reach out within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign:"center", padding:"5rem 2rem", border:`2px solid ${RED}`, background:"#0a0a0a", borderRadius:"4px", boxShadow:`0 0 40px ${RED_GLOW}` }}>
              <div style={{ fontSize:"64px", marginBottom:"1.5rem" }}>☠</div>
              <h3 style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"40px", color:RED, letterSpacing:"4px", marginBottom:"16px" }}>YOU'RE BOOKED IN</h3>
              <p style={{ fontFamily:"'Oswald', sans-serif", fontWeight:300, fontSize:"18px", color:"#999", lineHeight:1.8 }}>
                Thanks {form.name}! We'll hit you up within 24 hours to lock in your session.<br/>
                Get ready — your skin's about to be a masterpiece.
              </p>
              {preferred.length > 0 && (
                <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"16px", color:RED, marginTop:"20px", letterSpacing:"2px" }}>
                  {preferred.length} PREFERRED DESIGN{preferred.length>1?"S":""} NOTED ✓
                </p>
              )}
            </div>
          ) : (
            <div className="formgrid">
              {[
                { label:"FULL NAME *", key:"name", type:"text", placeholder:"Your full name" },
                { label:"EMAIL ADDRESS *", key:"email", type:"email", placeholder:"your@email.com" },
                { label:"PHONE NUMBER", key:"phone", type:"tel", placeholder:"+91 XXXXX XXXXX" },
                { label:"PREFERRED DATE", key:"date", type:"date", placeholder:"" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"13px", letterSpacing:"3px", color:"#999", display:"block", marginBottom:"8px" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
                </div>
              ))}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"13px", letterSpacing:"3px", color:"#999", display:"block", marginBottom:"8px" }}>BODY PLACEMENT</label>
                <input type="text" placeholder="e.g. inner forearm, upper back, ribs..." value={form.placement} onChange={e=>setForm({...form,placement:e.target.value})} />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"13px", letterSpacing:"3px", color:"#999", display:"block", marginBottom:"8px" }}>DESCRIBE YOUR IDEA *</label>
                <textarea rows={6} placeholder="Tell us your vision — style (blackwork, realism, traditional...), size, meaning, reference images, anything!" value={form.idea} onChange={e=>setForm({...form,idea:e.target.value})} style={{ resize:"vertical" }} />
              </div>
              {preferred.length > 0 && (
                <div style={{ gridColumn:"1/-1", background:"#0d0d0d", border:`1px solid ${RED}22`, borderLeft:`3px solid ${RED}`, padding:"14px 18px", borderRadius:"3px" }}>
                  <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", color:RED, letterSpacing:"3px" }}>
                    {preferred.length} PREFERRED DESIGN{preferred.length>1?"S":""} WILL BE INCLUDED IN YOUR REQUEST ✓
                  </p>
                </div>
              )}
              <div style={{ gridColumn:"1/-1" }}>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} style={{ position:"absolute", left:"-9999px", width:"1px", height:"1px", opacity:0 }} aria-hidden="true" />
                {error && <p style={{ color:RED, fontSize:"15px", marginBottom:"10px", textAlign:"center" }}>{error}</p>}
                <button disabled={sending} onClick={submit} style={{
                  width:"100%", background:RED, color:"#fff", border:"none",
                  fontFamily:"'Bebas Neue', cursive", fontSize:"22px", letterSpacing:"5px",
                  padding:"20px", cursor:"pointer", borderRadius:"3px", opacity: sending ? 0.6 : 1,
                  boxShadow:`0 4px 30px ${RED_GLOW}`, transition:"all 0.2s"
                }}>{sending ? "SENDING..." : "SEND BOOKING REQUEST →"}</button>
                <p style={{ fontFamily:"'Oswald', sans-serif", fontSize:"12px", color:"#444", textAlign:"center", marginTop:"12px", letterSpacing:"1px" }}>
                  * Required fields. We'll respond within 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section id="visit" style={{ padding:"100px 3rem", borderTop:"1px solid #111" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ marginBottom:"40px" }}>
            <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", letterSpacing:"6px", color:RED, marginBottom:"8px" }}>FIND US</p>
            <h2 style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"clamp(48px, 6vw, 80px)", color:"#fff", lineHeight:1, letterSpacing:"3px" }}>
              VISIT THE <span style={{ WebkitTextStroke:"1px #fff", color:"transparent" }}>STUDIO</span>
            </h2>
          </div>
          <div className="mapbox" style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:"24px", alignItems:"stretch" }}>
            <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderTop:`3px solid ${RED}`, borderRadius:"4px", padding:"2rem", display:"flex", flexDirection:"column", gap:"20px" }}>
              {[["ADDRESS", SITE.address],["PHONE", SITE.phone],["HOURS", SITE.hours]].map(([k,v]) => (
                <div key={k}>
                  <p style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", letterSpacing:"4px", color:RED, marginBottom:"4px" }}>{k}</p>
                  <p style={{ fontSize:"17px", color:"#ccc", fontWeight:300, lineHeight:1.6 }}>{v}</p>
                </div>
              ))}
              <a href={SITE.mapsLink} target="_blank" rel="noreferrer" style={{ marginTop:"auto", background:RED, color:"#fff", textAlign:"center", textDecoration:"none", fontFamily:"'Bebas Neue', cursive", fontSize:"18px", letterSpacing:"4px", padding:"14px", borderRadius:"3px" }}>GET DIRECTIONS →</a>
            </div>
            <iframe title="Studio location" src={`https://maps.google.com/maps?q=${SITE.lat},${SITE.lng}&z=16&output=embed`} loading="lazy"
              style={{ width:"100%", minHeight:"340px", border:"1px solid #1a1a1a", borderRadius:"4px", filter:"grayscale(1) invert(0.92) contrast(0.9)" }} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#030303", borderTop:"1px solid #111", padding:"3rem 3rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1.5rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"28px", height:"28px", background:RED, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>☠</div>
            <span style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"24px", color:"#fff", letterSpacing:"4px" }}>INKOLOGY</span>
          </div>
          <p style={{ fontFamily:"'Oswald', sans-serif", fontSize:"13px", color:"#3a3a3a", letterSpacing:"1px" }}>
            © 2025 Inkology Studio · Mumbai, India · All Rights Reserved
          </p>
          <div style={{ display:"flex", gap:"1.5rem" }}>
            {[["INSTAGRAM", SITE.instagram],["WHATSAPP", `https://wa.me/${SITE.whatsapp}`],["DIRECTIONS", SITE.mapsLink]].map(([s,u])=>(
              <a key={s} href={u} target="_blank" rel="noreferrer" style={{ fontFamily:"'Bebas Neue', cursive", fontSize:"14px", letterSpacing:"3px", color:"#777", textDecoration:"none" }}>{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
