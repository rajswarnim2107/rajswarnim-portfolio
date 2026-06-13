import { motion } from 'framer-motion';
import type { VizType } from '@/data/cinematic-data';

/**
 * Pure-SVG animated visualizations hinting at each case study. Seven of
 * these run concurrently in the gallery, so each stays under ~12 animated
 * elements. All are decorative (aria-hidden) and themed by accent color.
 */

interface VizProps {
  type: VizType;
  accent: string;
}

const GRID = (
  <g opacity={0.05}>
    {Array.from({ length: 9 }, (_, i) => (
      <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={160} stroke="white" strokeWidth={0.5} />
    ))}
    {Array.from({ length: 4 }, (_, i) => (
      <line key={`h${i}`} x1={0} y1={i * 53} x2={400} y2={i * 53} stroke="white" strokeWidth={0.5} />
    ))}
  </g>
);

function TokensViz({ accent }: { accent: string }) {
  // A query of tokens flowing right; entities split into a parsed lane.
  const tokens = [22, 60, 104, 156, 196, 244, 296];
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {GRID}
      {tokens.map((x, i) => {
        const entity = i === 2 || i === 5;
        return (
          <motion.rect
            key={i}
            x={x}
            y={entity ? 96 : 66}
            rx={4}
            width={i % 3 === 0 ? 34 : 26}
            height={14}
            fill={entity ? accent : 'rgba(255,255,255,0.18)'}
            style={entity ? { filter: `drop-shadow(0 0 6px ${accent})` } : undefined}
            animate={{ x: [0, 40, 0], y: entity ? [0, 6, 0] : 0, opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        );
      })}
      <motion.line
        x1={0} y1={88} x2={400} y2={88}
        stroke={accent} strokeWidth={0.75} strokeDasharray="6 10" opacity={0.35}
        animate={{ strokeDashoffset: [0, -64] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

function RagViz({ accent }: { accent: string }) {
  // Scattered document chunks converge along beziers into one glowing node.
  const docs = [
    [40, 24], [28, 60], [52, 96], [36, 132], [96, 40], [88, 110], [120, 70], [110, 20],
  ];
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {GRID}
      {docs.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={14} height={16} rx={2} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
          <motion.path
            d={`M ${x + 14} ${y + 8} C ${x + 110} ${y + 8}, 240 80, 318 80`}
            fill="none"
            stroke={accent}
            strokeWidth={1}
            strokeDasharray="4 8"
            opacity={0.4}
            animate={{ strokeDashoffset: [0, -48] }}
            transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, ease: 'linear' }}
          />
        </g>
      ))}
      <motion.circle
        cx={322} cy={80} r={12}
        fill={accent}
        style={{ filter: `drop-shadow(0 0 12px ${accent})` }}
        animate={{ r: [11, 14, 11], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function HeatmapViz({ accent }: { accent: string }) {
  // Ranking grid; a highlight column sweeps as scores reshuffle.
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {GRID}
      {Array.from({ length: 6 }, (_, col) =>
        Array.from({ length: 4 }, (_, row) => (
          <motion.rect
            key={`${col}-${row}`}
            x={52 + col * 52}
            y={18 + row * 32}
            width={40}
            height={24}
            rx={4}
            fill={accent}
            animate={{ opacity: [0.08 + ((col * 7 + row * 13) % 5) * 0.1, 0.55 - ((col * 3 + row) % 4) * 0.1, 0.08 + ((col + row) % 5) * 0.09] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: (col + row) * 0.18, repeatType: 'mirror' }}
          />
        ))
      )}
      <motion.rect
        x={48} y={12} width={48} height={136} rx={6}
        fill="none" stroke={accent} strokeWidth={1.25} opacity={0.7}
        animate={{ x: [0, 260, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function MatrixViz({ accent }: { accent: string }) {
  // Dense feature ticks with a diagonal scanline; one row resolves to an output dot.
  const cells: Array<[number, number]> = [];
  for (let c = 0; c < 14; c++) for (let r = 0; r < 5; r++) cells.push([26 + c * 22, 24 + r * 24]);
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {GRID}
      <g>
        {cells.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={8} height={2.5} rx={1} fill="rgba(255,255,255,0.22)" />
        ))}
      </g>
      {/* Diagonal brightness scan — a rotated gradient bar passing over the matrix */}
      <motion.rect
        x={-80} y={-40} width={48} height={260} rx={8}
        fill={accent} opacity={0.16}
        transform="rotate(18 0 0)"
        animate={{ x: [-80, 440] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.circle
        cx={356} cy={72} r={7} fill={accent}
        style={{ filter: `drop-shadow(0 0 8px ${accent})` }}
        animate={{ opacity: [0.4, 1, 0.4], r: [6, 8, 6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <text x={356} y={104} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={11} fontFamily="JetBrains Mono, monospace">
        &lt;30ms
      </text>
    </svg>
  );
}

function AvatarViz({ accent }: { accent: string }) {
  // Low-poly wireframe face + waveform mouth bars + scanline.
  const face = '200,18 232,30 252,58 256,92 244,122 218,142 200,148 182,142 156,122 144,92 148,58 168,30';
  const tris = [
    'M168,30 L200,52 L232,30', 'M148,58 L182,76 L168,30', 'M252,58 L218,76 L232,30',
    'M182,76 L200,52 L218,76', 'M156,122 L182,104 L144,92', 'M244,122 L218,104 L256,92',
  ];
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {GRID}
      <polygon points={face} fill="none" stroke={accent} strokeWidth={1} opacity={0.6} />
      {tris.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={accent} strokeWidth={0.6} opacity={0.3} />
      ))}
      {/* Mouth waveform — three bars breathing like speech amplitude */}
      {[188, 200, 212].map((x, i) => (
        <motion.rect
          key={x}
          x={x - 2.5} y={118} width={5} rx={2} fill={accent}
          style={{ filter: `drop-shadow(0 0 5px ${accent})`, originY: '124px' }}
          initial={{ height: 5 }}
          animate={{ height: [5, 14 - i * 3, 4, 11, 5], y: [118, 113.5 + i * 1.5, 118.5, 115, 118] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
        />
      ))}
      <motion.line
        x1={130} x2={270} y1={20} y2={20}
        stroke="white" strokeWidth={0.75} opacity={0.35}
        animate={{ y1: [20, 148, 20], y2: [20, 148, 20] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function StreamViz({ accent }: { accent: string }) {
  // Latency before/after: jagged dashed line vs smooth glowing low line.
  const before = 'M0,52 L40,38 L80,64 L120,30 L160,70 L200,42 L240,76 L280,36 L320,68 L360,44 L400,60';
  const after = 'M0,118 C80,112 160,124 240,118 S360,114 400,118';
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {GRID}
      {[80, 160, 240, 320].map((x) => (
        <text key={x} x={x} y={154} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="JetBrains Mono, monospace">
          t+{x / 80}
        </text>
      ))}
      <motion.path
        d={before} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.25} strokeDasharray="5 5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <motion.path
        d={after} fill="none" stroke={accent} strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.4 }}
      />
      {/* Dot riding the after-line */}
      <motion.circle
        r={4} fill={accent} style={{ filter: `drop-shadow(0 0 8px ${accent})` }}
        animate={{ cx: [0, 400], cy: [118, 116, 120, 118] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'linear', delay: 2.2 }}
      />
    </svg>
  );
}

function PulseViz({ accent }: { accent: string }) {
  // Calm metric line with periodic anomaly spikes + expanding detection pings.
  const line = 'M0,84 L120,84 L132,84 L142,40 L152,116 L162,84 L260,84 L272,84 L282,58 L292,104 L302,84 L400,84';
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {GRID}
      <motion.path
        d={line} fill="none" stroke={accent} strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      {[{ cx: 147, d: 0 }, { cx: 287, d: 1.4 }].map(({ cx, d }) => (
        <g key={cx}>
          <motion.circle
            cx={cx} cy={78} r={4} fill="none" stroke={accent} strokeWidth={1.5}
            animate={{ r: [4, 22], opacity: [0.9, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: d }}
          />
          <motion.circle
            cx={cx} cy={78} r={3} fill={accent}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: d }}
          />
        </g>
      ))}
    </svg>
  );
}

export function ProjectViz({ type, accent }: VizProps) {
  switch (type) {
    case 'tokens':
      return <TokensViz accent={accent} />;
    case 'rag':
      return <RagViz accent={accent} />;
    case 'heatmap':
      return <HeatmapViz accent={accent} />;
    case 'matrix':
      return <MatrixViz accent={accent} />;
    case 'avatar':
      return <AvatarViz accent={accent} />;
    case 'stream':
      return <StreamViz accent={accent} />;
    case 'pulse':
      return <PulseViz accent={accent} />;
  }
}
