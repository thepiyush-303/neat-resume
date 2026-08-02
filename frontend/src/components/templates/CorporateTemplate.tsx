import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const CorporateTemplate: React.FC = () => {
  const { portfolioData: d } = usePortfolio();
  if (!d || !d.personalInfo) return null;
  const p = d.personalInfo;
  const experience = d.experience ?? [];
  const education = d.education ?? [];
  const projects = d.projects ?? [];
  const skills = d.skills ?? [];
  const achievements = d.achievements ?? [];

  const Tag: React.FC<{ text: string }> = ({ text }) => (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 4, background: '#eff6ff', color: '#2563eb', margin: '2px' }}>{text}</span>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Header band */}
      <div style={{ padding: '36px 48px', background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: '#fff', margin: 0 }}>{p.name}</h1>
        <p style={{ color: '#bfdbfe', fontSize: 17, margin: '6px 0 16px', fontWeight: 500 }}>{p.role}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
          {p.email && <a href={`mailto:${p.email}`} style={{ color: '#bfdbfe', fontSize: 13, textDecoration: 'none' }}>✉ {p.email}</a>}
          {p.phone && <span style={{ color: '#bfdbfe', fontSize: 13 }}>📞 {p.phone}</span>}
          {p.location && <span style={{ color: '#bfdbfe', fontSize: 13 }}>📍 {p.location}</span>}
          {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ color: '#bfdbfe', fontSize: 13, textDecoration: 'none' }}>⌥ GitHub</a>}
          {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" style={{ color: '#bfdbfe', fontSize: 13, textDecoration: 'none' }}>in LinkedIn</a>}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>

        {/* Left */}
        <div style={{ padding: '32px 24px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {p.bio && (
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid #2563eb', paddingBottom: 6, marginBottom: 12 }}>Profile</h2>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{p.bio}</p>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid #2563eb', paddingBottom: 6, marginBottom: 12 }}>Skills</h2>
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{s.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(s.items ?? []).map((item, j) => <Tag key={j} text={item} />)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid #2563eb', paddingBottom: 6, marginBottom: 12 }}>Education</h2>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>{e.institution}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{e.degree}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{e.startDate} – {e.endDate}</div>
                  {e.gpa && <div style={{ fontSize: 12, color: '#2563eb', marginTop: 2 }}>GPA: {e.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid #2563eb', paddingBottom: 6, marginBottom: 12 }}>Achievements</h2>
              <ul style={{ padding: '0 0 0 18px', margin: 0 }}>
                {achievements.map((a, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.7, marginBottom: 6 }}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 40 }}>

          {experience.length > 0 && (
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid #2563eb', paddingBottom: 6, marginBottom: 20 }}>Work Experience</h2>
              {experience.map((e, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid #e2e8f0', marginBottom: 28 }}>
                  <div style={{ position: 'absolute', left: -5, top: 6, width: 10, height: 10, borderRadius: '50%', border: '2px solid #2563eb', background: '#fff' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>{e.role}</div>
                      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: '#eff6ff', color: '#2563eb', whiteSpace: 'nowrap' }}>
                      {e.startDate} – {e.endDate}
                    </span>
                  </div>
                  <ul style={{ padding: '0 0 0 18px', margin: 0 }}>
                    {(e.bullets ?? []).map((b, j) => (
                      <li key={j} style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, marginBottom: 4 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid #2563eb', paddingBottom: 6, marginBottom: 20 }}>Projects</h2>
              {projects.map((pr, i) => (
                <div key={i} style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>{pr.name}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {pr.links?.github && <a href={pr.links.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>GitHub ↗</a>}
                      {pr.links?.live && <a href={pr.links.live} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>Live ↗</a>}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#4b5563', margin: '0 0 10px', lineHeight: 1.6 }}>{pr.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(pr.techStack ?? []).map((t, j) => <Tag key={j} text={t} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
