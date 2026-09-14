import React from 'react';
import type { ResumeData } from '../../types/resume';
import { mockPortfolioData } from '../../lib/mockData';

// Allow the template to be used standalone (with mock data) OR receive real data from Editor
interface Props { data?: ResumeData }

export const MinimalistTemplate: React.FC<Props> = ({ data: propData }) => {
  // If real resume data is passed use it; otherwise fall back to mock
  const useMock = !propData;
  const raw = useMock ? (mockPortfolioData as any) : null;

  const name       = propData?.personalInfo?.fullName  ?? raw?.personalInfo?.name     ?? '';
  const role       = propData?.personalInfo?.summary?.split('.')[0] ?? raw?.personalInfo?.role ?? '';
  const bio        = propData?.personalInfo?.summary   ?? raw?.personalInfo?.bio       ?? '';
  const email      = propData?.personalInfo?.email     ?? raw?.personalInfo?.email     ?? '';
  const phone      = propData?.personalInfo?.phone     ?? raw?.personalInfo?.phone     ?? '';
  const location   = propData?.personalInfo?.location  ?? raw?.personalInfo?.location  ?? '';
  const github     = propData?.personalInfo?.github    ?? raw?.personalInfo?.github    ?? '';
  const linkedin   = propData?.personalInfo?.linkedIn  ?? raw?.personalInfo?.linkedin  ?? '';
  const website    = propData?.personalInfo?.website   ?? '';

  const experience    = propData ? propData.workExperience  : (raw?.experience   ?? []);
  const education     = propData ? propData.education        : (raw?.education    ?? []);
  const projects      = propData ? propData.projects         : (raw?.projects     ?? []);
  const skills        = propData ? propData.skills           : (raw?.skills       ?? []);
  const certifications = propData ? (propData.certifications ?? []) : (raw?.achievements ?? []);
  const languages     = propData ? (propData.languages ?? []) : [];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>

      {/* Top nav */}
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: '#111', letterSpacing: -0.5 }}>{name || 'Your Name'}</div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, fontWeight: 500, color: '#4b5563' }}>
          {email    && <a href={`mailto:${email}`}    style={{ color: '#4b5563', textDecoration: 'none' }}>Email</a>}
          {github   && <a href={github}   target="_blank" rel="noreferrer" style={{ color: '#4b5563', textDecoration: 'none' }}>GitHub</a>}
          {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" style={{ color: '#4b5563', textDecoration: 'none' }}>LinkedIn</a>}
          {website  && <a href={website}  target="_blank" rel="noreferrer" style={{ color: '#4b5563', textDecoration: 'none' }}>Website</a>}
        </div>
      </nav>

      {/* Hero */}
      <header style={{ background: '#f8f9fa', padding: '72px 48px 80px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, color: '#111', lineHeight: 1.05, letterSpacing: '-0.04em', textTransform: 'uppercase', margin: '0 0 20px', maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
          {name || 'Your Name'}
        </h1>
        {role && <p style={{ fontSize: 18, color: '#374151', margin: '0 0 16px', fontWeight: 500 }}>{role}</p>}
        {bio  && <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 680, margin: '0 auto 24px', lineHeight: 1.75 }}>{bio}</p>}

        {/* Contact pills */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
          {email    && <a href={`mailto:${email}`} style={pill}>✉ {email}</a>}
          {phone    && <span style={pill}>📞 {phone}</span>}
          {location && <span style={pill}>📍 {location}</span>}
          {github   && <a href={github}   target="_blank" rel="noreferrer" style={pill}>⌥ GitHub ↗</a>}
          {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" style={pill}>in LinkedIn ↗</a>}
          {website  && <a href={website}  target="_blank" rel="noreferrer" style={pill}>🌐 Website ↗</a>}
        </div>
      </header>

      <main style={{ padding: '72px 48px', maxWidth: 960, margin: '0 auto' }}>

        {/* Summary */}
        {bio && (
          <section style={section}>
            <h2 style={h2}>About</h2>
            <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.85, margin: 0 }}>{bio}</p>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={section}>
            <h2 style={h2}>Skills</h2>
            {skills.map((s: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111', width: 160, flexShrink: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {s.category || s.name}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(s.items ?? s.skills ?? []).map((item: string, j: number) => (
                    <span key={j} style={{ fontSize: 14, color: '#4b5563' }}>{item}{j < (s.items ?? s.skills ?? []).length - 1 ? ' ·' : ''}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={section}>
            <h2 style={h2}>Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
              {experience.map((e: any, i: number) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0 }}>{e.role}</h3>
                    <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>{e.startDate} – {e.endDate || 'Present'}</span>
                  </div>
                  <div style={{ fontSize: 15, color: '#4f46e5', fontWeight: 600, marginBottom: 14 }}>
                    {e.company}{e.location ? <span style={{ color: '#9ca3af', fontWeight: 400 }}> · {e.location}</span> : ''}
                  </div>
                  {(e.bullets ?? []).length > 0 && (
                    <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(e.bullets ?? []).map((b: string, j: number) => (
                        <li key={j} style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.75 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={section}>
            <h2 style={h2}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {education.map((e: any, i: number) => (
                <div key={i}>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>{e.institution}</h3>
                  <div style={{ fontSize: 15, color: '#374151', fontWeight: 500, marginBottom: 4 }}>
                    {e.degree}{e.field ? ` in ${e.field}` : ''}{e.gpa ? ` · GPA ${e.gpa}` : ''}
                  </div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>{e.startDate} – {e.endDate || 'Present'}{e.location ? ` · ${e.location}` : ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={section}>
            <h2 style={h2}>Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {projects.map((pr: any, i: number) => (
                <div key={i} style={{ padding: 28, background: '#f8f9fa', borderRadius: 20, border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>{pr.name}</h3>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {(pr.github || pr.links?.github) && <a href={pr.github || pr.links.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>GitHub ↗</a>}
                      {(pr.url || pr.links?.live) && <a href={pr.url || pr.links.live} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Live ↗</a>}
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: '0 0 16px' }}>{pr.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(pr.techStack ?? []).map((t: string, j: number) => (
                      <span key={j} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: '1px solid #e5e7eb', color: '#374151', fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications / Languages row */}
        {(certifications.length > 0 || languages.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {certifications.length > 0 && (
              <section style={{ ...section, marginBottom: 0 }}>
                <h2 style={h2}>Certifications</h2>
                <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {certifications.map((c: string, i: number) => (
                    <li key={i} style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7 }}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
            {languages.length > 0 && (
              <section style={{ ...section, marginBottom: 0 }}>
                <h2 style={h2}>Languages</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {languages.map((l: string, i: number) => (
                    <span key={i} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 20, border: '1px solid #e5e7eb', color: '#374151', fontWeight: 500 }}>{l}</span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

      </main>

      <footer style={{ padding: '32px 48px', textAlign: 'center', color: '#9ca3af', fontSize: 13, background: '#f8f9fa', borderTop: '1px solid #e5e7eb' }}>
        © {new Date().getFullYear()} {name}. Built with NeatResume.
      </footer>
    </div>
  );
};

const section: React.CSSProperties = { marginBottom: 64 };
const h2: React.CSSProperties = { fontSize: 26, fontWeight: 900, color: '#111', marginBottom: 28, paddingBottom: 12, borderBottom: '2px solid #111', letterSpacing: -0.5 };
const pill: React.CSSProperties = { fontSize: 13, padding: '7px 16px', borderRadius: 20, background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontWeight: 500, display: 'inline-block' };
