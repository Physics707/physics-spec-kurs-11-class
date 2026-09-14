import React from 'react';

interface AxisProps {
  width?: number;
  height?: number;
  padding?: { number },
}

const Grid: React.FC<{ step: number; width: number; height: number; offsetX: number; offsetY: number }> = ({ step, width, height, offsetX, offsetY }) => {
  const lines: React.ReactElement[] = [];
  for (let x = offsetX % step; x < width; x += step) {
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#e2e8f0" strokeWidth={0.5} />);
  }
  for (let y = offsetY % step; y < height; y += step) {
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} stroke="#e2e8f0" strokeWidth={0.5} />);
  }
  return <g>{lines}</g>;
};

const GraphFrame: React.FC<{
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  xMax: number;
  yMax: number;
  xStep?: number;
  yStep?: number;
  children: React.ReactNode;
}> = ({ width, height, xLabel, yLabel, xUnit, yUnit, xMax, yMax, xStep = 1, yStep = 1, children }) => {
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const cellSize = 25;
  const originX = padL;
  const originY = padT + plotH / 2;

  const xTicks: number[] = [];
  for (let i = 0; i <= xMax; i += xStep) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -yMax; i <= yMax; i += yStep) yTicks.push(i);

  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      {/* Grid */}
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / cellSize) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * cellSize} y1={padT} x2={padL + i * cellSize} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / cellSize) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * cellSize} x2={padL + plotW} y2={padT + i * cellSize} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>

      {/* Axes */}
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />

      {/* Arrow heads */}
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {/* X axis ticks and labels */}
      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v)} y1={originY - 3} x2={xScale(v)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v}</text>
        </g>
      ))}

      {/* Y axis ticks and labels */}
      {yTicks.map((v) => (
        v !== 0 ? (
          <g key={`yt${v}`}>
            <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
            <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v}</text>
          </g>
        ) : null
      ))}

      {/* Axis labels */}
      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>{xLabel}{xUnit ? `, ${xUnit}` : ''}</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>{yLabel}{yUnit ? `, ${yUnit}` : ''}</text>

      {/* 0 label */}
      <text x={padL - 6} y={originY + 14} textAnchor="end" fontSize={9} fill="#475569">0</text>

      {/* Plot content */}
      <g clipPath={`url(#clip-${xLabel}-${yLabel})`}>
        <defs>
          <clipPath id={`clip-${xLabel}-${yLabel}`}>
            <rect x={padL} y={padT} width={plotW} height={plotH} />
          </clipPath>
        </defs>
        {typeof children === 'function' ? (children as any)({ xScale, yScale, originX, originY, plotW, plotH }) : children}
      </g>
    </svg>
  );
};

// 1. Harmonic oscillation: x(t), v(t), a(t) on same graph
export const HarmonicOscillationGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 4 * Math.PI;
  const yMax = 3;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const points = (fn: (t: number) => number, color: string, label: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * xMax;
      const x = xScale(t);
      const y = yScale(fn(t));
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />
        <text x={xScale(xMax) - 8} y={yScale(fn(xMax - 0.3)) - 8} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 4; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -3; i <= 3; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v * Math.PI)} y1={originY - 3} x2={xScale(v * Math.PI)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v * Math.PI)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}π`}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}A` : `${v}A`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>t, с</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>x, v, a</text>

      {points((t) => 2 * Math.cos(t), '#2563eb', 'x(t)')}
      {points((t) => -2 * Math.sin(t), '#dc2626', 'v(t)')}
      {points((t) => -2 * Math.cos(t), '#16a34a', 'a(t)')}
    </svg>
  );
};

// 2. Energy of harmonic oscillation (K, U, E_total)
export const EnergyGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 4 * Math.PI;
  const yMax = 2;
  const originX = padL;
  const originY = padT + plotH;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * plotH;

  const points = (fn: (t: number) => number, color: string, label: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * xMax;
      pts.push(`${xScale(t).toFixed(1)},${yScale(fn(t)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />
        <text x={xScale(xMax * 0.75)} y={yScale(fn(xMax * 0.75)) - 8} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 4; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = 0; i <= 2; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v * Math.PI)} y1={originY - 3} x2={xScale(v * Math.PI)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v * Math.PI)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}π`}</text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}E`}</text>
        </g>
      ))}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>t, с</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>E, Дж</text>

      {points((t) => 0.5 + 0.5 * Math.cos(2 * t), '#2563eb', 'E_k(t)')}
      {points((t) => 0.5 - 0.5 * Math.cos(2 * t), '#dc2626', 'E_p(t)')}
      {points((t) => 1.0, '#16a34a', 'E_полн')}
    </svg>
  );
};

// 3. LC oscillation circuit diagram
export const LCircuitDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 400 240" className="w-full h-auto" style={{ maxWidth: '320px' }}>
      {/* Wires */}
      <line x1="80" y1="60" x2="80" y2="180" stroke="#334155" strokeWidth={2} />
      <line x1="80" y1="60" x2="180" y2="60" stroke="#334155" strokeWidth={2} />
      <line x1="220" y1="60" x2="320" y2="60" stroke="#334155" strokeWidth={2} />
      <line x1="320" y1="60" x2="320" y2="180" stroke="#334155" strokeWidth={2} />
      <line x1="80" y1="180" x2="320" y2="180" stroke="#334155" strokeWidth={2} />

      {/* Capacitor */}
      <line x1="180" y1="45" x2="180" y2="75" stroke="#334155" strokeWidth={2.5} />
      <line x1="220" y1="45" x2="220" y2="75" stroke="#334155" strokeWidth={2.5} />
      <text x="200" y="35" textAnchor="middle" fontSize={13} fill="#1e293b" fontWeight={700}>C</text>

      {/* Inductor (coil) */}
      <path d="M 80 180 Q 90 160 100 180 Q 110 160 120 180 Q 130 160 140 180 Q 150 160 160 180 Q 170 160 180 180 Q 190 160 200 180 Q 210 160 220 180 Q 230 160 240 180 Q 250 160 260 180 Q 270 160 280 180 Q 290 160 300 180 Q 310 160 320 180" fill="none" stroke="#334155" strokeWidth={2} />
      <text x="200" y="205" textAnchor="middle" fontSize={13} fill="#1e293b" fontWeight={700}>L</text>

      {/* Current direction */}
      <text x="150" y="50" textAnchor="middle" fontSize={11} fill="#dc2626" fontWeight={600}>i</text>
      <path d="M 155 55 L 165 50 L 155 45" fill="none" stroke="#dc2626" strokeWidth={1.5} />

      {/* Charge labels */}
      <text x="190" y="55" textAnchor="middle" fontSize={11} fill="#2563eb" fontWeight={600}>+q</text>
      <text x="210" y="55" textAnchor="middle" fontSize={11} fill="#2563eb" fontWeight={600}>−q</text>
    </svg>
  );
};

// 4. Mechanical-Electromagnetic analogy diagram
export const MechElecAnalogyDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 500 280" className="w-full h-auto" style={{ maxWidth: '100%' }}>
      {/* Left: Spring-mass system */}
      <g>
        <text x="120" y="25" textAnchor="middle" fontSize={13} fill="#1e293b" fontWeight={700}>Механическая система</text>
        {/* Wall */}
        <line x1="30" y1="50" x2="30" y2="130" stroke="#334155" strokeWidth={3} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={20} y1={55 + i * 10} x2={30} y2={65 + i * 10} stroke="#334155" strokeWidth={1.5} />
        ))}
        {/* Spring */}
        <path d="M 30 90 L 50 90 L 55 80 L 65 100 L 75 80 L 85 100 L 95 80 L 105 100 L 115 80 L 125 100 L 130 90 L 150 90" fill="none" stroke="#2563eb" strokeWidth={2} />
        {/* Mass */}
        <rect x="150" y="70" width="50" height="40" rx={4} fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
        <text x="175" y="95" textAnchor="middle" fontSize={14} fill="#1e293b" fontWeight={700}>m</text>
        {/* Floor */}
        <line x1="20" y1="140" x2="210" y2="140" stroke="#334155" strokeWidth={1.5} />
        {/* Labels */}
        <text x="90" y="60" textAnchor="middle" fontSize={11} fill="#2563eb" fontWeight={600}>k</text>
        <text x="175" y="130" textAnchor="middle" fontSize={11} fill="#475569">x</text>
      </g>

      {/* Arrow */}
      <g>
        <line x1="230" y1="90" x2="270" y2="90" stroke="#64748b" strokeWidth={2} />
        <polygon points="270,90 264,86 264,94" fill="#64748b" />
        <text x="250" y="80" textAnchor="middle" fontSize={10} fill="#64748b" fontWeight={600}>аналогия</text>
      </g>

      {/* Right: LC circuit */}
      <g>
        <text x="390" y="25" textAnchor="middle" fontSize={13} fill="#1e293b" fontWeight={700}>Электромагнитная система</text>
        {/* Circuit */}
        <line x1="340" y1="50" x2="340" y2="130" stroke="#334155" strokeWidth={2} />
        <line x1="340" y1="50" x2="370" y2="50" stroke="#334155" strokeWidth={2} />
        <line x1="410" y1="50" x2="440" y2="50" stroke="#334155" strokeWidth={2} />
        <line x1="440" y1="50" x2="440" y2="130" stroke="#334155" strokeWidth={2} />
        <line x1="340" y1="130" x2="440" y2="130" stroke="#334155" strokeWidth={2} />
        {/* Capacitor */}
        <line x1="370" y1="38" x2="370" y2="62" stroke="#334155" strokeWidth={2.5} />
        <line x1="410" y1="38" x2="410" y2="62" stroke="#334155" strokeWidth={2.5} />
        <text x="390" y="32" textAnchor="middle" fontSize={12} fill="#1e293b" fontWeight={700}>C</text>
        {/* Inductor */}
        <path d="M 340 130 Q 350 115 360 130 Q 370 115 380 130 Q 390 115 400 130 Q 410 115 420 130 Q 430 115 440 130" fill="none" stroke="#334155" strokeWidth={2} />
        <text x="390" y="150" textAnchor="middle" fontSize={12} fill="#1e293b" fontWeight={700}>L</text>
      </g>

      {/* Analogy table lines */}
      <line x1="20" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth={1} />
      <text x="120" y="190" textAnchor="middle" fontSize={11} fill="#475569">m ⟺ L</text>
      <text x="390" y="190" textAnchor="middle" fontSize={11} fill="#475569">k ⟺ 1/C</text>
      <text x="250" y="210" textAnchor="middle" fontSize={11} fill="#475569">x ⟺ q</text>
      <text x="250" y="230" textAnchor="middle" fontSize={11} fill="#475569">v ⟺ i</text>
      <text x="250" y="250" textAnchor="middle" fontSize={11} fill="#475569">F ⟺ U</text>
    </svg>
  );
};

// 5. EM oscillation: q(t) and i(t)
export const EMOscillationGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 4 * Math.PI;
  const yMax = 3;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const points = (fn: (t: number) => number, color: string, label: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * xMax;
      pts.push(`${xScale(t).toFixed(1)},${yScale(fn(t)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />
        <text x={xScale(xMax) - 8} y={yScale(fn(xMax - 0.3)) - 8} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 4; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -3; i <= 3; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v * Math.PI)} y1={originY - 3} x2={xScale(v * Math.PI)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v * Math.PI)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}π`}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}q` : `${v}q`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>t, с</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>q, i</text>

      {points((t) => 2 * Math.cos(t), '#2563eb', 'q(t)')}
      {points((t) => -2 * Math.sin(t), '#dc2626', 'i(t)')}
    </svg>
  );
};

