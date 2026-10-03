import { projects, type Project } from './projects';

export type TapeKind = 'project' | 'about' | 'skills' | 'contact';

/** A cassette on the shelf. Projects and special tapes share this one shape. */
export interface Tape {
  id: string;
  kind: TapeKind;
  title: string;
  label: string;
  color: string;
  project?: Project;
}

const projectTapes: Tape[] = projects.map((p) => ({
  id: p.id,
  kind: 'project',
  title: p.title,
  label: p.cassetteLabel,
  color: p.color ?? '#f2b632',
  project: p,
}));

const specialTapes: Tape[] = [
  { id: 'about', kind: 'about', title: 'About Me', label: 'ABOUT ME', color: '#3b3f9a' },
  { id: 'skills', kind: 'skills', title: 'Skills', label: 'SKILLS', color: '#4f7f1a' },
  { id: 'contact', kind: 'contact', title: 'Contact', label: 'CONTACT', color: '#b5531c' },
];

/** Shelf order: projects first, then the special tapes. */
export const TAPES: Tape[] = [...projectTapes, ...specialTapes];
