const KEYS = [
  { major: "Dó", minor: "Lá m", angle: -90, sharps: 0, flats: 0 },
  { major: "Sol", minor: "Mi m", angle: -60, sharps: 1, flats: 0 },
  { major: "Ré", minor: "Si m", angle: -30, sharps: 2, flats: 0 },
  { major: "Lá", minor: "Fá# m", angle: 0, sharps: 3, flats: 0 },
  { major: "Mi", minor: "Dó# m", angle: 30, sharps: 4, flats: 0 },
  { major: "Si", minor: "Sol# m", angle: 60, sharps: 5, flats: 0 },
  { major: "Fá#/Solb", minor: "Ré#/Mib m", angle: 90, sharps: 6, flats: 6 },
  { major: "Réb", minor: "Sib m", angle: 120, sharps: 0, flats: 5 },
  { major: "Láb", minor: "Fá m", angle: 150, sharps: 0, flats: 4 },
  { major: "Mib", minor: "Dó m", angle: 180, sharps: 0, flats: 3 },
  { major: "Sib", minor: "Sol m", angle: 210, sharps: 0, flats: 2 },
  { major: "Fá", minor: "Ré m", angle: 240, sharps: 0, flats: 1 },
];

interface CircleOfFifthsProps {
  selectedKey?: string;
  onSelectKey?: (key: string) => void;
}

const CircleOfFifths = ({ selectedKey, onSelectKey }: CircleOfFifthsProps) => {
  const cx = 160;
  const cy = 160;
  const outerR = 130;
  const innerR = 85;

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[320px]">
        {/* Outer ring background */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />

        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="bold">
          CICLO DE
        </text>
        <text x={cx} y={cy + 6} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="bold">
          QUINTAS
        </text>

        {KEYS.map((k, i) => {
          const rad = (k.angle * Math.PI) / 180;
          const majorX = cx + outerR * Math.cos(rad);
          const majorY = cy + outerR * Math.sin(rad);
          const minorX = cx + innerR * Math.cos(rad);
          const minorY = cy + innerR * Math.sin(rad);
          const isSelected = selectedKey === k.major;

          return (
            <g key={i} className="cursor-pointer" onClick={() => onSelectKey?.(k.major)}>
              {/* Major key (outer) */}
              <circle
                cx={majorX}
                cy={majorY}
                r={18}
                fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--card))"}
                stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth="1.5"
              />
              <text
                x={majorX}
                y={majorY + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                fontSize="9"
                fontWeight="bold"
              >
                {k.major}
              </text>

              {/* Minor key (inner) */}
              <circle
                cx={minorX}
                cy={minorY}
                r={14}
                fill="hsl(var(--muted) / 0.3)"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
              <text
                x={minorX}
                y={minorY + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill="hsl(var(--muted-foreground))"
                fontSize="7"
              >
                {k.minor}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CircleOfFifths;