// 6. AC voltage and current (in phase, resistive load)
export const ACResistiveGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 4 * Math.PI;
  const yMax = 3;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const points = (fn: (t: number) => number, color: string, label: string, dash?: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * xMax;
      pts.push(`${xScale(t).toFixed(1)},${yScale(fn(t)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} strokeDasharray={dash} />
        <text x={xScale(xMax) - 8} y={yScale(fn(xMax - 0.3)) - 8} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 4; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -3; i <= 3; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v * Math.PI)} y1={originY - 3} x2={xScale(v * Math.PI)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v * Math.PI)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}π`}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}U` : `${v}U`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>ωt, рад</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>U, I</text>

      {points((t) => 2 * Math.sin(t), '#2563eb', 'U(t)')}
      {points((t) => 2 * Math.sin(t), '#dc2626', 'I(t)')}
    </svg>
  );
};

// 7. AC with capacitive load (current leads voltage by π/2)
export const ACCapacitiveGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 4 * Math.PI;
  const yMax = 3;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const points = (fn: (t: number) => number, color: string, label: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * xMax;
      pts.push(`${xScale(t).toFixed(1)},${yScale(fn(t)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />
        <text x={xScale(xMax) - 8} y={yScale(fn(xMax - 0.3)) - 8} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 4; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -3; i <= 3; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v * Math.PI)} y1={originY - 3} x2={xScale(v * Math.PI)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v * Math.PI)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}π`}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}U` : `${v}U`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>ωt, рад</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>U, I</text>

      {points((t) => 2 * Math.sin(t), '#2563eb', 'U(t)')}
      {points((t) => 2 * Math.sin(t + Math.PI / 2), '#dc2626', 'I(t)')}
      {/* Phase shift annotation */}
      <line x1={xScale(0)} y1={yScale(2)} x2={xScale(Math.PI / 2)} y2={yScale(2)} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={xScale(Math.PI / 4)} y={yScale(2) - 8} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>π/2</text>
    </svg>
  );
};

// 8. AC with inductive load (current lags voltage by π/2)
export const ACInductiveGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 4 * Math.PI;
  const yMax = 3;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const points = (fn: (t: number) => number, color: string, label: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * xMax;
      pts.push(`${xScale(t).toFixed(1)},${yScale(fn(t)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />
        <text x={xScale(xMax) - 8} y={yScale(fn(xMax - 0.3)) - 8} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 4; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -3; i <= 3; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v * Math.PI)} y1={originY - 3} x2={xScale(v * Math.PI)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v * Math.PI)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}π`}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}U` : `${v}U`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>ωt, рад</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>U, I</text>

      {points((t) => 2 * Math.sin(t), '#2563eb', 'U(t)')}
      {points((t) => 2 * Math.sin(t - Math.PI / 2), '#dc2626', 'I(t)')}
      <line x1={xScale(0)} y1={yScale(2)} x2={xScale(Math.PI / 2)} y2={yScale(2)} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={xScale(Math.PI / 4)} y={yScale(2) - 8} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>π/2</text>
    </svg>
  );
};

// 9. RLC series circuit diagram
export const RLCCircuitDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-auto" style={{ maxWidth: '100%' }}>
      {/* AC source */}
      <circle cx="60" cy="100" r="25" fill="none" stroke="#334155" strokeWidth={2} />
      <path d="M 45 100 Q 52 90 55 100 Q 58 110 65 100" fill="none" stroke="#334155" strokeWidth={1.5} />
      <text x="60" y="145" textAnchor="middle" fontSize={12} fill="#1e293b" fontWeight={700}>~ U</text>

      {/* Wires */}
      <line x1="60" y1="75" x2="60" y2="40" stroke="#334155" strokeWidth={2} />
      <line x1="60" y1="40" x2="120" y2="40" stroke="#334155" strokeWidth={2} />
      <line x1="180" y1="40" x2="240" y2="40" stroke="#334155" strokeWidth={2} />
      <line x1="300" y1="40" x2="360" y2="40" stroke="#334155" strokeWidth={2} />
      <line x1="420" y1="40" x2="440" y2="40" stroke="#334155" strokeWidth={2} />
      <line x1="440" y1="40" x2="440" y2="100" stroke="#334155" strokeWidth={2} />
      <line x1="440" y1="100" x2="440" y2="160" stroke="#334155" strokeWidth={2} />
      <line x1="60" y1="125" x2="60" y2="160" stroke="#334155" strokeWidth={2} />
      <line x1="60" y1="160" x2="440" y2="160" stroke="#334155" strokeWidth={2} />

      {/* Resistor R */}
      <path d="M 120 40 L 130 30 L 145 50 L 160 30 L 170 40 L 180 40" fill="none" stroke="#dc2626" strokeWidth={2.5} />
      <text x="150" y="22" textAnchor="middle" fontSize={12} fill="#dc2626" fontWeight={700}>R</text>

      {/* Inductor L */}
      <path d="M 240 40 Q 250 25 260 40 Q 270 25 280 40 Q 290 25 300 40" fill="none" stroke="#2563eb" strokeWidth={2.5} />
      <text x="270" y="22" textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={700}>L</text>

      {/* Capacitor C */}
      <line x1="360" y1="30" x2="360" y2="50" stroke="#16a34a" strokeWidth={2.5} />
      <line x1="370" y1="30" x2="370" y2="50" stroke="#16a34a" strokeWidth={2.5} />
      <line x1="350" y1="40" x2="360" y2="40" stroke="#334155" strokeWidth={2} />
      <line x1="370" y1="40" x2="380" y2="40" stroke="#334155" strokeWidth={2} />
      <line x1="380" y1="40" x2="420" y2="40" stroke="#334155" strokeWidth={2} />
      <text x="365" y="22" textAnchor="middle" fontSize={12} fill="#16a34a" fontWeight={700}>C</text>

      {/* Current arrow */}
      <text x="100" y="30" textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}>i(t)</text>
    </svg>
  );
};

// 10. Vector diagram for RLC series circuit
export const VectorDiagramRLC: React.FC = () => {
  return (
    <svg viewBox="0 0 360 320" className="w-full h-auto" style={{ maxWidth: '100%' }}>
      {/* Grid */}
      <g>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`gv${i}`} x1={i * 30} y1={0} x2={i * 30} y2={320} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`gh${i}`} x1={0} y1={i * 30} x2={360} y2={i * 30} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>

      {/* Axes */}
      <line x1="0" y1="160" x2="360" y2="160" stroke="#94a3b8" strokeWidth={1} />
      <line x1="180" y1="0" x2="180" y2="320" stroke="#94a3b8" strokeWidth={1} />

      {/* U_R vector (along positive X) */}
      <line x1="180" y1="160" x2="280" y2="160" stroke="#dc2626" strokeWidth={2.5} />
      <polygon points="280,160 272,156 272,164" fill="#dc2626" />
      <text x="225" y="150" textAnchor="middle" fontSize={12} fill="#dc2626" fontWeight={700}>U_R</text>

      {/* U_L vector (up) */}
      <line x1="280" y1="160" x2="280" y2="80" stroke="#2563eb" strokeWidth={2.5} />
      <polygon points="280,80 276,88 284,88" fill="#2563eb" />
      <text x="295" y="120" fontSize={12} fill="#2563eb" fontWeight={700}>U_L</text>

      {/* U_C vector (down) */}
      <line x1="280" y1="160" x2="280" y2="240" stroke="#16a34a" strokeWidth={2.5} />
      <polygon points="280,240 276,232 284,232" fill="#16a34a" />
      <text x="295" y="210" fontSize={12} fill="#16a34a" fontWeight={700}>U_C</text>

      {/* U_total vector (resultant) */}
      <line x1="180" y1="160" x2="280" y2="100" stroke="#1e293b" strokeWidth={2.5} strokeDasharray="5 3" />
      <polygon points="280,100 272,102 274,110" fill="#1e293b" />
      <text x="215" y="120" fontSize={12} fill="#1e293b" fontWeight={700}>U</text>

      {/* Angle φ */}
      <path d="M 210 160 A 30 30 0 0 0 206 148" fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      <text x="200" y="145" textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}>φ</text>

      {/* I vector (reference, along X) */}
      <text x="190" y="175" fontSize={11} fill="#475569" fontWeight={600}>I</text>
    </svg>
  );
};

// 11. Pendulum diagram for athlete motion
export const PendulumDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" style={{ maxWidth: '320px' }}>
      {/* Support */}
      <line x1="120" y1="30" x2="240" y2="30" stroke="#334155" strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={130 + i * 14} y1={30} x2={136 + i * 14} y2={22} stroke="#334155" strokeWidth={1.5} />
      ))}

      {/* Pivot */}
      <circle cx="180" cy="30" r="4" fill="#334155" />

      {/* Equilibrium (dashed) */}
      <line x1="180" y1="30" x2="180" y2="200" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />

      {/* String */}
      <line x1="180" y1="30" x2="120" y2="150" stroke="#475569" strokeWidth={1.5} />
      {/* Displaced string */}
      <line x1="180" y1="30" x2="120" y2="150" stroke="#2563eb" strokeWidth={2} />

      {/* Bob (athlete) */}
      <circle cx="120" cy="150" r="18" fill="#2563eb" />
      <text x="120" y="155" textAnchor="middle" fontSize={11} fill="white" fontWeight={700}>m</text>

      {/* Angle arc */}
      <path d="M 180 60 A 30 30 0 0 0 162 70" fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      <text x="165" y="58" textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}>φ₀</text>

      {/* Amplitude markers */}
      <line x1="120" y1="180" x2="240" y2="180" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 2" />
      <line x1="120" y1="175" x2="120" y2="185" stroke="#334155" strokeWidth={1} />
      <line x1="240" y1="175" x2="240" y2="185" stroke="#334155" strokeWidth={1} />
      <text x="180" y="200" textAnchor="middle" fontSize={11} fill="#475569">2A</text>

      {/* x axis */}
      <line x1="80" y1="180" x2="280" y2="180" stroke="#334155" strokeWidth={1.5} />
      <polygon points="280,180 274,176 274,184" fill="#334155" />
      <text x="285" y="184" fontSize={11} fill="#1e293b" fontWeight={600}>x</text>

      {/* Labels */}
      <text x="60" y="155" textAnchor="middle" fontSize={11} fill="#475569">l</text>
    </svg>
  );
};

// 12. Spring oscillator diagram
export const SpringDiagram: React.FC = () => {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto" style={{ maxWidth: '100%' }}>
      {/* Wall */}
      <line x1="30" y1="40" x2="30" y2="160" stroke="#334155" strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={20} y1={45 + i * 10} x2={30} y2={55 + i * 10} stroke="#334155" strokeWidth={1.5} />
      ))}

      {/* Spring */}
      <path d="M 30 100 L 50 100 L 55 85 L 65 115 L 75 85 L 85 115 L 95 85 L 105 115 L 115 85 L 125 115 L 135 85 L 145 115 L 150 100 L 180 100" fill="none" stroke="#2563eb" strokeWidth={2} />

      {/* Mass */}
      <rect x="180" y="75" width="60" height="50" rx={4} fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
      <text x="210" y="105" textAnchor="middle" fontSize={14} fill="#1e293b" fontWeight={700}>m</text>

      {/* Equilibrium position */}
      <line x1="210" y1="135" x2="210" y2="165" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <text x="210" y="180" textAnchor="middle" fontSize={10} fill="#94a3b8">x = 0</text>

      {/* Displaced position */}
      <rect x="250" y="75" width="60" height="50" rx={4} fill="none" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="4 3" />
      <line x1="310" y1="135" x2="310" y2="165" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" />
      <text x="310" y="180" textAnchor="middle" fontSize={10} fill="#f59e0b">x = A</text>

      {/* Arrow */}
      <line x1="245" y1="100" x2="295" y2="100" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
      <polygon points="295,100 289,96 289,104" fill="#f59e0b" />

      {/* Floor */}
      <line x1="20" y1="165" x2="360" y2="165" stroke="#334155" strokeWidth={1.5} />

      {/* Labels */}
      <text x="100" y="75" textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={600}>k</text>
    </svg>
  );
};

// 13. Voltage triangle for AC circuit
export const VoltageTriangle: React.FC = () => {
  return (
    <svg viewBox="0 0 320 260" className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <g>
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`gv${i}`} x1={i * 30} y1={0} x2={i * 30} y2={260} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`gh${i}`} x1={0} y1={i * 30} x2={320} y2={i * 30} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>

      {/* Triangle */}
      <line x1="40" y1="200" x2="240" y2="200" stroke="#dc2626" strokeWidth={2.5} />
      <polygon points="240,200 232,196 232,204" fill="#dc2626" />
      <text x="140" y="225" textAnchor="middle" fontSize={13} fill="#dc2626" fontWeight={700}>U_R</text>

      <line x1="240" y1="200" x2="240" y2="80" stroke="#2563eb" strokeWidth={2.5} />
      <polygon points="240,80 236,88 244,88" fill="#2563eb" />
      <text x="265" y="145" fontSize={13} fill="#2563eb" fontWeight={700}>U_L − U_C</text>

      <line x1="40" y1="200" x2="240" y2="80" stroke="#1e293b" strokeWidth={2.5} />
      <polygon points="240,80 231,84 234,92" fill="#1e293b" />
      <text x="110" y="130" fontSize={13} fill="#1e293b" fontWeight={700}>U</text>

      {/* Angle */}
      <path d="M 70 200 A 30 30 0 0 0 67 187" fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      <text x="60" y="180" textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}>φ</text>
    </svg>
  );
};

// 14. Free vs forced oscillations comparison graph
export const FreeVsForcedGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 8;
  const yMax = 3;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const points = (fn: (t: number) => number, color: string, label: string, dash?: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 300; i++) {
      const t = (i / 300) * xMax;
      pts.push(`${xScale(t).toFixed(1)},${yScale(fn(t)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} strokeDasharray={dash} />
        <text x={xScale(xMax * 0.85)} y={yScale(fn(xMax * 0.85)) - 10} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 8; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -3; i <= 3; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v)} y1={originY - 3} x2={xScale(v)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}` : `${v}`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>t, с</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>x, усл. ед.</text>

      {/* Free oscillation (damped) */}
      {points((t) => 2 * Math.exp(-0.3 * t) * Math.cos(2 * t), '#2563eb', 'Свободные (затух.)')}
      {/* Forced oscillation (steady state) */}
      {points((t) => 1.5 * Math.sin(2 * t + 1), '#dc2626', 'Вынужденные')}
    </svg>
  );
};

// 15. Resonance curve
export const ResonanceCurve: React.FC = () => {
  const width = 480, height = 320;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 5;
  const yMax = 4;
  const originX = padL;
  const originY = padT + plotH;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * plotH;

  const points = (fn: (v: number) => number, color: string, label: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const w = (i / 200) * xMax;
      pts.push(`${xScale(w).toFixed(1)},${yScale(fn(w)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />
        <text x={xScale(4.2)} y={yScale(fn(4.2)) - 10} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 5; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = 0; i <= 4; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v)} y1={originY - 3} x2={xScale(v)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v}</text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v}</text>
        </g>
      ))}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>ω, рад/с</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>A, усл. ед.</text>

      {/* Resonance curves with different damping */}
      {points((w) => 3.8 / Math.sqrt(Math.pow(w * w - 4, 2) + 0.04), '#dc2626', 'β — малое')}
      {points((w) => 2.5 / Math.sqrt(Math.pow(w * w - 4, 2) + 0.5), '#2563eb', 'β — среднее')}
      {points((w) => 1.5 / Math.sqrt(Math.pow(w * w - 4, 2) + 2), '#16a34a', 'β — большое')}

      {/* Resonance frequency marker */}
      <line x1={xScale(2)} y1={padT} x2={xScale(2)} y2={originY} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 2" />
      <text x={xScale(2)} y={padT + 10} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>ω₀</text>
    </svg>
  );
};

