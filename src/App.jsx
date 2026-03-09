import { useEffect, useState } from 'react';
import BrainCanvas from './BrainCanvas.jsx';
import SurveySection from './SurveySection.jsx';
import { REGIONS, HEROES, WELLBEING } from './data.js';
import { REGIONS_KO, HEROES_KO, WELLBEING_KO } from './data.ko.js';
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

  const [section, setSection] = useState('home');
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [expandedHero, setExpandedHero] = useState(null);
  const selectedData = regions.find(r => r.id === selected);

  const NAV = [
    { id:'home', label: t.nav.home },
    { id:'brain', label: t.nav.brain },
    { id:'heroes', label: t.nav.heroes },
    { id:'wellbeing', label: t.nav.wellbeing },
    { id:'claude', label: t.nav.claude },
    { id:'resources', label: t.nav.resources },
    { id:'community', label: t.nav.community },
    { id:'survey', label: t.nav.survey },
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
                  {[[t.home.btnBrain, '#C4302B', 'brain'], [t.home.btnHeroes, '#5B8DD9', 'heroes'], [t.home.btnClaude, '#C8934A', 'claude']].map(([l, c, s]) => (
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

        {/* ── AI COMPANION (CLAUDE) ── */}
        {section === 'claude' && (() => {
          const tc = t.claude;
          const accent = '#C8934A';
          const useCases = [
            {
              icon: '💔',
              title: 'Immediate emotional relief',
              prompt: '"I\'m so angry at my dad right now and I feel terrible about it. Can you help me understand why I feel this way?"',
              why: 'Claude can validate, reframe, and give you language for what you\'re experiencing — at 2am when no one else is available.',
              color: '#D96F8A',
            },
            {
              icon: '📋',
              title: 'Translating medical jargon',
              prompt: '"His discharge papers say \'left MCA territory infarct with expressive aphasia.\' What does this actually mean for daily life?"',
              why: 'Turn clinical language into plain understanding of what to expect and how to adapt.',
              color: '#5B8DD9',
            },
            {
              icon: '🩺',
              title: 'Preparing for doctor appointments',
              prompt: '"I have 15 minutes with his neurologist tomorrow. What are the 5 most important questions I should ask?"',
              why: 'Arrive prepared. Use every minute of limited specialist time effectively.',
              color: '#5BBD8A',
            },
            {
              icon: '🗺️',
              title: 'Navigating care systems',
              prompt: '"I\'m in Milwaukee County, we have limited income, Dad had a stroke 3 months ago — what programs might we qualify for and how do I apply?"',
              why: 'Claude can map the landscape of options specific to your location and situation.',
              color: '#E8735A',
            },
            {
              icon: '✉️',
              title: 'Writing hard communications',
              prompt: '"Help me write a message to my siblings explaining why I need them to take shifts. I\'m scared they\'ll say no."',
              why: 'Get the words right when the stakes are high and emotions make it hard to think clearly.',
              color: '#9B6FD9',
            },
            {
              icon: '⚡',
              title: 'Behavior decoding in the moment',
              prompt: '"He just screamed at my mom for no reason. She\'s crying. What\'s happening neurologically and what do I say to her right now?"',
              why: 'Understand the brain science behind sudden behaviors so you can respond instead of react.',
              color: '#D9A84E',
            },
            {
              icon: '🌧️',
              title: 'Processing grief',
              prompt: '"I keep thinking about who he was before. I miss him even though he\'s still here. Is this normal?"',
              why: 'Ambiguous grief — mourning someone who is still alive — is one of the loneliest parts of caregiving. Claude won\'t minimize it.',
              color: '#7A9DD9',
            },
            {
              icon: '🔄',
              title: 'Building adaptive routines',
              prompt: '"He resists bathing every morning. Can you help me design a routine that works around his frontal lobe damage?"',
              why: 'Move from power struggles to neuroscience-informed strategies that actually work.',
              color: '#5BBD8A',
            },
          ];
          const patterns = [
            {
              name: 'The Situation Dump',
              template: '"Here\'s my situation: [describe everything]. What do I need to know?"',
              why: 'Start messy. Claude handles complexity better than most people.',
            },
            {
              name: 'The Translator',
              template: '"Explain [medical term / discharge note / doctor\'s statement] in plain language. Then tell me what it means for daily caregiving."',
              why: 'Bridge the gap between clinical language and lived reality.',
            },
            {
              name: 'The Prep Coach',
              template: '"I have [X minutes] with [specialist]. My biggest concerns are [A, B, C]. Give me the 5 most important questions to ask."',
              why: 'Never leave a doctor\'s appointment wishing you\'d asked something.',
            },
            {
              name: 'The Reality Check',
              template: '"I\'m feeling [emotion] and thinking [thought]. Is this a normal part of stroke caregiving? Help me understand why."',
              why: 'Normalize what you\'re experiencing. The shame and isolation lift when you realize what you feel is human.',
            },
            {
              name: 'The Draft Partner',
              template: '"Help me write [message/email/letter] to [person]. Goal: [outcome]. I\'m worried about: [concern]."',
              why: 'Get the right words for conversations that matter — with family, doctors, employers, insurance.',
            },
          ];
          return (
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 24px 80px' }}>
              {/* Header */}
              <div style={{ marginBottom: 56 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', color: accent, textTransform: 'uppercase', marginBottom: 14 }}>{tc.tag}</div>
                <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,44px)', fontWeight: 400, margin: '0 0 16px' }}>
                  {tc.h1}<br /><em style={{ color: accent }}>{tc.h2}</em>
                </h1>
                <p style={{ color: '#6A7A8A', lineHeight: 1.85, maxWidth: 620, fontSize: 15, fontWeight: 300 }}>{tc.sub}</p>
              </div>

              {/* The gap callout */}
              <div style={{ background: `${accent}10`, border: `1px solid ${accent}30`, borderRadius: 14, padding: '22px 28px', marginBottom: 56 }}>
                <p style={{ ...serif, fontSize: 16, color: '#C8C0B8', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                  "The gap isn't access to Claude. It's not knowing what's possible to ask."
                </p>
                <p style={{ fontSize: 13, color: '#5A6A7A', margin: '12px 0 0' }}>This page closes that gap.</p>
              </div>

              {/* Use cases */}
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#7A8A9A', textTransform: 'uppercase', marginBottom: 24 }}>{tc.useCasesTag}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginBottom: 72 }}>
                {useCases.map((u, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${u.color}28`, borderRadius: 14, padding: '22px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 22 }}>{u.icon}</span>
                      <div style={{ fontSize: 13, fontWeight: 600, color: u.color }}>{u.title}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '12px 14px', marginBottom: 12, borderLeft: `2px solid ${u.color}60` }}>
                      <div style={{ fontSize: 10, color: '#3A4A5A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>{tc.tryPrompt}</div>
                      <p style={{ fontSize: 12.5, color: '#9AA8B0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{u.prompt}</p>
                    </div>
                    <p style={{ fontSize: 12.5, color: '#5A6A7A', lineHeight: 1.65, margin: 0 }}>{u.why}</p>
                  </div>
                ))}
              </div>

              {/* Prompt patterns */}
              <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#7A8A9A', textTransform: 'uppercase', marginBottom: 14 }}>{tc.patternsTag}</div>
              <p style={{ fontSize: 14, color: '#6A7A8A', lineHeight: 1.8, marginBottom: 32, maxWidth: 620 }}>{tc.patternsIntro}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 64 }}>
                {patterns.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '20px 22px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(200,147,74,0.15)', borderRadius: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${accent}20`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: accent, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#D0C8C0', marginBottom: 6 }}>{p.name}</div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '8px 12px', marginBottom: 8, borderLeft: `2px solid ${accent}50` }}>
                        <p style={{ fontSize: 12.5, color: '#8A9AAA', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{p.template}</p>
                      </div>
                      <p style={{ fontSize: 12.5, color: '#4A5A6A', lineHeight: 1.6, margin: 0 }}>{p.why}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Learning ladder */}
              <div style={{ marginBottom: 64 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#7A8A9A', textTransform: 'uppercase', marginBottom: 10 }}>Your learning path</div>
                <p style={{ fontSize: 14, color: '#6A7A8A', lineHeight: 1.8, marginBottom: 32, maxWidth: 560 }}>
                  No course required. No tech background needed. Just three steps, taken at whatever pace fits your life.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    {
                      step: '1',
                      time: '2 minutes',
                      title: 'Your first conversation',
                      desc: 'Go to claude.ai and paste this into the chat:',
                      prompt: '"My [family member] had a stroke [X weeks/months] ago. The hardest thing right now is [describe one thing]. What should I know?"',
                      note: "That's it. You've started. Claude will ask follow-up questions. Just answer honestly.",
                      link: 'https://claude.ai',
                      linkLabel: 'Open Claude now →',
                      color: '#5BBD8A',
                      connector: true,
                    },
                    {
                      step: '2',
                      time: '10 minutes',
                      title: 'Understand what Claude can actually do',
                      desc: "Anthropic's beginner overview explains Claude's capabilities in plain language — no jargon, no sign-up required to read.",
                      prompt: null,
                      note: 'Focus on the "How to use Claude" section. Skim everything else.',
                      link: 'https://www.anthropic.com/claude',
                      linkLabel: 'Read the overview →',
                      color: '#5B8DD9',
                      connector: true,
                    },
                    {
                      step: '3',
                      time: 'Self-paced · free to audit',
                      title: 'AI for Everyone — when you\'re ready',
                      desc: 'Created by AI educator Andrew Ng, this course is designed for non-technical people who want to genuinely understand how AI works and how to use it confidently.',
                      prompt: null,
                      note: 'No math, no code. Caregivers who\'ve taken it say it made them feel like they finally understood what they were working with.',
                      link: 'https://www.coursera.org/learn/ai-for-everyone',
                      linkLabel: 'View the free course →',
                      color: '#C8934A',
                      connector: false,
                    },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 0 }}>
                      {/* Left: step + connector line */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 20, flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${item.color}20`, border: `2px solid ${item.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: item.color, flexShrink: 0 }}>{item.step}</div>
                        {item.connector && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${item.color}40, transparent)`, minHeight: 24, marginTop: 4 }} />}
                      </div>
                      {/* Right: content */}
                      <div style={{ paddingBottom: item.connector ? 36 : 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, marginTop: 6 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#E0D8D0' }}>{item.title}</div>
                          <div style={{ fontSize: 11, color: item.color, letterSpacing: '0.08em' }}>{item.time}</div>
                        </div>
                        <p style={{ fontSize: 13.5, color: '#6A7A8A', lineHeight: 1.75, margin: '0 0 10px' }}>{item.desc}</p>
                        {item.prompt && (
                          <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '12px 14px', marginBottom: 10, borderLeft: `2px solid ${item.color}60` }}>
                            <p style={{ fontSize: 12.5, color: '#9AA8B0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{item.prompt}</p>
                          </div>
                        )}
                        <p style={{ fontSize: 12.5, color: '#4A5A6A', lineHeight: 1.65, margin: '0 0 12px' }}>{item.note}</p>
                        <a href={item.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: item.color, textDecoration: 'none', fontWeight: 500 }}>{item.linkLabel}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ background: `${accent}0C`, border: `1px solid ${accent}35`, borderRadius: 16, padding: '36px 32px' }}>
                <div style={{ fontSize: 11, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>{tc.ctaTag}</div>
                <p style={{ fontSize: 15, color: '#C0B8B0', lineHeight: 1.8, margin: '0 0 28px', maxWidth: 560 }}>{tc.ctaText}</p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a href="https://claude.ai" target="_blank" rel="noreferrer" style={{
                    display: 'inline-block', background: accent, color: '#100806',
                    padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    fontFamily: 'inherit', textDecoration: 'none', letterSpacing: '0.02em'
                  }}>{tc.openClaude}</a>
                  <a href="https://www.anthropic.com/claude" target="_blank" rel="noreferrer" style={{
                    display: 'inline-block', background: 'transparent', color: accent,
                    border: `1px solid ${accent}50`, padding: '11px 24px', borderRadius: 8,
                    fontSize: 14, fontFamily: 'inherit', textDecoration: 'none'
                  }}>{tc.learnClaude}</a>
                </div>
              </div>
            </div>
          );
        })()}

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

        {/* ── SURVEY ── */}
        {section === 'survey' && <SurveySection t={t.survey} />}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#2A3A4A', margin: 0 }}>{t.footer}</p>
        </div>
      </div>
    </div>
  );
}
