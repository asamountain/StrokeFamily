import { useEffect, useState } from 'react';
import BrainCanvas from './BrainCanvas.jsx';
import { REGIONS, HEROES, WELLBEING, IOT_SOLUTIONS, BUILDER_PROJECTS } from './data.js';
import { REGIONS_KO, HEROES_KO, WELLBEING_KO, IOT_SOLUTIONS_KO, BUILDER_PROJECTS_KO } from './data.ko.js';
import { useLang, T } from './i18n.js';

const serif = { fontFamily: "'Lora', Georgia, serif" };

const tag = (text, color) => (
  <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color,
    border: `1px solid ${color}40`, borderRadius: 20, padding: '3px 10px' }}>{text}</span>
);

export default function App() {
  const [lang, setLang] = useLang();
  const t = T[lang];
  const regions = lang === 'ko' ? REGIONS_KO : REGIONS;
  const heroes  = lang === 'ko' ? HEROES_KO  : HEROES;
  const wellbeing = lang === 'ko' ? WELLBEING_KO : WELLBEING;
  const iotSolutions = lang === 'ko' ? IOT_SOLUTIONS_KO : IOT_SOLUTIONS;
  const builderProjects = lang === 'ko' ? BUILDER_PROJECTS_KO : BUILDER_PROJECTS;

  const [section, setSection] = useState('home');
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [expandedHero, setExpandedHero] = useState(null);
  const [expandedIoT, setExpandedIoT] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const selectedData = regions.find(r => r.id === selected);

  const NAV = [
    { id:'home', label: t.nav.home },
    { id:'brain', label: t.nav.brain },
    { id:'heroes', label: t.nav.heroes },
    { id:'wellbeing', label: t.nav.wellbeing },
    { id:'iot', label: t.nav.iot },
    { id:'builder', label: t.nav.builder },
    { id:'resources', label: t.nav.resources },
    { id:'community', label: t.nav.community },
  ];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (e) {} };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [section]);

  const go = (id) => { setSection(id); setSelected(null); };
  const handleSelect = (id) => { setSelected(prev => id ? (prev === id ? null : id) : null); };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#100806', color: '#F5EDE0', minHeight: '100vh', overflowX: 'hidden' }}>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(rgba(200,147,74,0.07) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* NAV */}
        <nav style={{ borderBottom: '1px solid rgba(196,48,43,0.18)', padding: '0 20px',
          position: 'sticky', top: 0, zIndex: 100, background: 'rgba(16,8,6,0.94)', backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', height: 54, gap: 0 }}>
            <div style={{ ...serif, fontSize: 15, color: '#C4302B', fontWeight: 600, marginRight: 28, flexShrink: 0, cursor: 'pointer' }}
              onClick={() => go('home')}>{t.nav.brand}</div>
            <div style={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', flex: 1 }}>
              {NAV.map(n => (
                <button key={n.id} onClick={() => go(n.id)} style={{
                  background: section === n.id ? 'rgba(196,48,43,0.14)' : 'transparent',
                  border: 'none', cursor: 'pointer', padding: '5px 11px', borderRadius: 6,
                  fontSize: 12, fontFamily: 'inherit',
                  color: section === n.id ? '#F5EDE0' : '#5A4A42',
                  whiteSpace: 'nowrap', transition: 'all 0.15s'
                }}>{n.label}</button>
              ))}
            </div>
            <button onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')} style={{
              flexShrink: 0, marginLeft: 12, background: 'rgba(200,147,74,0.12)',
              border: '1px solid rgba(200,147,74,0.35)', color: '#C8934A',
              padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
              fontSize: 11, fontFamily: 'inherit', whiteSpace: 'nowrap',
              letterSpacing: '0.04em'
            }}>{t.langToggle}</button>
          </div>
        </nav>

        {/* ── HOME ── */}
        {section === 'home' && (
          <div>
            <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 24px 60px', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 340px' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#C4302B', textTransform: 'uppercase', marginBottom: 18,
                  display: 'inline-block', padding: '4px 14px', border: '1px solid rgba(196,48,43,0.3)', borderRadius: 20 }}>
                  {t.home.location}
                </div>
                <h1 style={{ ...serif, fontSize: 'clamp(26px,5vw,52px)', fontWeight: 400, lineHeight: 1.2, margin: '0 0 24px' }}>
                  {t.home.h1}<br />
                  <em style={{ color: '#C4302B' }}>{t.home.h2}</em>
                </h1>
                <p style={{ color: '#7A8A9A', lineHeight: 1.85, fontSize: 15, maxWidth: 520, marginBottom: 32, fontWeight: 300 }}>
                  {t.home.sub}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[[t.home.btnBrain, '#C4302B', 'brain'], [t.home.btnHeroes, '#5B8DD9', 'heroes'], [t.home.btnIot, '#5BBD8A', 'iot']].map(([l, c, s]) => (
                    <button key={s} onClick={() => go(s)} style={{
                      background: `${c}18`, border: `1px solid ${c}50`, color: c,
                      padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 500
                    }}>{l} →</button>
                  ))}
                </div>
              </div>
              <div style={{ flex: '0 0 auto', width: 'min(420px, 100%)' }}>
                <BrainCanvas selected={selected} hovered={hovered} onSelect={handleSelect} onHover={setHovered} hint={t.brain.hint} />
              </div>
            </div>

            <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px 80px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
                {t.home.cards.map(p => (
                  <div key={p.title} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${p.color}25`, borderRadius: 14, padding: '28px 24px', cursor: 'pointer' }} onClick={() => go(p.target)}>
                    <div style={{ fontSize: 28, marginBottom: 14 }}>{p.icon}</div>
                    <h3 style={{ ...serif, fontSize: 17, fontWeight: 600, color: p.color, margin: '0 0 10px' }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.7, margin: '0 0 16px' }}>{p.desc}</p>
                    <div style={{ fontSize: 13, color: p.color }}>{p.action}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '28px 24px' }}>
              <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
                {t.home.stats.map(([n, l]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ ...serif, fontSize: 28, color: '#C4302B' }}>{n}</div>
                    <div style={{ fontSize: 12, color: '#3A4A5A', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BRAIN ATLAS ── */}
        {section === 'brain' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 20px 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#5B8DD9', textTransform: 'uppercase', marginBottom: 16,
                padding: '4px 14px', border: '1px solid rgba(91,141,217,0.3)', borderRadius: 20, display: 'inline-block' }}>{t.brain.tag}</div>
              <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,44px)', fontWeight: 400, margin: '0 0 14px' }}>{t.brain.title}</h1>
              <p style={{ color: '#6A7A8A', maxWidth: 500, margin: '0 auto', lineHeight: 1.8, fontSize: 14 }}>{t.brain.sub}</p>
            </div>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto', width: 'min(480px,100%)' }}>
                <BrainCanvas selected={selected} hovered={hovered} onSelect={handleSelect} onHover={setHovered} hint={t.brain.hint} />
              </div>
              <div style={{ flex: '1 1 260px' }}>
                {!selectedData ? (
                  <div>
                    {regions.map(reg => (
                      <div key={reg.id} onClick={() => handleSelect(reg.id)} style={{
                        padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                        background: hovered === reg.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${hovered === reg.id ? reg.color + '50' : 'rgba(255,255,255,0.06)'}`,
                        marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s'
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: reg.color, flexShrink: 0, boxShadow: `0 0 8px ${reg.color}80` }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, color: '#E0D8D0', fontWeight: 500 }}>{reg.name}</div>
                          <div style={{ fontSize: 11.5, color: '#3A4A5A', marginTop: 2 }}>{reg.symptom}</div>
                        </div>
                        <div style={{ color: '#2A3A4A' }}>›</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: '1px solid rgba(91,141,217,0.3)', color: '#5B8DD9', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, marginBottom: 22, fontFamily: 'inherit' }}>{t.brain.back}</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: selectedData.color, boxShadow: `0 0 10px ${selectedData.color}` }} />
                      <h2 style={{ ...serif, margin: 0, fontSize: 22, fontWeight: 400 }}>{selectedData.name}</h2>
                    </div>
                    <div style={{ fontSize: 12, color: selectedData.color, marginBottom: 18, letterSpacing: '0.06em' }}>{selectedData.symptom}</div>
                    <div style={{ background: `${selectedData.color}15`, border: `1px solid ${selectedData.color}38`, borderRadius: 10, padding: '14px 16px', marginBottom: 18 }}>
                      <div style={{ fontSize: 10, color: selectedData.color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>{t.brain.familyImpact}</div>
                      <div style={{ fontSize: 14, color: '#E0D8D0', lineHeight: 1.5 }}>{selectedData.impact}</div>
                    </div>
                    <p style={{ fontSize: 13.5, color: '#7A8A9A', lineHeight: 1.85, marginBottom: 20 }}>{selectedData.desc}</p>
                    {selectedData.functions.map(fn => (
                      <div key={fn} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A6A7A', marginBottom: 6 }}>
                        <span style={{ color: selectedData.color, fontSize: 7 }}>◆</span> {fn}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── VOICES OF HOPE ── */}
        {section === 'heroes' && (
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#C4302B', textTransform: 'uppercase', marginBottom: 14 }}>{t.heroes.tag}</div>
              <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,42px)', fontWeight: 400, margin: '0 0 16px' }}>
                {t.heroes.h1}<br /><em style={{ color: '#C4302B' }}>{t.heroes.h2}</em>
              </h1>
              <p style={{ color: '#6A7A8A', lineHeight: 1.8, maxWidth: 580, fontSize: 15, fontWeight: 300 }}>{t.heroes.sub}</p>
            </div>
            {heroes.map((h, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div onClick={() => setExpandedHero(expandedHero === i ? null : i)} style={{
                  padding: '22px 24px', borderRadius: 14, cursor: 'pointer',
                  background: expandedHero === i ? `${h.color}0e` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${expandedHero === i ? h.color + '40' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 4, alignSelf: 'stretch', background: h.color, borderRadius: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                        <h3 style={{ ...serif, margin: 0, fontSize: 17, fontWeight: 600, color: '#E0D8D0' }}>{h.name}</h3>
                        {tag(h.role.split('&')[0].trim(), h.color)}
                      </div>
                      <div style={{ fontSize: 12, color: h.color, marginBottom: expandedHero === i ? 14 : 0 }}>{h.book}</div>
                      {expandedHero === i && (
                        <div>
                          <div style={{ ...serif, fontSize: 16, color: '#C8C0B8', fontStyle: 'italic', margin: '16px 0 14px', lineHeight: 1.6, padding: '12px 16px', borderLeft: `2px solid ${h.color}` }}>
                            "{h.quote}"
                          </div>
                          <p style={{ fontSize: 14, color: '#7A8A9A', lineHeight: 1.8, margin: '0 0 14px' }}>{h.why}</p>
                          <a href={h.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: h.color, textDecoration: 'none' }}>{t.heroes.learnMore}</a>
                        </div>
                      )}
                    </div>
                    <div style={{ color: '#2A3A4A', fontSize: 18, flexShrink: 0 }}>{expandedHero === i ? '↑' : '↓'}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 48, padding: '28px 32px', background: 'rgba(91,141,217,0.07)', border: '1px solid rgba(91,141,217,0.18)', borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: '#5B8DD9', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>{t.heroes.startTag}</div>
              <p style={{ ...serif, fontSize: 15, color: '#C0B8B0', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}
                dangerouslySetInnerHTML={{ __html: t.heroes.startText }} />
            </div>
          </div>
        )}

        {/* ── CAREGIVER WELLBEING ── */}
        {section === 'wellbeing' && (
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#5BBD8A', textTransform: 'uppercase', marginBottom: 14 }}>{t.wellbeing.tag}</div>
              <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,42px)', fontWeight: 400, margin: '0 0 14px' }}>
                {t.wellbeing.h1} <em style={{ color: '#5BBD8A' }}>{t.wellbeing.h2}</em>
              </h1>
              <p style={{ color: '#6A7A8A', lineHeight: 1.8, maxWidth: 580, fontSize: 15, fontWeight: 300 }}>{t.wellbeing.sub}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
              {wellbeing.map((w, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${w.color}28`, borderRadius: 14, padding: '22px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{w.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#E0D8D0' }}>{w.skill}</div>
                      <div style={{ fontSize: 11, color: w.color, marginTop: 2 }}>{w.time} · {w.level}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#7A8A9A', lineHeight: 1.75, margin: '0 0 10px' }}>
                    <strong style={{ color: '#9AA8B0', fontWeight: 500 }}>{t.wellbeing.why}</strong>{w.why}
                  </p>
                  <p style={{ fontSize: 13, color: '#6A7A8A', lineHeight: 1.7, margin: '0 0 10px' }}>
                    <strong style={{ color: '#9AA8B0', fontWeight: 500 }}>{t.wellbeing.how}</strong>{w.how}
                  </p>
                  {w.link && (
                    <a href={w.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: w.color, textDecoration: 'none' }}>
                      {w.linkLabel} →
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 48, padding: '24px 28px', background: 'rgba(91,179,138,0.07)', border: '1px solid rgba(91,179,138,0.2)', borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: '#5BBD8A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>{t.wellbeing.truthTag}</div>
              <p style={{ ...serif, fontSize: 16, color: '#C0B8B0', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}
                dangerouslySetInnerHTML={{ __html: t.wellbeing.truthText }} />
            </div>
          </div>
        )}

        {/* ── IOT / SMART HOME ── */}
        {section === 'iot' && (
          <div style={{ maxWidth: 1060, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#5BBD8A', textTransform: 'uppercase', marginBottom: 14 }}>{t.iot.tag}</div>
              <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,42px)', fontWeight: 400, margin: '0 0 14px' }}>
                {t.iot.h1} <em style={{ color: '#5BBD8A' }}>{t.iot.h2}</em>
              </h1>
              <p style={{ color: '#6A7A8A', lineHeight: 1.8, maxWidth: 600, fontSize: 15, fontWeight: 300 }}>{t.iot.sub}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
              {iotSolutions.map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${expandedIoT === i ? s.color + '50' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 14, padding: '22px 20px', cursor: 'pointer', transition: 'all 0.2s'
                }} onClick={() => setExpandedIoT(expandedIoT === i ? null : i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 26 }}>{s.icon}</span>
                    {tag(s.difficulty, s.color)}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#E0D8D0', margin: '0 0 8px' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#6A7A8A', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                  {expandedIoT === i && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${s.color}30` }}>
                      <div style={{ fontSize: 12, color: s.color, marginBottom: 8, fontWeight: 600 }}>{t.iot.familyImpact}</div>
                      <p style={{ fontSize: 13, color: '#8A9AAA', lineHeight: 1.7, margin: '0 0 14px' }}>{s.impact}</p>
                      <div style={{ fontSize: 11, color: '#3A4A5A', marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.iot.hardwareNeeded}</div>
                      {s.hardware.map(h => (
                        <div key={h} style={{ fontSize: 12, color: '#5A6A7A', marginBottom: 4, display: 'flex', gap: 8 }}>
                          <span style={{ color: s.color }}>·</span>{h}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 48, padding: '24px 28px', background: 'rgba(196,48,43,0.07)', border: '1px solid rgba(196,48,43,0.2)', borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: '#C4302B', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>{t.iot.firstTag}</div>
              <p style={{ fontSize: 15, color: '#B0A8A0', lineHeight: 1.75, margin: 0 }}
                dangerouslySetInnerHTML={{ __html: t.iot.firstText }} />
            </div>
          </div>
        )}

        {/* ── BUILD WITH PURPOSE ── */}
        {section === 'builder' && (
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#D9A84E', textTransform: 'uppercase', marginBottom: 14 }}>{t.builder.tag}</div>
              <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,42px)', fontWeight: 400, margin: '0 0 14px' }}>
                {t.builder.h1}<br /><em style={{ color: '#D9A84E' }}>{t.builder.h2}</em>
              </h1>
              <p style={{ color: '#6A7A8A', lineHeight: 1.8, maxWidth: 620, fontSize: 15, fontWeight: 300 }}>{t.builder.sub}</p>
            </div>
            <div style={{ background: 'rgba(217,168,78,0.08)', border: '1px solid rgba(217,168,78,0.25)', borderRadius: 14, padding: '22px 26px', marginBottom: 36 }}>
              <div style={{ fontSize: 11, color: '#D9A84E', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>{t.builder.crossTag}</div>
              <p style={{ fontSize: 15, color: '#B8A898', lineHeight: 1.8, margin: 0 }}
                dangerouslySetInnerHTML={{ __html: t.builder.crossText }} />
            </div>
            {builderProjects.map((p, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div onClick={() => setExpandedProject(expandedProject === i ? null : i)} style={{
                  padding: '22px 24px', borderRadius: 14, cursor: 'pointer',
                  background: expandedProject === i ? `${p.color}0e` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${expandedProject === i ? p.color + '50' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 4, alignSelf: 'stretch', background: p.color, borderRadius: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 6 }}>{tag(p.phase, p.color)}</div>
                      <h3 style={{ ...serif, fontSize: 18, fontWeight: 600, color: '#E0D8D0', margin: '6px 0 8px' }}>{p.title}</h3>
                      <p style={{ fontSize: 13.5, color: '#7A8A9A', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                      {expandedProject === i && (
                        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${p.color}28` }}>
                          <div style={{ fontSize: 12, color: p.color, marginBottom: 10, fontWeight: 600, letterSpacing: '0.06em' }}>{t.builder.whyPath}</div>
                          <p style={{ fontSize: 13.5, color: '#8A9AAA', lineHeight: 1.8, margin: '0 0 20px' }}>{p.why}</p>
                          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 200px' }}>
                              <div style={{ fontSize: 11, color: '#3A4A5A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>{t.builder.skillsTag}</div>
                              {p.skills.map(s => (
                                <div key={s} style={{ fontSize: 13, color: '#5A7A6A', marginBottom: 6, display: 'flex', gap: 8 }}>
                                  <span style={{ color: p.color }}>◆</span>{s}
                                </div>
                              ))}
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                              <div style={{ fontSize: 11, color: '#3A4A5A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>{t.builder.stepsTag}</div>
                              {p.steps.map((s, j) => (
                                <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${p.color}25`, border: `1px solid ${p.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: p.color, flexShrink: 0 }}>{j + 1}</div>
                                  <div style={{ fontSize: 12, color: '#5A6A7A', lineHeight: 1.6 }}>{s}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ color: '#2A3A4A', fontSize: 18, flexShrink: 0 }}>{expandedProject === i ? '↑' : '↓'}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 48, padding: '28px 32px', background: 'rgba(91,179,138,0.07)', border: '1px solid rgba(91,179,138,0.22)', borderRadius: 14 }}>
              <div style={{ fontSize: 11, color: '#5BBD8A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>{t.builder.bigTag}</div>
              <p style={{ fontSize: 15, color: '#B0C0B8', lineHeight: 1.8, margin: '0 0 12px' }}>{t.builder.bigText}</p>
              <p style={{ fontSize: 13, color: '#4A7A6A', margin: 0 }}>{t.builder.bigSub}</p>
            </div>
          </div>
        )}

        {/* ── LOCAL RESOURCES ── */}
        {section === 'resources' && (
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#5BBD8A', textTransform: 'uppercase', marginBottom: 14 }}>{t.resources.tag}</div>
            <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,40px)', fontWeight: 400, margin: '0 0 12px' }}>{t.resources.title}</h1>
            <p style={{ color: '#6A7A8A', marginBottom: 40, lineHeight: 1.7 }}>{t.resources.sub}</p>
            <div style={{ background: 'linear-gradient(135deg,rgba(91,141,217,0.12),rgba(91,141,217,0.05))', border: '1px solid rgba(91,141,217,0.3)', borderRadius: 14, padding: '24px 28px', marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: '#5B8DD9', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>{t.resources.firstCallTag}</div>
              <h3 style={{ ...serif, fontSize: 20, fontWeight: 600, color: '#7AA8F0', margin: '0 0 6px' }}>{t.resources.adrcName}</h3>
              <div style={{ fontSize: 24, color: '#F0EAE0', fontWeight: 500, marginBottom: 8 }}>{t.resources.adrcPhone}</div>
              <p style={{ color: '#8A9AAA', margin: '0 0 10px', lineHeight: 1.6, fontSize: 14 }}>{t.resources.adrcDesc}</p>
              <div style={{ fontSize: 13, color: '#5B8DD9' }}>{t.resources.adrcAddr}</div>
            </div>
            {t.resources.items.map((r, i) => (
              <div key={i} style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 3, background: r.c, borderRadius: 2, flexShrink: 0, alignSelf: 'stretch' }} />
                  <div>
                    <div style={{ fontSize: 15, color: '#E0D8D0', fontWeight: 500, marginBottom: 3 }}>{r.t}</div>
                    <div style={{ fontSize: 13, color: '#4A5A6A', marginBottom: 5 }}>{r.s}</div>
                    <div style={{ fontSize: 13, color: r.c }}>{r.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── COMMUNITY ── */}
        {section === 'community' && (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#5BBD8A', textTransform: 'uppercase', marginBottom: 16 }}>{t.community.tag}</div>
              <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,42px)', fontWeight: 400, margin: '0 0 14px' }}>
                {t.community.h1} <em style={{ color: '#5BBD8A' }}>{t.community.h2}</em>
              </h1>
              <p style={{ color: '#8A9BB5', maxWidth: 500, margin: '0 auto', lineHeight: 1.8, fontSize: 15, fontWeight: 300 }}>{t.community.sub}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 52 }}>
              {t.community.features.map(([icon, title, desc, color]) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}22`, borderRadius: 14, padding: '24px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#3A4A5A', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
            {t.community.platforms.map((item, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 3, alignSelf: 'stretch', background: item.c, borderRadius: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: '#E0D8D0', fontWeight: 500, marginBottom: 5 }}>{item.p}</div>
                  <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.65, margin: '0 0 8px' }}>{item.d}</p>
                  <a href={item.l} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: item.c }}>{t.community.visit}</a>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 52, textAlign: 'center', padding: '36px 28px', background: 'rgba(196,48,43,0.06)', border: '1px solid rgba(196,48,43,0.18)', borderRadius: 16 }}>
              <p style={{ ...serif, fontSize: 18, color: '#E0C8C0', margin: '0 0 10px', fontStyle: 'italic', lineHeight: 1.7 }}>
                {t.community.quote.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </p>
              <div style={{ fontSize: 12, color: '#4A5A6A' }}>{t.community.quoteAttr}</div>
            </div>
          </div>
        )}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#2A3A4A', margin: 0 }}>{t.footer}</p>
        </div>
      </div>
    </div>
  );
}
