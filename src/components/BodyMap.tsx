import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { BodyView } from '@/data/types';
import { colors } from '@/theme';

/**
 * Basitleştirilmiş insan silüeti. Her şekil bir bölgeye (region id) bağlıdır;
 * aynı bölge birden çok şekilden oluşabilir (örn. sağ ve sol deltoid).
 * Ön görünümde hastanın sağı ekranın solundadır.
 */
type Shape =
  | { region: string; kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { region: string; kind: 'circle'; cx: number; cy: number; r: number }
  | { region: string; kind: 'rect'; x: number; y: number; w: number; h: number; rx?: number }
  | { region: string; kind: 'path'; d: string };

const both = (make: (side: 1 | -1) => Shape): Shape[] => [make(1), make(-1)];
/** Sol kenara göre verilen x'i dikey eksende (x = 100) aynalar */
const mx = (x: number, side: 1 | -1) => (side === 1 ? x : 200 - x);

function armShapes(upper: string, elbow: string, forearm: string): Shape[] {
  return [
    ...both((s) => ({ region: upper, kind: 'path', d: `M${mx(52, s)},104 L${mx(68, s)},104 L${mx(66, s)},160 L${mx(50, s)},160 Z` })),
    ...both((s) => ({ region: elbow, kind: 'ellipse', cx: mx(58, s), cy: 166, rx: 8.5, ry: 7 })),
    ...both((s) => ({ region: forearm, kind: 'path', d: `M${mx(50, s)},172 L${mx(66, s)},172 L${mx(63, s)},222 L${mx(51, s)},222 Z` })),
  ];
}

const FRONT: Shape[] = [
  { region: '', kind: 'ellipse', cx: 100, cy: 42, rx: 24, ry: 30 },
  { region: 'frontalis', kind: 'path', d: 'M78,30 A24,30 0 0 1 122,30 Z' },
  ...both((s) => ({ region: 'orbitalis', kind: 'ellipse', cx: mx(91, s), cy: 37, rx: 6, ry: 4 })),
  ...both((s) => ({ region: 'buccalis', kind: 'ellipse', cx: mx(86, s), cy: 52, rx: 6, ry: 6 })),
  { region: 'nasalis', kind: 'path', d: 'M100,38 L95,50 L105,50 Z' },
  { region: 'oralis', kind: 'ellipse', cx: 100, cy: 57.5, rx: 7, ry: 3.5 },
  { region: 'mentalis', kind: 'ellipse', cx: 100, cy: 66, rx: 7, ry: 4 },
  { region: 'cervicalis-anterior', kind: 'rect', x: 90, y: 70, w: 20, h: 16, rx: 3 },
  ...armShapes('brachialis-anterior', 'cubitalis-anterior', 'antebrachialis-anterior'),
  ...both((s) => ({ region: 'carpalis-anterior', kind: 'rect', x: s === 1 ? 50 : 136, y: 222, w: 14, h: 9, rx: 2 })),
  ...both((s) => ({ region: 'palmaris', kind: 'ellipse', cx: mx(57, s), cy: 245, rx: 9, ry: 14 })),
  ...both((s) => ({ region: 'deltoidea', kind: 'ellipse', cx: mx(64, s), cy: 97, rx: 12, ry: 13 })),
  ...both((s) => ({ region: 'pectoralis', kind: 'path', d: `M${mx(72, s)},86 L${mx(95, s)},86 L${mx(95, s)},150 L${mx(70, s)},150 Z` })),
  { region: 'sternalis', kind: 'rect', x: 95, y: 86, w: 10, h: 64 },
  ...both((s) => ({ region: 'mammaria', kind: 'circle', cx: mx(83, s), cy: 122, r: 9 })),
  { region: 'hypochondriaca-dextra', kind: 'rect', x: 70, y: 150, w: 18, h: 24 },
  { region: 'epigastrica', kind: 'rect', x: 88, y: 150, w: 24, h: 24 },
  { region: 'hypochondriaca-sinistra', kind: 'rect', x: 112, y: 150, w: 18, h: 24 },
  { region: 'lateralis-dextra', kind: 'rect', x: 70, y: 174, w: 18, h: 24 },
  { region: 'umbilicalis', kind: 'rect', x: 88, y: 174, w: 24, h: 24 },
  { region: 'lateralis-sinistra', kind: 'rect', x: 112, y: 174, w: 18, h: 24 },
  { region: 'inguinalis-dextra', kind: 'rect', x: 70, y: 198, w: 18, h: 24 },
  { region: 'pubica', kind: 'rect', x: 88, y: 198, w: 24, h: 24 },
  { region: 'inguinalis-sinistra', kind: 'rect', x: 112, y: 198, w: 18, h: 24 },
  ...both((s) => ({
    region: 'femoralis-anterior',
    kind: 'path',
    d: `M${mx(70, s)},222 L${mx(92, s)},222 L100,242 L${mx(97, s)},320 L${mx(76, s)},320 Z`,
  })),
  { region: 'urogenitalis', kind: 'path', d: 'M92,222 L108,222 L100,242 Z' },
  ...both((s) => ({ region: 'genus-anterior', kind: 'ellipse', cx: mx(86.5, s), cy: 330, rx: 11, ry: 10.5 })),
  ...both((s) => ({ region: 'cruralis-anterior', kind: 'path', d: `M${mx(77, s)},340 L${mx(96, s)},340 L${mx(94, s)},408 L${mx(82, s)},408 Z` })),
  ...both((s) => ({ region: 'talocruralis', kind: 'rect', x: s === 1 ? 81 : 105, y: 408, w: 14, h: 10, rx: 2 })),
  ...both((s) => ({ region: 'dorsum-pedis', kind: 'ellipse', cx: mx(87, s), cy: 429, rx: 10, ry: 11 })),
];

const BACK: Shape[] = [
  { region: 'occipitalis', kind: 'ellipse', cx: 100, cy: 42, rx: 24, ry: 30 },
  { region: 'nuchalis', kind: 'rect', x: 90, y: 70, w: 20, h: 16, rx: 3 },
  ...armShapes('brachialis-posterior', 'olecrani', 'antebrachialis-posterior'),
  ...both((s) => ({ region: 'dorsum-manus', kind: 'ellipse', cx: mx(57, s), cy: 240, rx: 9, ry: 18 })),
  ...both((s) => ({ region: 'deltoidea', kind: 'ellipse', cx: mx(64, s), cy: 97, rx: 12, ry: 13 })),
  ...both((s) => ({ region: 'scapularis', kind: 'path', d: `M${mx(72, s)},86 L${mx(95, s)},86 L${mx(95, s)},140 L${mx(71, s)},140 Z` })),
  ...both((s) => ({ region: 'infrascapularis', kind: 'path', d: `M${mx(71, s)},140 L${mx(95, s)},140 L${mx(95, s)},172 L${mx(70, s)},172 Z` })),
  ...both((s) => ({ region: 'lumbalis', kind: 'path', d: `M${mx(70, s)},172 L${mx(95, s)},172 L${mx(95, s)},205 L${mx(70, s)},205 Z` })),
  { region: 'vertebralis', kind: 'rect', x: 95, y: 86, w: 10, h: 112 },
  ...both((s) => ({ region: 'femoralis-posterior', kind: 'path', d: `M${mx(70, s)},225 L${mx(99, s)},225 L${mx(97, s)},320 L${mx(76, s)},320 Z` })),
  ...both((s) => ({ region: 'glutealis', kind: 'ellipse', cx: mx(85, s), cy: 222, rx: 16, ry: 20 })),
  { region: 'sacralis', kind: 'path', d: 'M92,198 L108,198 L100,226 Z' },
  { region: 'analis', kind: 'circle', cx: 100, cy: 238, r: 4.5 },
  ...both((s) => ({ region: 'poplitea', kind: 'ellipse', cx: mx(86.5, s), cy: 330, rx: 11, ry: 10.5 })),
  ...both((s) => ({ region: 'suralis', kind: 'path', d: `M${mx(77, s)},340 Q${mx(71, s)},368 ${mx(82, s)},408 L${mx(94, s)},408 Q${mx(99, s)},368 ${mx(96, s)},340 Z` })),
  ...both((s) => ({ region: 'calcanea', kind: 'ellipse', cx: mx(88, s), cy: 418, rx: 8, ry: 9 })),
];

type Props = {
  view: BodyView;
  /** Bölge id → vurgu rengi */
  highlights?: Record<string, string>;
  onSelect?: (regionId: string) => void;
};

export function BodyMap({ view, highlights = {}, onSelect }: Props) {
  const shapes = view === 'front' ? FRONT : BACK;
  const [left, right] = view === 'front' ? ['SAĞ', 'SOL'] : ['SOL', 'SAĞ'];

  return (
    <Svg viewBox="0 0 200 450" width="100%" height="100%">
      <G>
        {shapes.map((shape, i) => {
          const highlight = shape.region ? highlights[shape.region] : undefined;
          const active = highlight !== undefined;
          const common = {
            fill: highlight ?? colors.bodyFill,
            stroke: highlight ?? colors.bodyStroke,
            strokeWidth: 0.8,
            fillOpacity: active ? 0.85 : 1,
            onPress: shape.region && onSelect ? () => onSelect(shape.region) : undefined,
          };
          switch (shape.kind) {
            case 'ellipse':
              return <Ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} {...common} />;
            case 'circle':
              return <Circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />;
            case 'rect':
              return <Rect key={i} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx ?? 0} {...common} />;
            case 'path':
              return <Path key={i} d={shape.d} {...common} />;
          }
        })}
      </G>
      <SvgText x={14} y={444} fontSize={10} fontWeight="bold" fill={colors.muted}>
        {left}
      </SvgText>
      <SvgText x={186} y={444} fontSize={10} fontWeight="bold" fill={colors.muted} textAnchor="end">
        {right}
      </SvgText>
    </Svg>
  );
}

/** Belirli bir görünümde haritada çizili olan bölgeler */
export function regionIdsForView(view: BodyView): string[] {
  const shapes = view === 'front' ? FRONT : BACK;
  return [...new Set(shapes.map((s) => s.region).filter(Boolean))];
}
