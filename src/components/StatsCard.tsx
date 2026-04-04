import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
}

export const StatsCard = ({ title, value, icon: Icon, color = "text-primary" }: StatsCardProps) => {
  return (
    <Card className="p-6 gradient-card border-border shadow-card transition-smooth hover:shadow-glow hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className={`h-10 w-10 ${color}`} />
      </div>
    </Card>
  );
};
