import type { IconName } from './types';
import { anatomyStructures } from './anatomy3d';
import type { AnatomyLayer, AnatomyStructure } from './anatomyTypes';

export const LAYERS: { id: AnatomyLayer; label: string; icon: IconName; color: string }[] = [
  { id: 'deri', label: 'Deri', icon: 'person-outline', color: '#D9A383' },
  { id: 'kas', label: 'Kaslar', icon: 'barbell-outline', color: '#B8433F' },
  { id: 'iskelet', label: 'İskelet', icon: 'body-outline', color: '#B9A77F' },
  { id: 'organ', label: 'Organlar', icon: 'heart-outline', color: '#C7684D' },
  { id: 'damar', label: 'Damarlar', icon: 'git-branch-outline', color: '#D33A3A' },
  { id: 'sinir', label: 'Sinir sistemi', icon: 'flash-outline', color: '#C9A227' },
];

/** Aramada isimde geçmeyen ortak kelimeler (ör. "kalp" → karıncık, kapak) */
const KIND_KEYWORDS: Record<string, string> = {
  heart: 'kalp kardiyak',
  valve: 'kalp kapak',
  liver: 'karaciğer',
  gall: 'safra',
  bile: 'safra',
  gi: 'sindirim bağırsak',
  lung: 'akciğer solunum',
  kidney: 'böbrek',
  urinary: 'idrar',
  genital: 'üreme',
  gland: 'bez hormon',
  artery: 'arter atardamar damar',
  vein: 'ven toplardamar damar',
  portal: 'ven portal damar',
  muscle: 'kas',
  tendon: 'tendon bağ',
  bone: 'kemik',
  cartilage: 'kıkırdak',
  tooth: 'diş',
  brain: 'beyin',
  brainstem: 'beyin',
  white: 'beyin',
  nerve: 'sinir',
  eye: 'göz',
  iris: 'göz',
  lens: 'göz',
};

export function searchText(s: AnatomyStructure): string {
  return `${s.la} ${s.tr} ${KIND_KEYWORDS[s.kind] ?? ''}`;
}

export const layerLabel = (l: AnatomyLayer) => LAYERS.find((x) => x.id === l)?.label ?? l;

const ORGAN_TOPIC: Record<string, string> = {
  gi: 'sindirim',
  liver: 'sindirim',
  gall: 'sindirim',
  bile: 'sindirim',
  pancreas: 'sindirim',
  spleen: 'dolasim',
  kidney: 'uriner',
  urinary: 'uriner',
  heart: 'dolasim',
  valve: 'dolasim',
  lung: 'solunum',
  cartilage: 'solunum',
  membrane: 'solunum',
  gland: 'endokrin',
  genital: 'erkek-ureme',
  eye: 'duyu',
  iris: 'duyu',
  lens: 'duyu',
  nerve: 'duyu',
};

/** Yapının anlatıldığı ders konusu */
export function topicForStructure(s: AnatomyStructure): string {
  if (s.layer === 'organ') return ORGAN_TOPIC[s.kind] ?? 'sindirim';
  if (s.layer === 'kas') return s.la.includes('levator ani') || s.la.includes('coccygeus') || s.la.includes('sphincter ani') ? 'pelvis' : 'kas';
  if (s.layer === 'iskelet') return s.la.startsWith('Discus') ? 'eklemler' : 'iskelet';
  if (s.layer === 'damar') return 'dolasim';
  if (s.layer === 'sinir') return s.kind === 'gland' ? 'endokrin' : 'sinir';
  return 'duyu';
}

export function sideLabel(s: AnatomyStructure): string | null {
  return s.side === 'L' ? 'Sol' : s.side === 'R' ? 'Sağ' : null;
}

export function getStructure(id: number): AnatomyStructure | undefined {
  return anatomyStructures[id];
}

export { anatomyStructures };
