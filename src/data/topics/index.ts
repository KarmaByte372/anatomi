import type { Topic } from '../types';
import { giris, iskelet, eklemler } from './temel';
import { kas } from './kas';
import { pelvis, kadinUreme, meme, fetal } from './ebelik';
import { dolasim, solunum, sindirim, uriner, erkekUreme } from './sistemler';
import { sinir, endokrin, duyu } from './sinir';

/** Ders sırası: önce temel kavramlar, sonra sistemler, ebelik için kritik konular ayrıca işaretli. */
export const topics: Topic[] = [
  giris,
  iskelet,
  eklemler,
  kas,
  dolasim,
  solunum,
  sindirim,
  uriner,
  kadinUreme,
  pelvis,
  meme,
  fetal,
  erkekUreme,
  sinir,
  endokrin,
  duyu,
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
