import { projects, type Project } from './projects';

/** A cassette next to the TV. One per project. */
export interface Tape {
  id: string;
  title: string;
  label: string;
  color: string;
  project: Project;
}

export const TAPES: Tape[] = projects.map((p) => ({
  id: p.id,
  title: p.title,
  label: p.cassetteLabel,
  color: p.color,
  project: p,
}));
