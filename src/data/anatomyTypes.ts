export type AnatomyLayer = 'deri' | 'kas' | 'iskelet' | 'organ' | 'damar' | 'sinir';

/** 3D beden modeli: erkek (BodyParts3D) ve kadın (aynı yapılar kadın iskeletine oturtulmuş + kadına özgü yapılar) */
export type AnatomyModel = 'erkek' | 'kadin';

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
  /** Yalnızca bir modelde varsa o model (ör. rahim yalnızca kadında); yoksa iki modelde de vardır */
  model?: AnatomyModel;
};
