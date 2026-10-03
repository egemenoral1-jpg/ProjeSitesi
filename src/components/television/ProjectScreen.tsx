import { useEffect, useState } from 'react';
import type { Tape } from '../../data/tapes';
import type { RepoInfo } from '../../data/projects';
import { sfx } from '../../audio/audio';

/** GitHub's language colours. */
const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#663399',
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(+d) ? iso : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Stars / forks / last push refreshed from the GitHub API (falls back to the snapshot). */
function useLiveRepo(repo: RepoInfo) {
  const [live, setLive] = useState<Partial<RepoInfo>>({});
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.github.com/repos/${repo.fullName}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setLive({ stars: d.stargazers_count, forks: d.forks_count, pushedAt: d.pushed_at, sizeKb: d.size });
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [repo.fullName]);
  return { ...repo, ...live };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ExtLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) {
    return (
      <span className="btn is-off" aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <a className="btn" href={href} target="_blank" rel="noopener noreferrer" onClick={() => sfx.play('buttonClick')}>
      {children}
    </a>
  );
}

/** What a tape plays: project description plus its repository details. */
export function ProjectScreen({ tape, onBack }: { tape: Tape; onBack: () => void }) {
  const p = tape.project;
  const repo = useLiveRepo(p.repo);
  const total = Object.values(repo.languages).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(repo.languages).sort((a, b) => b[1] - a[1]);

  return (
    <div className="tv-content">
      <div className="tv-osd">▶ PLAY · {tape.label}</div>
      <h2>{p.title}</h2>
      <p className="tagline">{p.tagline}</p>

      <Section title="AÇIKLAMA">
        <p>{p.description}</p>
      </Section>

      <Section title="ÖZELLİKLER">
        <ul>
          {p.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Section>

      <Section title="TEKNOLOJİLER">
        <div className="chips">
          {p.technologies.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </Section>

      <Section title="REPO BİLGİSİ">
        <div className="repo-name">{repo.fullName}</div>
        <div className="lang-bar" aria-hidden="true">
          {langs.map(([name, bytes]) => (
            <i key={name} style={{ width: `${(bytes / total) * 100}%`, background: LANG_COLORS[name] ?? '#888' }} />
          ))}
        </div>
        <div className="lang-legend">
          {langs.map(([name, bytes]) => (
            <span key={name}>
              <b style={{ background: LANG_COLORS[name] ?? '#888' }} />
              {name} {((bytes / total) * 100).toFixed(1)}%
            </span>
          ))}
        </div>
        <dl className="repo-stats">
          <div><dt>Commit</dt><dd>{repo.commits}</dd></div>
          <div><dt>Yıldız</dt><dd>★ {repo.stars}</dd></div>
          <div><dt>Fork</dt><dd>{repo.forks}</dd></div>
          <div><dt>Boyut</dt><dd>{repo.sizeKb} KB</dd></div>
          <div><dt>Dal</dt><dd>{repo.defaultBranch}</dd></div>
          <div><dt>Oluşturuldu</dt><dd>{fmtDate(repo.createdAt)}</dd></div>
          <div><dt>Son push</dt><dd>{fmtDate(repo.pushedAt)}</dd></div>
        </dl>
        <div className="repo-tree">
          {repo.structure.map((f) => (
            <span key={f} className={f.endsWith('/') ? 'dir' : ''}>
              {f.endsWith('/') ? '▸ ' : '· '}
              {f}
            </span>
          ))}
        </div>
      </Section>

      <div className="btns">
        <ExtLink href={p.githubUrl}>[GITHUB REPOSU]</ExtLink>
        {p.liveUrl && <ExtLink href={p.liveUrl}>[CANLI SİTE]</ExtLink>}
      </div>

      <div className="btns back">
        <button type="button" className="btn" onClick={onBack}>
          [GERİ]
        </button>
      </div>
    </div>
  );
}
