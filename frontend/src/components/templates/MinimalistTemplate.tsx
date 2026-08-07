import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const MinimalistTemplate: React.FC = () => {
  const { portfolioData: d } = usePortfolio();
  if (!d || !d.personalInfo) return null;
  const p = d.personalInfo;
  const experience = (d.experience ?? []).filter(Boolean);
  const education = (d.education ?? []).filter(Boolean);
  const projects = (d.projects ?? []).filter(Boolean);
  const skills = (d.skills ?? []).filter(Boolean);
  const achievements = (d.achievements ?? []).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif", color: '#111' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '60px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0, letterSpacing: -1, color: '#0f0f0f' }}>{p.name}</h1>
          <p style={{ fontSize: 18, color: '#6b6b80', marginTop: 6, marginBottom: 20, fontWeight: 400 }}>{p.role}</p>

          {/* Contact row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', fontSize: 13, color: '#6b6b80', marginBottom: 20 }}>
            {p.email && <a href={`mailto:${p.email}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>✉ {p.email}</a>}
            {p.phone && <span>📞 {p.phone}</span>}
            {p.location && <span>📍 {p.location}</span>}
            {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', textDecoration: 'none' }}>⌥ GitHub</a>}
            {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', textDecoration: 'none' }}>in LinkedIn</a>}
          </div>
          {p.bio && <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', maxWidth: 600 }}>{p.bio}</p>}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: 40 }} />

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#9999b0', marginBottom: 24 }}>Experience</h2>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{e.role}</div>
                    <div style={{ fontSize: 14, color: '#666', marginTop: 2 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                  </div>
                  <span style={{ fontSize: 13, color: '#999', whiteSpace: 'nowrap', marginLeft: 16 }}>{e.startDate} – {e.endDate}</span>
                </div>
                {(e.bullets ?? []).length > 0 && (
                  <ul style={{ margin: '12px 0 0', padding: '0 0 0 18px' }}>
                    {(e.bullets ?? []).map((b, j) => (
                      <li key={j} style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 4 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#9999b0', marginBottom: 24 }}>Education</h2>
            {education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{e.degree}</div>
                  <div style={{ fontSize: 14, color: '#666', marginTop: 2 }}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                  {e.gpa && <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>GPA: {e.gpa}</div>}
                </div>
                <span style={{ fontSize: 13, color: '#999', whiteSpace: 'nowrap', marginLeft: 16 }}>{e.startDate} – {e.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#9999b0', marginBottom: 24 }}>Projects</h2>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{pr.name}</div>
                  {pr.links?.github && <a href={pr.links.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4f46e5', textDecoration: 'none' }}>↗ GitHub</a>}
                  {pr.links?.live && <a href={pr.links.live} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4f46e5', textDecoration: 'none' }}>↗ Live</a>}
                </div>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: '0 0 10px' }}>{pr.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(pr.techStack ?? []).map((t, j) => (
                    <span key={j} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 4, background: '#f0f0f8', color: '#555' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#9999b0', marginBottom: 24 }}>Skills</h2>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 12, fontSize: 14 }}>
                <span style={{ fontWeight: 600, color: '#333' }}>{s.category}: </span>
                <span style={{ color: '#666' }}>{(s.items ?? []).join(' · ')}</span>
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section>
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#9999b0', marginBottom: 24 }}>Achievements</h2>
            <ul style={{ padding: '0 0 0 18px', margin: 0 }}>
              {achievements.map((a, i) => (
                <li key={i} style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 6 }}>{a}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
