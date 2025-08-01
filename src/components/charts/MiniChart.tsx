import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniChartProps {
  data: { value: number }[];
  color?: string;
  height?: number;
}

export function MiniChart({ data, color = "#10b981", height = 40 }: MiniChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}