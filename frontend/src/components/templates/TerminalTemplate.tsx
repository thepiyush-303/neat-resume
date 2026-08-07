import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const Line: React.FC<{ prompt?: string; children: React.ReactNode; dim?: boolean }> = ({ prompt = '$', children, dim }) => (
  <div style={{ display: 'flex', gap: 12, opacity: dim ? 0.5 : 1 }}>
    <span style={{ color: '#4ade80', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, flexShrink: 0 }}>{prompt}</span>
    <span style={{ color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{children}</span>
  </div>
);

const Cmd: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ marginTop: 32, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, opacity: 0.7 }}>~/portfolio</span>
    <span style={{ color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>❯</span>
    <span style={{ color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{text}</span>
  </div>
);

export const TerminalTemplate: React.FC = () => {
  const { portfolioData: d } = usePortfolio();
  if (!d || !d.personalInfo) return null;
  const p = d.personalInfo;
  const experience = (d.experience ?? []).filter(Boolean);
  const education = (d.education ?? []).filter(Boolean);
  const projects = (d.projects ?? []).filter(Boolean);
  const skills = (d.skills ?? []).filter(Boolean);
  const achievements = (d.achievements ?? []).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 48px', background: '#0d1117', fontFamily: 'JetBrains Mono, Courier New, monospace' }}>
      {/* Terminal title bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(239,68,68,0.8)', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(251,191,36,0.8)', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(34,197,94,0.8)', display: 'inline-block' }} />
        <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 12 }}>⊞ portfolio.sh — bash</span>
      </div>

      {/* Boot */}
      <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Line prompt="#" dim>NeatResume Terminal v2.0 — Interactive Portfolio</Line>
        <Line prompt="#" dim>Loading profile data... OK</Line>
      </div>

      <Cmd text="whoami" />
      <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Line prompt=">">{p.name}</Line>
        <Line prompt=">">{p.role}</Line>
        {p.location && <Line prompt=">">📍 {p.location}</Line>}
        {p.bio && <div style={{ marginTop: 12, paddingLeft: 8, borderLeft: '2px solid rgba(74,222,128,0.3)', color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>{p.bio}</div>}
      </div>

      <Cmd text="cat contact.txt" />
      <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {p.email && <Line prompt=">"><span style={{ color: '#f59e0b' }}>EMAIL</span>={p.email}</Line>}
        {p.github && <Line prompt=">"><span style={{ color: '#f59e0b' }}>GITHUB</span>={p.github}</Line>}
        {p.linkedin && <Line prompt=">"><span style={{ color: '#f59e0b' }}>LINKEDIN</span>={p.linkedin}</Line>}
        {p.phone && <Line prompt=">"><span style={{ color: '#f59e0b' }}>PHONE</span>={p.phone}</Line>}
      </div>

      {skills.length > 0 && (
        <>
          <Cmd text="ls ./skills/" />
          <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {skills.map((s, i) => (
              <div key={i}>
                <Line prompt=">"><span style={{ color: '#60a5fa' }}>{s.category}/</span></Line>
                <div style={{ paddingLeft: 32, color: '#94a3b8', fontSize: 12, fontFamily: 'monospace', marginTop: 2 }}>
                  {(s.items ?? []).join('  ')}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {experience.length > 0 && (
        <>
          <Cmd text="cat experience.log" />
          <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {experience.map((e, i) => (
              <div key={i}>
                <Line prompt=">"><span style={{ color: '#a78bfa' }}>[{e.startDate} → {e.endDate}]</span> {e.company}</Line>
                <div style={{ paddingLeft: 32, marginTop: 4, color: '#64748b', fontSize: 12 }}>role: {e.role}{e.location ? ` | ${e.location}` : ''}</div>
                {(e.bullets ?? []).map((b, j) => (
                  <div key={j} style={{ paddingLeft: 32, marginTop: 4, display: 'flex', gap: 8, color: '#94a3b8', fontSize: 12 }}>
                    <span style={{ color: '#4ade80' }}>+</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {projects.length > 0 && (
        <>
          <Cmd text="ls -la ./projects/" />
          <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.map((pr, i) => (
              <div key={i}>
                <Line prompt=">"><span style={{ color: '#38bdf8' }}>{pr.name}</span>{pr.links?.github ? ` <${pr.links.github}>` : ''}</Line>
                <div style={{ paddingLeft: 32, marginTop: 4, color: '#94a3b8', fontSize: 12 }}>{pr.description}</div>
                <div style={{ paddingLeft: 32, marginTop: 4, color: '#64748b', fontSize: 11 }}>tech: [{(pr.techStack ?? []).join(', ')}]</div>
              </div>
            ))}
          </div>
        </>
      )}

      {education.length > 0 && (
        <>
          <Cmd text="cat education.json" />
          <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {education.map((e, i) => (
              <div key={i}>
                <Line prompt=">"><span style={{ color: '#f59e0b' }}>{e.institution}</span></Line>
                <div style={{ paddingLeft: 32, marginTop: 2, color: '#94a3b8', fontSize: 12 }}>{e.degree} | {e.startDate}–{e.endDate}{e.gpa ? ` | GPA: ${e.gpa}` : ''}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {achievements.length > 0 && (
        <>
          <Cmd text="cat achievements.txt" />
          <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {achievements.map((a, i) => (
              <Line key={i} prompt=">"><span style={{ color: '#fbbf24' }}>★</span> {a}</Line>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 13 }}>~/portfolio</span>
        <span style={{ color: '#a78bfa', fontSize: 13 }}>❯</span>
        <span style={{ display: 'inline-block', width: 8, height: 16, background: '#4ade80', animation: 'blink 1s step-end infinite', marginTop: 2 }} />
      </div>
    </div>
  );
};