// 16. Athlete running stride oscillation model
export const StrideOscillationGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 6;
  const yMax = 2;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const points = (fn: (t: number) => number, color: string, label: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * xMax;
      pts.push(`${xScale(t).toFixed(1)},${yScale(fn(t)).toFixed(1)}`);
    }
    return (
      <g>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />
        <text x={xScale(xMax * 0.85)} y={yScale(fn(xMax * 0.85)) - 10} fontSize={10} fill={color} fontWeight={700}>{label}</text>
      </g>
    );
  };

  const xTicks: number[] = [];
  for (let i = 0; i <= 6; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -2; i <= 2; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v)} y1={originY - 3} x2={xScale(v)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 6} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}A` : `${v}A`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>t, с</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>x, см</text>

      {points((t) => 1.5 * Math.cos(2 * Math.PI * t), '#2563eb', 'x(t) — ЦТ бегуна')}
    </svg>
  );
};

// 17. AC sinusoidal voltage graph
export const ACVoltageGraph: React.FC = () => {
  const width = 560, height = 340;
  const padL = 50, padB = 40, padT = 15, padR = 15;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xMax = 4 * Math.PI;
  const yMax = 3;
  const originX = padL;
  const originY = padT + plotH / 2;
  const xScale = (v: number) => originX + (v / xMax) * plotW;
  const yScale = (v: number) => originY - (v / yMax) * (plotH / 2);

  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * xMax;
    pts.push(`${xScale(t).toFixed(1)},${yScale(2 * Math.sin(t)).toFixed(1)}`);
  }

  const xTicks: number[] = [];
  for (let i = 0; i <= 4; i++) xTicks.push(i);
  const yTicks: number[] = [];
  for (let i = -3; i <= 3; i++) yTicks.push(i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      <g>
        {Array.from({ length: Math.floor(plotW / 25) + 1 }, (_, i) => (
          <line key={`gv${i}`} x1={padL + i * 25} y1={padT} x2={padL + i * 25} y2={padT + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(plotH / 25) + 1 }, (_, i) => (
          <line key={`gh${i}`} x1={padL} y1={padT + i * 25} x2={padL + plotW} y2={padT + i * 25} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>
      <line x1={padL} y1={originY} x2={padL + plotW} y2={originY} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1.5} />
      <polygon points={`${padL + plotW},${originY} ${padL + plotW - 6},${originY - 4} ${padL + plotW - 6},${originY + 4}`} fill="#334155" />
      <polygon points={`${padL},${padT} ${padL - 4},${padT + 6} ${padL + 4},${padT + 6}`} fill="#334155" />

      {xTicks.map((v) => (
        <g key={`xt${v}`}>
          <line x1={xScale(v * Math.PI)} y1={originY - 3} x2={xScale(v * Math.PI)} y2={originY + 3} stroke="#334155" strokeWidth={1} />
          <text x={xScale(v * Math.PI)} y={originY + 16} textAnchor="middle" fontSize={9} fill="#475569">{v === 0 ? '0' : `${v}π`}</text>
        </g>
      ))}
      {yTicks.map((v) => v !== 0 ? (
        <g key={`yt${v}`}>
          <line x1={padL - 3} y1={yScale(v)} x2={padL + 3} y2={yScale(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yScale(v) + 3} textAnchor="end" fontSize={9} fill="#475569">{v > 0 ? `${v}U_m` : `−${Math.abs(v)}U_m`}</text>
        </g>
      ) : null)}

      <text x={padL + plotW + 5} y={originY + 4} fontSize={11} fill="#1e293b" fontWeight={600}>ωt, рад</text>
      <text x={padL} y={padT - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>U, В</text>

      <polyline points={pts.join(' ')} fill="none" stroke="#2563eb" strokeWidth={2} />
      <text x={xScale(xMax) - 8} y={yScale(2 * Math.sin(xMax - 0.3)) - 8} fontSize={10} fill="#2563eb" fontWeight={700}>U(t)</text>

      {/* RMS line */}
      <line x1={padL} y1={yScale(Math.sqrt(2))} x2={padL + plotW} y2={yScale(Math.sqrt(2))} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="6 3" />
      <text x={padL + 10} y={yScale(Math.sqrt(2)) - 6} fontSize={10} fill="#dc2626" fontWeight={600}>U_д = U_m/√2</text>
      <line x1={padL} y1={yScale(-Math.sqrt(2))} x2={padL + plotW} y2={yScale(-Math.sqrt(2))} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="6 3" />
    </svg>
  );
};

// 18. Impedance triangle
export const ImpedanceTriangle: React.FC = () => {
  return (
    <svg viewBox="0 0 320 260" className="w-full h-auto" style={{ maxWidth: '100%' }}>
      <g>
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`gv${i}`} x1={i * 30} y1={0} x2={i * 30} y2={260} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`gh${i}`} x1={0} y1={i * 30} x2={320} y2={i * 30} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
      </g>

      <line x1="40" y1="200" x2="240" y2="200" stroke="#dc2626" strokeWidth={2.5} />
      <polygon points="240,200 232,196 232,204" fill="#dc2626" />
      <text x="140" y="225" textAnchor="middle" fontSize={13} fill="#dc2626" fontWeight={700}>R</text>

      <line x1="240" y1="200" x2="240" y2="80" stroke="#2563eb" strokeWidth={2.5} />
      <polygon points="240,80 236,88 244,88" fill="#2563eb" />
      <text x="265" y="145" fontSize={13} fill="#2563eb" fontWeight={700}>X = X_L − X_C</text>

      <line x1="40" y1="200" x2="240" y2="80" stroke="#1e293b" strokeWidth={2.5} />
      <polygon points="240,80 231,84 234,92" fill="#1e293b" />
      <text x="110" y="130" fontSize={13} fill="#1e293b" fontWeight={700}>Z</text>

      <path d="M 70 200 A 30 30 0 0 0 67 187" fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      <text x="60" y="180" textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}>φ</text>
    </svg>
  );
};

export const GraphRenderer: React.FC<{ svgKey: string }> = ({ svgKey }) => {
  const graphs: Record<string, React.FC> = {
    'harmonic_osc': HarmonicOscillationGraph,
    'energy': EnergyGraph,
    'lc_circuit': LCircuitDiagram,
    'mech_elec_analogy': MechElecAnalogyDiagram,
    'em_osc': EMOscillationGraph,
    'ac_resistive': ACResistiveGraph,
    'ac_capacitive': ACCapacitiveGraph,
    'ac_inductive': ACInductiveGraph,
    'rlc_circuit': RLCCircuitDiagram,
    'vector_rlc': VectorDiagramRLC,
    'pendulum': PendulumDiagram,
    'spring': SpringDiagram,
    'voltage_triangle': VoltageTriangle,
    'free_vs_forced': FreeVsForcedGraph,
    'resonance': ResonanceCurve,
    'stride': StrideOscillationGraph,
    'ac_voltage': ACVoltageGraph,
    'impedance_triangle': ImpedanceTriangle,
  };

  const Graph = graphs[svgKey];
  if (!Graph) return null;
  return <Graph />;
};
