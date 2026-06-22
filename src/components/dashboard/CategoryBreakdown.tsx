import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CategorySummary } from '@/types';
import { formatRupiah } from '@/lib/formatters';

interface CategoryBreakdownProps {
  data: CategorySummary[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {


  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-surface border border-border/80 p-3 rounded-xl shadow-xl select-none">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dataPoint.color }}></div>
            <span className="text-xs font-bold text-text-primary">{dataPoint.category}</span>
          </div>
          <p className="text-sm font-bold text-text-primary tabular-nums">
            {formatRupiah(dataPoint.total)}
          </p>
          <p className="text-[10px] font-semibold text-text-secondary">
            {dataPoint.percentage}% dari total bulan ini
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 select-none w-full min-h-[320px] flex flex-col justify-between">
      <div className="mb-2">
        <h4 className="text-sm font-bold text-text-primary">Breakdown Kategori</h4>
        <span className="text-[11px] text-text-secondary">Distribusi pengeluaran berdasarkan kategori bulan ini</span>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-text-secondary">
          <p className="text-sm font-medium">Belum ada data transaksi di bulan ini.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 mt-2">
          {/* Chart Wrapper */}
          <div className="w-full sm:w-1/2 h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="category"
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Info Side List */}
          <div className="w-full sm:w-1/2 flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
            {data.slice(0, 5).map((item) => (
              <div key={item.category} className="flex items-center justify-between text-xs py-1 border-b border-border/10">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-text-primary font-medium truncate">{item.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-text-primary font-semibold tabular-nums block">{formatRupiah(item.total)}</span>
                  <span className="text-[10px] text-text-secondary">{item.percentage}%</span>
                </div>
              </div>
            ))}
            {data.length > 5 && (
              <p className="text-[10px] text-text-secondary text-center italic mt-1">
                + {data.length - 5} kategori lainnya
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
