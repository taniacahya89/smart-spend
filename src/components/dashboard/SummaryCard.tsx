import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-background/40 transition-all duration-300 select-none flex flex-col justify-between min-h-[140px]">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-2xl font-bold text-text-primary mt-2 mb-1 tracking-tight tabular-nums">
            {value}
          </h3>
        </div>
        
        {/* Icon wrapper */}
        <div className="p-3 bg-background border border-border/80 rounded-xl text-primary shadow-inner shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
        <span className="text-xs text-text-secondary font-medium">
          {subtitle}
        </span>

        {trend && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-success/15 text-success'
                : trend.isNegative
                ? 'bg-danger/15 text-danger'
                : 'bg-text-secondary/10 text-text-secondary'
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
};
