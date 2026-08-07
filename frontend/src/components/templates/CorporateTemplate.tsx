import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const CorporateTemplate: React.FC = () => {
  const { portfolioData: d } = usePortfolio();
  if (!d || !d.personalInfo) return null;
  const p = d.personalInfo;
  const experience = (d.experience ?? []).filter(Boolean);
  const education = (d.education ?? []).filter(Boolean);
  const projects = (d.projects ?? []).filter(Boolean);
  const skills = (d.skills ?? []).filter(Boolean);
  const achievements = (d.achievements ?? []).filter(Boolean);

  const primaryColor = '#4f46e5';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter', sans-serif", padding: '40px 24px' }}>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Desktop Split view */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT SIDEBAR (Profile Card) */}
          <div style={{ background: '#fff', borderRadius: 24, padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center', border: '1px solid #f3f4f6' }}>
            
            {/* Avatar */}
            <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 48, fontWeight: 800 }}>
              {p.name.charAt(0)}
            </div>
            
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>{p.name}</h1>
            <p style={{ fontSize: 13, color: primaryColor, fontWeight: 500, margin: '0 0 16px', lineHeight: 1.5 }}>
              {p.role} {education[0]?.institution ? `at ${education[0].institution}` : ''}
            </p>
            {p.location && (
              <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: 16 }}>📍</span> {p.location}
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              {p.phone && (
                <a href={`tel:${p.phone}`} style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', textDecoration: 'none', transition: 'background 0.2s' }}>
                  📞
                </a>
              )}
              {p.email && (
                <a href={`mailto:${p.email}`} style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', textDecoration: 'none' }}>
                  ✉️
                </a>
              )}
            </div>
            
            <button style={{ width: '100%', padding: '14px 24px', background: primaryColor, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
              <span>📥</span> Download Resume
            </button>
            
            <div style={{ borderTop: '1px solid #f3f4f6', margin: '24px -24px 20px', padding: '24px 24px 0', textAlign: 'left' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 12px' }}>👤 About Me</h3>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                {p.bio}
              </p>
            </div>
            
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#166534' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }}></span> Available for new projects
            </div>
          </div>


          {/* RIGHT COLUMN (Content Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* About Card */}
            {p.bio && (
              <section style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: primaryColor }}>🔖</span> About
                </h2>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, margin: 0 }}>
                  {p.bio}
                </p>
              </section>
            )}

            {/* Education Card */}
            {education.length > 0 && (
              <section style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: primaryColor }}>🎓</span> Education
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {education.map((e, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>{e.degree}</h3>
                          <div style={{ fontSize: 14, color: primaryColor, fontWeight: 500 }}>
                            {e.institution} {e.location ? <span style={{ color: '#9ca3af', fontWeight: 400 }}>• {e.location}</span> : ''}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, color: '#6b7280', background: '#f3f4f6', padding: '4px 12px', borderRadius: 20 }}>
                          {e.startDate} – {e.endDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Card */}
            {experience.length > 0 && (
              <section style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: primaryColor }}>💼</span> Experience
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {experience.map((e, i) => (
                    <div key={i} style={{ borderBottom: i < experience.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: i < experience.length - 1 ? 24 : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>{e.role}</h3>
                          <div style={{ fontSize: 14, color: primaryColor, fontWeight: 500 }}>
                            {e.company} {e.location ? <span style={{ color: '#9ca3af', fontWeight: 400 }}>• {e.location}</span> : ''}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, color: '#6b7280', background: '#f3f4f6', padding: '4px 12px', borderRadius: 20 }}>
                          {e.startDate} – {e.endDate}
                        </div>
                      </div>
                      <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {(e.bullets ?? []).map((b, j) => (
                          <li key={j} style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Card */}
            {projects.length > 0 && (
              <section style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: primaryColor }}>🚀</span> Projects
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {projects.map((pr, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: 0 }}>{pr.name}</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {pr.links?.github && <a href={pr.links.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: primaryColor, textDecoration: 'none' }}>GitHub ↗</a>}
                          {pr.links?.live && <a href={pr.links.live} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: primaryColor, textDecoration: 'none' }}>Live ↗</a>}
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: '0 0 16px' }}>{pr.description}</p>
                      
                      {/* Tech Stack Pills, matching the blue pill design from Image 5 */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(pr.techStack ?? []).map((t, j) => (
                          <span key={j} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#e0e7ff', color: primaryColor, fontWeight: 600 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills & Achievements Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              
              {skills.length > 0 && (
                <section style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: primaryColor }}>⚡</span> Skills
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {skills.map((s, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{s.category}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {(s.items ?? []).map((item, j) => (
                            <span key={j} style={{ fontSize: 13, color: '#374151', padding: '4px 10px', background: '#f3f4f6', borderRadius: 8, fontWeight: 500 }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {achievements.length > 0 && (
                <section style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: primaryColor }}>🏆</span> Achievements
                  </h2>
                  <ul style={{ margin: 0, padding: '0 0 0 8px', display: 'flex', flexDirection: 'column', gap: 16, listStyle: 'none' }}>
                    {achievements.map((a, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ color: '#fbbf24', marginTop: 2 }}>★</span>
                        <span style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>{a}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
