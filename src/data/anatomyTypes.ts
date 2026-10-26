export type AnatomyLayer = 'deri' | 'kas' | 'iskelet' | 'organ' | 'damar' | 'sinir';

export type AnatomyStructure = {
  id: number;
  /** Latince (Terminologia Anatomica) adı */
  la: string;
  /** Türkçe adı */
  tr: string;
  layer: AnatomyLayer;
  /** Renk grubu (kas, kemik, arter, ven ...) */
  kind: string;
  /** L = sol, R = sağ, null = tek / orta hat */
  side: 'L' | 'R' | null;
  color: string;
};
