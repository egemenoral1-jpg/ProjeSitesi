import { profile } from '../../data/profile';
import type { Tape } from '../../data/tapes';
import { sfx } from '../../audio/audio';

interface Props {
  tape: Tape;
  onBack: () => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3>{title}</h3>
    {children}
  </section>
);

const List = ({ items }: { items: readonly string[] }) => (
  <ul>
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

const Chips = ({ items }: { items: readonly string[] }) => (
  <div className="chips">
    {items.map((i) => (
      <span key={i}>{i}</span>
    ))}
  </div>
);

function ExtLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) {
    return (
      <span className="btn is-off" aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <a className="btn" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" onClick={() => sfx.play('buttonClick')}>
      {children}
    </a>
  );
}

/** Everything the TV can play. One layout, content chosen from the tape. */
export function ProjectScreen({ tape, onBack }: Props) {
  const p = tape.project;
  const { about, skills, contact } = profile;

  return (
    <div className="tv-content" data-kind={tape.kind} style={{ ['--c' as string]: tape.color }}>
      <div className="tv-osd">▶ PLAY · {tape.label}</div>
      <h2>{tape.title}</h2>

      {tape.kind === 'project' && p && (
        <>
          <Section title="DESCRIPTION">
            <p>{p.description}</p>
          </Section>
          <Section title="TECHNOLOGIES">
            <Chips items={p.technologies} />
          </Section>
          <Section title="FEATURES">
            <List items={p.features} />
          </Section>
          <div className="btns">
            <ExtLink href={p.githubUrl}>[GITHUB REPOSITORY]</ExtLink>
            <ExtLink href={p.liveUrl}>[LIVE DEMO]</ExtLink>
          </div>
        </>
      )}

      {tape.kind === 'about' && (
        <>
          <Section title="INTRODUCTION">
            <p>{about.introduction}</p>
          </Section>
          <Section title="EDUCATION">
            <p>{about.education}</p>
          </Section>
          <Section title="INTERESTS">
            <Chips items={about.interests} />
          </Section>
          <Section title="CAREER DIRECTION">
            <p>{about.career}</p>
          </Section>
        </>
      )}

      {tape.kind === 'skills' && (
        <Section title="TECHNOLOGIES">
          <Chips items={skills} />
        </Section>
      )}

      {tape.kind === 'contact' && (
        <>
          <Section title="FIND ME">
            <div className="btns col">
              <ExtLink href={contact.github}>[GITHUB] egemenoral1-jpg</ExtLink>
              {contact.linkedin && <ExtLink href={contact.linkedin}>[LINKEDIN]</ExtLink>}
              <ExtLink href={`mailto:${contact.email}`}>[EMAIL] {contact.email}</ExtLink>
              <ExtLink href={contact.portfolio}>[PORTFOLIO] this room, on GitHub</ExtLink>
            </div>
          </Section>
        </>
      )}

      <div className="btns back">
        <button type="button" className="btn" onClick={onBack}>
          [BACK]
        </button>
      </div>
    </div>
  );
}
