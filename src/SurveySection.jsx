import { useState } from 'react';

// 1. Go to formspree.io → sign up free → New Form → copy the endpoint URL
// 2. Replace the string below with your endpoint, e.g. 'https://formspree.io/f/xpzvjkab'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeererlp';

const serif = { fontFamily: "'Lora', Georgia, serif" };

const SECTIONS = [
  'Brain Atlas', 'Voices of Hope', 'Caregiver Wellbeing',
  'Smart Home Tech', 'Build with Purpose', 'Local Resources',
];

const ROLES = [
  { value: 'caregiver', label: 'Family caregiver' },
  { value: 'survivor', label: 'Stroke survivor' },
  { value: 'professional', label: 'Healthcare professional' },
  { value: 'other', label: 'Other' },
];

export default function SurveySection({ t }) {
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sections, setSections] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const toggleSection = (s) =>
    setSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, rating, sections: sections.join(', '), feedback, email }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '10px 14px', color: '#E0D8D0', fontSize: 14,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 24px 80px' }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#C4302B', textTransform: 'uppercase', marginBottom: 14 }}>
          {t.tag}
        </div>
        <h1 style={{ ...serif, fontSize: 'clamp(22px,4vw,40px)', fontWeight: 400, margin: '0 0 14px' }}>
          {t.h1} <em style={{ color: '#C4302B' }}>{t.h2}</em>
        </h1>
        <p style={{ color: '#6A7A8A', lineHeight: 1.8, fontSize: 15, fontWeight: 300 }}>{t.sub}</p>
      </div>

      {status === 'done' ? (
        <div style={{ textAlign: 'center', padding: '52px 32px', background: 'rgba(91,189,138,0.07)', border: '1px solid rgba(91,189,138,0.25)', borderRadius: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>💙</div>
          <h2 style={{ ...serif, fontSize: 22, fontWeight: 400, color: '#5BBD8A', margin: '0 0 12px' }}>{t.thanksTitle}</h2>
          <p style={{ color: '#7A9A8A', lineHeight: 1.7, margin: 0 }}>{t.thanksSub}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Q1: Role */}
          <div>
            <div style={{ fontSize: 15, color: '#D0C8C0', fontWeight: 500, marginBottom: 14 }}>{t.q1}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ROLES.map(r => (
                <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px 14px', borderRadius: 8, background: role === r.value ? 'rgba(196,48,43,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${role === r.value ? 'rgba(196,48,43,0.4)' : 'rgba(255,255,255,0.07)'}`, transition: 'all 0.15s' }}>
                  <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} style={{ accentColor: '#C4302B' }} />
                  <span style={{ fontSize: 14, color: role === r.value ? '#E8D8D0' : '#7A8A9A' }}>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q2: Rating */}
          <div>
            <div style={{ fontSize: 15, color: '#D0C8C0', fontWeight: 500, marginBottom: 14 }}>{t.q2}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', lineHeight: 1, filter: n <= (hoverRating || rating) ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'filter 0.1s' }}>
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span style={{ fontSize: 13, color: '#5A6A7A', alignSelf: 'center', marginLeft: 6 }}>
                  {['', t.r1, t.r2, t.r3, t.r4, t.r5][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Q3: Most useful sections */}
          <div>
            <div style={{ fontSize: 15, color: '#D0C8C0', fontWeight: 500, marginBottom: 14 }}>{t.q3}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 8 }}>
              {SECTIONS.map(s => {
                const on = sections.includes(s);
                return (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '9px 12px', borderRadius: 8, background: on ? 'rgba(91,141,217,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${on ? 'rgba(91,141,217,0.4)' : 'rgba(255,255,255,0.07)'}`, transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={on} onChange={() => toggleSection(s)} style={{ accentColor: '#5B8DD9' }} />
                    <span style={{ fontSize: 13, color: on ? '#C8D8F0' : '#5A6A7A' }}>{s}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Q4: Open feedback */}
          <div>
            <div style={{ fontSize: 15, color: '#D0C8C0', fontWeight: 500, marginBottom: 10 }}>{t.q4}</div>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              placeholder={t.q4ph}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Q5: Optional email */}
          <div>
            <div style={{ fontSize: 15, color: '#D0C8C0', fontWeight: 500, marginBottom: 4 }}>{t.q5}</div>
            <div style={{ fontSize: 12, color: '#3A4A5A', marginBottom: 10 }}>{t.q5note}</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.q5ph}
              style={inputStyle}
            />
          </div>

          {status === 'error' && (
            <div style={{ fontSize: 13, color: '#E87050', padding: '10px 14px', background: 'rgba(232,112,80,0.08)', borderRadius: 8, border: '1px solid rgba(232,112,80,0.25)' }}>
              {t.errMsg}
            </div>
          )}

          <button type="submit" disabled={status === 'sending' || !role || !rating}
            style={{ padding: '13px 28px', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', fontWeight: 500, cursor: (!role || !rating || status === 'sending') ? 'not-allowed' : 'pointer', background: (!role || !rating) ? 'rgba(196,48,43,0.15)' : 'rgba(196,48,43,0.22)', border: '1px solid rgba(196,48,43,0.45)', color: (!role || !rating) ? '#5A3A38' : '#F0D0C8', transition: 'all 0.15s', alignSelf: 'flex-start' }}>
            {status === 'sending' ? t.sending : t.submit}
          </button>

          <div style={{ fontSize: 11, color: '#2A3A4A', lineHeight: 1.6 }}>{t.privacy}</div>
        </form>
      )}
    </div>
  );
}
