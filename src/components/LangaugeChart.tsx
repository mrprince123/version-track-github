import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { LanguageStats } from "@/types/github";
import { Terminal, Code2 } from "lucide-react";

interface LanguageChartProps {
  stats: LanguageStats;
}

const COLORS = [
  "hsl(263 70% 64%)", // Primary Purple
  "hsl(217 91% 60%)", // Primary Blue
  "hsl(160 84% 39%)", // Emerald
  "hsl(45 93% 47%)",  // Amber
  "hsl(0 72% 51%)",   // Rose
  "hsl(280 70% 60%)", // Violet
  "hsl(199 89% 48%)", // Sky
];

export const LanguageChart = ({ stats }: LanguageChartProps) => {
  const data = Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .filter(([, value]) => value > 0)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const topLanguage = data[0]?.name || "N/A";

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border animate-fade-in-up relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-smooth" />
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 h-[280px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-smooth cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { name, value } = payload[0].payload;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return (
                      <div className="glass-strong p-3 rounded-xl border-white/[0.1] shadow-elevated animate-scale-in">
                        <p className="text-sm font-bold text-foreground">{name}</p>
                        <p className="text-xs text-primary font-medium">{percentage}% Proficiency</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-1 group-hover:scale-110 transition-spring">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Top Skill</span>
            <span className="text-lg font-black text-foreground glow-text uppercase">{topLanguage}</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/[0.03]">
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-wider">Expertise Radar</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {data.map((item, index) => (
              <div 
                key={item.name} 
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-smooth group/item"
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-sm group-hover/item:scale-125 transition-smooth" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                  <div className="w-full h-1 bg-white/[0.05] rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(item.value / total) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};