import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const ACCENT = '#f97316';

export const CreativeTemplate: React.FC = () => {
  const { portfolioData: d } = usePortfolio();
  if (!d || !d.personalInfo) return null;
  const p = d.personalInfo;
  const experience = d.experience ?? [];
  const education = d.education ?? [];
  const projects = d.projects ?? [];
  const skills = d.skills ?? [];
  const achievements = d.achievements ?? [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', background: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>

      {/* LEFT sidebar */}
      <aside style={{
        width: 300, flexShrink: 0, background: '#111111',
        borderRight: '1px solid rgba(249,115,22,0.15)',
        padding: '40px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ width: 40, height: 3, borderRadius: 4, background: ACCENT, marginBottom: 24 }} />
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: 0, letterSpacing: -0.5 }}>{p.name}</h1>
          <p style={{ fontSize: 14, fontWeight: 600, color: ACCENT, margin: '10px 0 20px' }}>{p.role}</p>
          {p.bio && <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>{p.bio}</p>}

          {/* Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {p.email && <a href={`mailto:${p.email}`} style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: ACCENT, fontSize: 14 }}>✉</span> {p.email}
            </a>}
            {p.phone && <span style={{ fontSize: 13, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: ACCENT }}>📞</span> {p.phone}
            </span>}
            {p.location && <span style={{ fontSize: 13, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: ACCENT }}>📍</span> {p.location}
            </span>}
            {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: ACCENT }}>⌥</span> GitHub
            </a>}
            {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: ACCENT }}>in</span> LinkedIn
            </a>}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Skills</div>
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{s.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(s.items ?? []).map((item, j) => (
                      <span key={j} style={{
                        fontSize: 11, padding: '4px 10px', borderRadius: 8, color: '#fff',
                        background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)',
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education at bottom */}
        {education.length > 0 && (
          <div style={{ marginTop: 28, paddingTop: 28, borderTop: '1px solid rgba(249,115,22,0.12)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Education</div>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{e.institution}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{e.degree}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* RIGHT content */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>

        {experience.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28 }}>Experience</div>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{e.role}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 3 }}>{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                  </div>
                  <span style={{ fontSize: 12, padding: '5px 14px', borderRadius: 20, background: 'rgba(249,115,22,0.12)', color: ACCENT, border: '1px solid rgba(249,115,22,0.25)', whiteSpace: 'nowrap' }}>
                    {e.startDate} → {e.endDate}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
                  {(e.bullets ?? []).map((b, j) => (
                    <li key={j} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#9ca3af', lineHeight: 1.7, marginBottom: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0, marginTop: 8 }} />
                      {b}
                    </li>
                  ))}
                </ul>
                {i < experience.length - 1 && <div style={{ marginTop: 32, height: 1, background: 'rgba(249,115,22,0.08)' }} />}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28 }}>Projects</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {projects.map((pr, i) => (
                <div key={i} style={{
                  padding: 20, borderRadius: 16, background: '#111111',
                  border: '1px solid rgba(249,115,22,0.1)',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{pr.name}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {pr.links?.github && <a href={pr.links.github} target="_blank" rel="noreferrer" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 12 }}>↗</a>}
                      {pr.links?.live && <a href={pr.links.live} target="_blank" rel="noreferrer" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 12 }}>🌐</a>}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: '0 0 14px' }}>{pr.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(pr.techStack ?? []).map((t, j) => (
                      <span key={j} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#1a1a1a', color: '#9ca3af' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {achievements.length > 0 && (
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28 }}>Achievements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 14, background: '#111111', border: '1px solid rgba(249,115,22,0.08)' }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }}>⚡</span>
                  <span style={{ fontSize: 14, color: '#d1d5db' }}>{a}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
