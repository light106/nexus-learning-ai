import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { RoadmapItem, Category } from '../types';

interface RoadmapStatsProps {
  items: RoadmapItem[];
  totalHours: number;
}

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#0d9488', '#d97706']; // Darker, more vibrant colors for light theme

const RoadmapStats: React.FC<RoadmapStatsProps> = ({ items, totalHours }) => {
  // Aggregate data for charts
  const categoryDataMap = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.estimatedHours;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryDataMap).map(([name, value]) => ({
    name,
    value,
  }));

  const monthDataMap = items.reduce((acc, item) => {
    const month = new Date(item.startDate).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + item.estimatedHours;
    return acc;
  }, {} as Record<string, number>);

  // Sort months chronologically if possible, or just standard order
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthData = monthOrder.map(m => ({
    name: m,
    hours: monthDataMap[m] || 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Overview Card */}
      <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Focus Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f172a' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {categoryData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-slate-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Intensity Card */}
      <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Study Load (Hours/Month)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-slate-500">Total Year Load:</span>
            <span className="text-slate-900 font-mono font-bold">{totalHours} Hours</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapStats;