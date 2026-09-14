import React from 'react';
import type { ResumeData } from '../../types/resume';
import { mockPortfolioData } from '../../lib/mockData';

interface Props { data?: ResumeData }

export const BentoGridTemplate: React.FC<Props> = ({ data: propData }) => {
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

  const allSkills = skills.flatMap((s: any) => s.items ?? s.skills ?? []);

  const cardStyle = (bg: string, extra?: React.CSSProperties): React.CSSProperties => ({
    borderRadius: 20, padding: 22, overflow: 'hidden', background: bg, ...extra,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#030712', fontFamily: "'Inter', sans-serif", padding: '28px 20px' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14 }}>

        {/* Hero Card — spans 8 cols */}
        <div style={{ ...cardStyle('linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#0ea5e9 100%)'), gridColumn: 'span 8', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', fontSize: 11, color: 'rgba(255,255,255,0.9)', marginBottom: 14, fontWeight: 500 }}>
              ⚡ Available for opportunities
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1, letterSpacing: -1 }}>{name || 'Your Name'}</h1>
            {bio && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: 520, margin: '12px 0 16px' }}>{bio}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {email    && <a href={`mailto:${email}`} style={heroPill}>✉ {email}</a>}
              {phone    && <span style={heroPill}>📞 {phone}</span>}
              {github   && <a href={github}   target="_blank" rel="noreferrer" style={heroPill}>GitHub ↗</a>}
              {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" style={heroPill}>LinkedIn ↗</a>}
              {website  && <a href={website}  target="_blank" rel="noreferrer" style={heroPill}>Website ↗</a>}
            </div>
          </div>
        </div>

        {/* Info / Education card — 4 cols */}
        <div style={{ ...cardStyle('#0f172a'), gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {location && <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#94a3b8', fontSize: 13 }}>📍 {location}</div>}
          {education.map((e: any, i: number) => (
            <div key={i} style={{ padding: 14, borderRadius: 14, background: '#1e293b' }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Education</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{e.institution}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</div>
              {e.gpa && <div style={{ fontSize: 11, color: '#818cf8' }}>GPA {e.gpa}</div>}
              <div style={{ fontSize: 11, color: '#818cf8', marginTop: 4 }}>{e.startDate} – {e.endDate || 'Present'}</div>
            </div>
          ))}
          {/* Languages chip */}
          {languages.length > 0 && (
            <div style={{ padding: '10px 14px', borderRadius: 14, background: '#1e293b' }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 7, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Languages</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {languages.map((l: string, i: number) => (
                  <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#111827', color: '#94a3b8' }}>{l}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills card — 5 cols */}
        {allSkills.length > 0 && (
          <div style={{ ...cardStyle('#0f172a'), gridColumn: 'span 5' }}>
            <div style={sectionLabel('#818cf8')}>Tech Stack</div>
            {/* Per-category groups */}
            {skills.map((s: any, gi: number) => (
              <div key={gi} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 7, textTransform: 'uppercase' as const, letterSpacing: 0.8, fontWeight: 600 }}>{s.category || s.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(s.items ?? s.skills ?? []).map((item: string, j: number) => (
                    <span key={j} style={{
                      fontSize: 12, padding: '4px 11px', borderRadius: 8, fontWeight: 500,
                      background: `hsl(${((gi * 60 + j * 20)) % 360},50%,10%)`,
                      color: `hsl(${((gi * 60 + j * 20)) % 360},70%,65%)`,
                      border: `1px solid hsl(${((gi * 60 + j * 20)) % 360},50%,20%)`,
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience card — 7 cols */}
        {experience.length > 0 && (
          <div style={{ ...cardStyle('#080c14'), gridColumn: 'span 7' }}>
            <div style={sectionLabel('#a78bfa')}>Experience</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {experience.slice(0, 4).map((e: any, i: number) => (
                <div key={i} style={{ padding: 14, borderRadius: 14, background: '#111827' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{e.role}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', whiteSpace: 'nowrap' as const }}>
                      {e.startDate} – {e.endDate || 'Present'}
                    </span>
                  </div>
                  {(e.bullets ?? []).slice(0, 2).map((b: string, j: number) => (
                    <p key={j} style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0', lineHeight: 1.6 }}>• {b}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects — each 4 cols */}
        {projects.slice(0, 3).map((pr: any, i: number) => (
          <div key={i} style={{ ...cardStyle(i === 0 ? '#0d1117' : i === 1 ? '#0a0f1e' : '#0f0d17'), gridColumn: 'span 4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{pr.name}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(pr.github || pr.links?.github) && <a href={pr.github || pr.links?.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>GH ↗</a>}
                {(pr.url || pr.links?.live) && <a href={pr.url || pr.links?.live} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Live ↗</a>}
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: '0 0 12px' }}>{pr.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {(pr.techStack ?? []).slice(0, 5).map((t: string, j: number) => (
                <span key={j} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: '#1f2937', color: '#9ca3af' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}

        {/* Certifications row */}
        {certifications.length > 0 && (
          <div style={{ ...cardStyle('linear-gradient(135deg,#0f172a,#1e1b4b)'), gridColumn: 'span 12' }}>
            <div style={sectionLabel('#fbbf24')}>🏆 Certifications & Achievements</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
              {certifications.map((c: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', alignItems: 'flex-start' }}>
                  <span style={{ color: '#fbbf24', flexShrink: 0 }}>★</span>
                  <span style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const heroPill: React.CSSProperties = { fontSize: 12, padding: '5px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none' };
const sectionLabel = (color: string): React.CSSProperties => ({ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 });
