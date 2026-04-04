import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { LanguageStats } from "@/types/github";

interface LanguageChartProps {
  stats: LanguageStats;
}

const COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#fb923c", "#a3e635"];

export const LanguageChart = ({ stats }: LanguageChartProps) => {
  const data = Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }));

  return (
    <Card className="p-6 gradient-card border-border shadow-card">
      <h3 className="text-xl font-semibold text-foreground mb-6">Language Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(217 33% 17%)",
              border: "1px solid hsl(217 33% 22%)",
              borderRadius: "0.75rem",
              color: "hsl(210 40% 98%)",
            }}
          />
          <Legend
            wrapperStyle={{
              color: "hsl(215 20% 65%)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};