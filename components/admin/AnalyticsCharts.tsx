'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

// Chart.js default options
const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#6B7280',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      borderColor: '#374151',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: '#E5E7EB'
      },
      ticks: {
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: '#E5E7EB'
      },
      ticks: {
        color: '#6B7280'
      }
    }
  }
};

// Line Chart Component
interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
    }>;
  };
  title?: string;
  height?: number;
  className?: string;
}

export function AdminLineChart({ data, title, height = 300, className = '' }: LineChartProps) {
  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: title ? {
        display: true,
        text: title,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      } : undefined
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div style={{ height }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

// Bar Chart Component
interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }>;
  };
  title?: string;
  height?: number;
  className?: string;
}

export function AdminBarChart({ data, title, height = 300, className = '' }: BarChartProps) {
  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: title ? {
        display: true,
        text: title,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      } : undefined
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div style={{ height }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

// Doughnut Chart Component
interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
    }>;
  };
  title?: string;
  height?: number;
  className?: string;
}

export function AdminDoughnutChart({ data, title, height = 300, className = '' }: DoughnutChartProps) {
  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: title ? {
        display: true,
        text: title,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      } : undefined
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div style={{ height }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

// Radar Chart Component
interface RadarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
    }>;
  };
  title?: string;
  height?: number;
  className?: string;
}

export function AdminRadarChart({ data, title, height = 300, className = '' }: RadarChartProps) {
  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: title ? {
        display: true,
        text: title,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      } : undefined
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div style={{ height }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function AdminMetricCard({ title, value, change, icon, className = '' }: MetricCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                change.type === 'increase' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                from last {change.period}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Grid Component
interface StatsGridProps {
  stats: Array<{
    title: string;
    value: string | number;
    change?: {
      value: number;
      type: 'increase' | 'decrease';
      period: string;
    };
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export function AdminStatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <AdminMetricCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

// Time Series Data Generator
export function generateTimeSeriesData(
  days: number = 30,
  datasets: Array<{
    label: string;
    data: number[];
    color: string;
  }>
) {
  const labels = [];
  for (let i = days - 1; i >= 0; i--) {
    labels.push(format(subDays(new Date(), i), 'MMM dd'));
  }

  return {
    labels,
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.color,
      backgroundColor: dataset.color + '20',
      fill: true,
      tension: 0.4
    }))
  };
}

// Chart Color Schemes
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6'
};

// Predefined color palettes
export const colorPalettes = {
  default: [chartColors.primary, chartColors.secondary, chartColors.success, chartColors.warning, chartColors.danger],
  vibrant: [chartColors.purple, chartColors.pink, chartColors.indigo, chartColors.teal, chartColors.info],
  pastel: ['#A5B4FC', '#FCA5A5', '#86EFAC', '#FCD34D', '#F9A8D4']
};
