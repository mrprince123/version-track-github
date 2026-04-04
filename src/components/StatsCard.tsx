import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "text-primary",
}: StatsCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof value !== "number") return;
    
    const target = value;
    const duration = 1000;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-card rounded-xl p-5 transition-smooth hover:shadow-glow hover:scale-[1.03] gradient-border group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">
            {typeof value === "number"
              ? displayValue.toLocaleString()
              : value}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-smooth">
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
    </div>
  );
};
