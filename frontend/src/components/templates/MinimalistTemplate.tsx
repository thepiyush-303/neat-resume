import React from 'react';
import { mockPortfolioData } from '../../lib/mockData';

export const MinimalistTemplate: React.FC = () => {
  const d = mockPortfolioData;
  if (!d || !d.personalInfo) return null;
  const p = d.personalInfo;
  const experience = (d.experience ?? []).filter(Boolean);
  const education = (d.education ?? []).filter(Boolean);
  const projects = (d.projects ?? []).filter(Boolean);
  const skills = (d.skills ?? []).filter(Boolean);
  const achievements = (d.achievements ?? []).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Navbar */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: '#111' }}>
          artfolio<span style={{ color: '#4f46e5' }}>↗</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, fontWeight: 500, color: '#4b5563' }}>
          <span>About</span>
          <span>Skills</span>
          <span>Education</span>
          <span>Experience</span>
          <span>Projects</span>
        </div>
        <div>
          <button style={{ width: 44, height: 24, borderRadius: 12, background: '#1f2937', position: 'relative', border: 'none', cursor: 'pointer' }}>
            <span style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
          </button>
        </div>
      </nav>

      {/* Hero Section (Light Gray) */}
      <header style={{ background: '#f8f9fa', padding: '80px 48px 100px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(4rem, 10vw, 8rem)', 
          fontWeight: 900, 
          color: '#111', 
          lineHeight: 1.1, 
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: '0 auto 24px',
          maxWidth: 1200,
          wordBreak: 'break-word'
        }}>
          {p.name}
        </h1>
        <p style={{ fontSize: 20, color: '#374151', margin: '0 0 16px', fontWeight: 500 }}>
          {p.role}{education[0]?.institution ? ` at ${education[0].institution}` : ''}
        </p>
        <p style={{ fontSize: 16, color: '#4b5563', maxWidth: 800, margin: '0 auto 32px', lineHeight: 1.6 }}>
          {p.bio}
        </p>
        <a href="#" style={{ fontSize: 15, color: '#111', textDecoration: 'underline', fontWeight: 500, textUnderlineOffset: 4 }}>
          Resume
        </a>
      </header>

      {/* Main Content (White) */}
      <main style={{ padding: '80px 48px', maxWidth: 1000, margin: '0 auto' }}>
        
        {/* About */}
        {p.bio && (
          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 24 }}>About</h2>
            <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>{p.bio}</p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 32 }}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {education.map((e, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 12px' }}>{e.institution}</h3>
                  <div style={{ fontSize: 18, color: '#374151', fontWeight: 500, marginBottom: 8 }}>{e.degree}</div>
                  <div style={{ fontSize: 15, color: '#6b7280' }}>{e.startDate} – {e.endDate} {e.location ? `· ${e.location}` : ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 32 }}>Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {experience.map((e, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0 }}>{e.role}</h3>
                    <span style={{ fontSize: 15, color: '#6b7280', fontWeight: 500 }}>{e.startDate} – {e.endDate}</span>
                  </div>
                  <div style={{ fontSize: 18, color: '#4f46e5', fontWeight: 600, marginBottom: 16 }}>
                    {e.company} {e.location ? <span style={{ color: '#9ca3af', fontWeight: 400 }}>· {e.location}</span> : ''}
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(e.bullets ?? []).map((b, j) => (
                      <li key={j} style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.7 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 32 }}>Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
              {projects.map((pr, i) => (
                <div key={i} style={{ padding: 32, background: '#f8f9fa', borderRadius: 24 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 12px' }}>{pr.name}</h3>
                  <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, marginBottom: 24 }}>{pr.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(pr.techStack ?? []).map((t, j) => (
                      <span key={j} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 20, border: '1px solid #e5e7eb', color: '#374151', fontWeight: 500 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 32 }}>Skills</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0, width: 200, flexShrink: 0 }}>{s.category}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {(s.items ?? []).map((item, j) => (
                      <span key={j} style={{ fontSize: 16, color: '#4b5563' }}>{item}{j < s.items.length - 1 ? ' •' : ''}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 32 }}>Achievements</h2>
            <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {achievements.map((a, i) => (
                <li key={i} style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.7 }}>{a}</li>
              ))}
            </ul>
          </section>
        )}

      </main>
      
      {/* Footer */}
      <footer style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: 14, background: '#f8f9fa' }}>
        © {new Date().getFullYear()} {p.name}. Built with artfolio.
      </footer>
    </div>
  );
};
