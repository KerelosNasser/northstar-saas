type SparklineProps = {
  data: number[];
  className?: string;
  stroke?: string;
  fill?: boolean;
};

/**
 * Inline SVG sparkline. Deliberately not Recharts: these are 100x28 decorative
 * trend lines where a full chart instance would cost far more than it returns.
 */
export function Sparkline({ data, className, stroke = "var(--primary)", fill }: SparklineProps) {
  if (data.length < 2) return null;

  const width = 100;
  const height = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / span) * (height - 2) - 1;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {fill ? (
        <polygon points={`0,${height} ${points.join(" ")} ${width},${height}`} fill={stroke} opacity={0.1} />
      ) : null}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
