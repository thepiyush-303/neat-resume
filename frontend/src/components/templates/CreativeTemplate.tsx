import React from 'react';
import type { ResumeData } from '../../types/resume';
import { mockPortfolioData } from '../../lib/mockData';

interface Props { data?: ResumeData }

const ACCENT = '#f97316';

export const CreativeTemplate: React.FC<Props> = ({ data: propData }) => {
  const raw = !propData ? (mockPortfolioData as any) : null;

  const name       = propData?.personalInfo?.fullName  ?? raw?.personalInfo?.name     ?? '';
  const bio        = propData?.personalInfo?.summary   ?? raw?.personalInfo?.bio       ?? '';
  const email      = propData?.personalInfo?.email     ?? raw?.personalInfo?.email     ?? '';
  const phone      = propData?.personalInfo?.phone     ?? raw?.personalInfo?.phone     ?? '';
  const location   = propData?.personalInfo?.location  ?? raw?.personalInfo?.location  ?? '';
  const github     = propData?.personalInfo?.github    ?? raw?.personalInfo?.github    ?? '';
  const linkedin   = propData?.personalInfo?.linkedIn  ?? raw?.personalInfo?.linkedin  ?? '';
  const website    = propData?.personalInfo?.website   ?? '';

  const experience    = propData ? propData.workExperience : (raw?.experience ?? []);
  const education     = propData ? propData.education      : (raw?.education  ?? []);
  const projects      = propData ? propData.projects       : (raw?.projects   ?? []);
  const skills        = propData ? propData.skills         : (raw?.skills     ?? []);
  const certifications = propData ? (propData.certifications ?? []) : (raw?.achievements ?? []);
  const languages     = propData ? (propData.languages ?? []) : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', background: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>

      {/* LEFT sidebar */}
      <aside style={{
        width: 280, flexShrink: 0, background: '#111111',
        borderRight: '1px solid rgba(249,115,22,0.15)',
        padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 0,
        overflowY: 'auto',
      }}>
        <div>
          <div style={{ width: 40, height: 3, borderRadius: 4, background: ACCENT, marginBottom: 20 }} />
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 8px', letterSpacing: -0.5 }}>{name || 'Your Name'}</h1>
          {bio && <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.75, marginBottom: 24 }}>{bio}</p>}

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {email    && <a href={`mailto:${email}`} style={sideLink}>✉&nbsp; {email}</a>}
            {phone    && <span style={sideLink}>📞&nbsp; {phone}</span>}
            {location && <span style={sideLink}>📍&nbsp; {location}</span>}
            {github   && <a href={github}   target="_blank" rel="noreferrer" style={sideLink}>⌥&nbsp; GitHub ↗</a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" style={sideLink}>in&nbsp; LinkedIn ↗</a>}
            {website  && <a href={website}  target="_blank" rel="noreferrer" style={sideLink}>🌐&nbsp; Website ↗</a>}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={sideLabel}>Skills</div>
              {skills.map((s: any, i: number) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 7, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                    {s.category || s.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {(s.items ?? s.skills ?? []).map((item: string, j: number) => (
                      <span key={j} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 7, color: '#fff', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={sideLabel}>Languages</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {languages.map((l: string, i: number) => (
                  <span key={i} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 7, color: '#fff', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}>{l}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Education at bottom */}
        {education.length > 0 && (
          <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(249,115,22,0.12)' }}>
            <div style={sideLabel}>Education</div>
            {education.map((e: any, i: number) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{e.institution}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</div>
                {e.gpa && <div style={{ fontSize: 11, color: '#6b7280' }}>GPA {e.gpa}</div>}
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{e.startDate} – {e.endDate || 'Present'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ paddingTop: 24, borderTop: '1px solid rgba(249,115,22,0.12)' }}>
            <div style={sideLabel}>Certifications</div>
            {certifications.map((c: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }}>⚡</span>
                <span style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* RIGHT content */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', background: '#0a0a0a' }}>

        {/* About / Summary */}
        {bio && (
          <section style={{ marginBottom: 48 }}>
            <div style={mainLabel}>Summary</div>
            <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.8, margin: 0 }}>{bio}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div style={mainLabel}>Experience</div>
            {experience.map((e: any, i: number) => (
              <div key={i} style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{e.role}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 3 }}>
                      {e.company}{e.location ? ` — ${e.location}` : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, padding: '5px 14px', borderRadius: 20, background: 'rgba(249,115,22,0.12)', color: ACCENT, border: '1px solid rgba(249,115,22,0.25)', whiteSpace: 'nowrap' as const }}>
                    {e.startDate} → {e.endDate || 'Present'}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
                  {(e.bullets ?? []).map((b: string, j: number) => (
                    <li key={j} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#9ca3af', lineHeight: 1.7, marginBottom: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0, marginTop: 8 }} />
                      {b}
                    </li>
                  ))}
                </ul>
                {i < experience.length - 1 && <div style={{ marginTop: 28, height: 1, background: 'rgba(249,115,22,0.08)' }} />}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div style={mainLabel}>Projects</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
              {projects.map((pr: any, i: number) => (
                <div key={i} style={{ padding: 20, borderRadius: 16, background: '#111111', border: '1px solid rgba(249,115,22,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{pr.name}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(pr.github || pr.links?.github) && <a href={pr.github || pr.links?.github} target="_blank" rel="noreferrer" style={{ color: ACCENT, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>GH ↗</a>}
                      {(pr.url || pr.links?.live) && <a href={pr.url || pr.links?.live} target="_blank" rel="noreferrer" style={{ color: ACCENT, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>Live ↗</a>}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: '0 0 12px' }}>{pr.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {(pr.techStack ?? []).map((t: string, j: number) => (
                      <span key={j} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#1a1a1a', color: '#9ca3af' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const sideLink: React.CSSProperties = { fontSize: 12, color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 };
const sideLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 };
const mainLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 };
