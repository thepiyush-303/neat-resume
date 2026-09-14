import React from 'react';
import type { ResumeData } from '../../types/resume';
import { mockPortfolioData } from '../../lib/mockData';

interface Props { data?: ResumeData }

const PRIMARY = '#4f46e5';

export const CorporateTemplate: React.FC<Props> = ({ data: propData }) => {
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

  // Derive role from summary first line or first experience
  const role = experience[0]?.role ?? '';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter', sans-serif", padding: '32px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

        {/* LEFT CARD */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textAlign: 'center', border: '1px solid #f3f4f6', position: 'sticky', top: 20 }}>
          {/* Avatar */}
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: `linear-gradient(135deg, #a855f7, ${PRIMARY})`, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 44, fontWeight: 800 }}>
            {(name || 'U').charAt(0)}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>{name || 'Your Name'}</h1>
          {role && <p style={{ fontSize: 13, color: PRIMARY, fontWeight: 500, margin: '0 0 4px' }}>{role}</p>}
          {location && <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>📍 {location}</div>}

          {/* Link icons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {email    && <a href={`mailto:${email}`} style={iconPill} title="Email">✉ Email</a>}
            {phone    && <span style={iconPill}>📞 {phone}</span>}
            {github   && <a href={github}   target="_blank" rel="noreferrer" style={iconPill}>GitHub ↗</a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" style={iconPill}>LinkedIn ↗</a>}
            {website  && <a href={website}  target="_blank" rel="noreferrer" style={iconPill}>Website ↗</a>}
          </div>

          {/* About */}
          {bio && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, textAlign: 'left', marginBottom: 20 }}>
              <div style={cardSectionLabel}>About</div>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.75, margin: 0 }}>{bio}</p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, textAlign: 'left', marginBottom: 20 }}>
              <div style={cardSectionLabel}>Skills</div>
              {skills.map((s: any, i: number) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 7 }}>{s.category || s.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(s.items ?? s.skills ?? []).map((item: string, j: number) => (
                      <span key={j} style={{ fontSize: 11, color: '#374151', padding: '3px 9px', background: '#f3f4f6', borderRadius: 7, fontWeight: 500 }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, textAlign: 'left', marginBottom: 20 }}>
              <div style={cardSectionLabel}>Languages</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {languages.map((l: string, i: number) => (
                  <span key={i} style={{ fontSize: 11, color: '#374151', padding: '3px 9px', background: '#f3f4f6', borderRadius: 7, fontWeight: 500 }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          {/* Available badge */}
          <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#166534' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Available for new opportunities
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Experience */}
          {experience.length > 0 && (
            <section style={card}>
              <h2 style={cardTitle}>💼 Experience</h2>
              {experience.map((e: any, i: number) => (
                <div key={i} style={{ borderBottom: i < experience.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: i < experience.length - 1 ? 24 : 0, marginBottom: i < experience.length - 1 ? 24 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 5px' }}>{e.role}</h3>
                      <div style={{ fontSize: 13, color: PRIMARY, fontWeight: 500 }}>{e.company}{e.location ? <span style={{ color: '#9ca3af', fontWeight: 400 }}> · {e.location}</span> : ''}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', background: '#f3f4f6', padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' as const }}>
                      {e.startDate} – {e.endDate || 'Present'}
                    </div>
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {(e.bullets ?? []).map((b: string, j: number) => (
                      <li key={j} style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section style={card}>
              <h2 style={cardTitle}>🎓 Education</h2>
              {education.map((e: any, i: number) => (
                <div key={i} style={{ borderBottom: i < education.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: i < education.length - 1 ? 20 : 0, marginBottom: i < education.length - 1 ? 20 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 5px' }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3>
                      <div style={{ fontSize: 13, color: PRIMARY, fontWeight: 500 }}>{e.institution}{e.location ? <span style={{ color: '#9ca3af', fontWeight: 400 }}> · {e.location}</span> : ''}</div>
                      {e.gpa && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>GPA: {e.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', background: '#f3f4f6', padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' as const }}>
                      {e.startDate} – {e.endDate || 'Present'}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section style={card}>
              <h2 style={cardTitle}>🚀 Projects</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {projects.map((pr: any, i: number) => (
                  <div key={i} style={{ padding: '20px', border: '1px solid #f3f4f6', borderRadius: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111', margin: 0 }}>{pr.name}</h3>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {(pr.github || pr.links?.github) && <a href={pr.github || pr.links?.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: PRIMARY, textDecoration: 'none', fontWeight: 600 }}>GitHub ↗</a>}
                        {(pr.url || pr.links?.live) && <a href={pr.url || pr.links?.live} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: PRIMARY, textDecoration: 'none', fontWeight: 600 }}>Live ↗</a>}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, margin: '0 0 12px' }}>{pr.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(pr.techStack ?? []).map((t: string, j: number) => (
                        <span key={j} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#e0e7ff', color: PRIMARY, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section style={card}>
              <h2 style={cardTitle}>🏆 Certifications</h2>
              <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {certifications.map((c: string, i: number) => (
                  <li key={i} style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const card: React.CSSProperties = { background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' };
const cardTitle: React.CSSProperties = { fontSize: 17, fontWeight: 800, color: '#111', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 };
const cardSectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 };
const iconPill: React.CSSProperties = { fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontWeight: 500 };
