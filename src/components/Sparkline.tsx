interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({ data, width = 60, height = 20, color = "hsl(205, 100%, 55%)" }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const trend = last > prev ? "up" : last < prev ? "down" : "flat";
  const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : color;

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={trendColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      <circle
        cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
        cy={height - padding - ((last - min) / range) * (height - padding * 2)}
        r="2"
        fill={trendColor}
      />
    </svg>
  );
}
