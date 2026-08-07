import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const BentoGridTemplate: React.FC = () => {
  const { portfolioData: d } = usePortfolio();
  if (!d || !d.personalInfo) return null;
  const p = d.personalInfo;
  const experience = (d.experience ?? []).filter(Boolean);
  const education = (d.education ?? []).filter(Boolean);
  const projects = (d.projects ?? []).filter(Boolean);
  const skills = (d.skills ?? []).filter(Boolean);
  const achievements = (d.achievements ?? []).filter(Boolean);
  const allSkills = skills.flatMap(s => s.items ?? []);

  const card = (bg: string, extra?: React.CSSProperties): React.CSSProperties => ({
    borderRadius: 20, padding: 24, overflow: 'hidden', background: bg, ...extra,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#030712', fontFamily: "'Inter', sans-serif", padding: '32px 24px' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>

        {/* Hero */}
        <div style={{ ...card('linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#0ea5e9 100%)'), gridColumn: 'span 8', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', fontSize: 11, color: 'rgba(255,255,255,0.9)', marginBottom: 16, fontWeight: 500 }}>
              ⚡ Available for opportunities
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1, letterSpacing: -1 }}>{p.name}</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', margin: '8px 0 16px', fontWeight: 500 }}>{p.role}</p>
            {p.bio && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 480, margin: 0 }}>{p.bio}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {p.email && <a href={`mailto:${p.email}`} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none' }}>✉ {p.email}</a>}
              {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: '6px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none' }}>GitHub ↗</a>}
              {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: '6px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none' }}>LinkedIn ↗</a>}
            </div>
          </div>
        </div>

        {/* Info card */}
        <div style={{ ...card('#0f172a'), gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          {p.location && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14 }}>📍 {p.location}</div>}
          {education[0] && (
            <div style={{ padding: 16, borderRadius: 14, background: '#1e293b' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Education</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{education[0].institution}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{education[0].degree}</div>
              <div style={{ fontSize: 12, color: '#818cf8', marginTop: 4 }}>{education[0].startDate} – {education[0].endDate}</div>
            </div>
          )}
          {p.phone && <div style={{ color: '#94a3b8', fontSize: 13 }}>📞 {p.phone}</div>}
        </div>

        {/* Skills */}
        {allSkills.length > 0 && (
          <div style={{ ...card('#0f172a'), gridColumn: 'span 5' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Tech Stack</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allSkills.slice(0, 22).map((s, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '5px 12px', borderRadius: 8, fontWeight: 500,
                  background: `hsl(${(i * 31) % 360},60%,12%)`,
                  color: `hsl(${(i * 31) % 360},70%,70%)`,
                  border: `1px solid hsl(${(i * 31) % 360},60%,22%)`,
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ ...card('#080c14'), gridColumn: 'span 7' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Experience</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {experience.slice(0, 3).map((e, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 14, background: '#111827' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{e.role}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{e.company}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {e.startDate} – {e.endDate}
                    </span>
                  </div>
                  {(e.bullets ?? [])[0] && <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{(e.bullets ?? [])[0]}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.slice(0, 3).map((pr, i) => (
          <div key={i} style={{ ...card(i === 0 ? '#0d1117' : i === 1 ? '#0a0f1e' : '#0f0d17'), gridColumn: 'span 4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{pr.name}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {pr.links?.github && <a href={pr.links.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}>↗</a>}
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: '0 0 12px' }}>{pr.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(pr.techStack ?? []).slice(0, 4).map((t, j) => (
                <span key={j} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: '#1f2937', color: '#9ca3af' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div style={{ ...card('linear-gradient(135deg,#0f172a,#1e1b4b)'), gridColumn: 'span 12' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>🏆 Achievements</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', alignItems: 'flex-start' }}>
                  <span style={{ color: '#fbbf24', flexShrink: 0 }}>★</span>
                  <span style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.5 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
