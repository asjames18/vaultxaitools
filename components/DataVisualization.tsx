'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Calendar, Target, Download, Filter, RefreshCw } from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

interface DataVisualizationProps {
  className?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'doughnut' | 'area';
  data: ChartData;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export default function DataVisualization({
  className = '',
  chartType = 'bar',
  data,
  title,
  height = 300,
  showLegend = true,
  showGrid = true,
  animate = true
}: DataVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>(data);

  // Chart colors
  const chartColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#EC4899', // Pink
    '#84CC16', // Lime
    '#6366F1'  // Indigo
  ];

  // Process chart data
  useEffect(() => {
    const processData = () => {
      setIsLoading(true);
      
      // Add colors to datasets if not provided
      const processedData = {
        ...data,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || chartColors[index % chartColors.length],
          borderColor: dataset.borderColor || chartColors[index % chartColors.length],
          borderWidth: dataset.borderWidth || 2
        }))
      };
      
      setChartData(processedData);
      
      setTimeout(() => setIsLoading(false), 500);
    };

    processData();
  }, [data]);

  // Generate mock chart visualization (in real app, use Chart.js or similar)
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const maxValue = Math.max(...chartData.datasets.flatMap(dataset => dataset.data));
    const minValue = Math.min(...chartData.datasets.flatMap(dataset => dataset.data));

    switch (chartType) {
      case 'bar':
        return renderBarChart(maxValue, minValue);
      case 'line':
        return renderLineChart(maxValue, minValue);
      case 'pie':
        return renderPieChart();
      case 'doughnut':
        return renderDoughnutChart();
      case 'area':
        return renderAreaChart(maxValue, minValue);
      default:
        return renderBarChart(maxValue, minValue);
    }
  };

  // Render bar chart
  const renderBarChart = (maxValue: number, minValue: number) => {
    const range = maxValue - minValue;
    const barWidth = 100 / chartData.labels.length;
    
    return (
      <div className="relative h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, minValue].map((value, index) => (
            <div key={index} className="text-right pr-2">
              {value.toLocaleString()}
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          {showGrid && (
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((percent, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-600"
                  style={{ top: `${percent}%` }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Bars */}
          <div className="relative h-full flex items-end justify-between px-4">
            {chartData.labels.map((label, labelIndex) => (
              <div key={labelIndex} className="flex flex-col items-center">
                <div className="flex flex-col items-center space-y-1">
                  {chartData.datasets.map((dataset, datasetIndex) => {
                    const value = dataset.data[labelIndex];
                    const height = range > 0 ? ((value - minValue) / range) * 100 : 0;
                    
                    return (
                      <div
                        key={datasetIndex}
                        className="w-8 rounded-t transition-all duration-500 ease-out"
                        style={{
                          height: `${height}%`,
                          backgroundColor: Array.isArray(dataset.backgroundColor) 
                            ? dataset.backgroundColor[datasetIndex] 
                            : dataset.backgroundColor,
                          minHeight: '4px'
                        }}
                        title={`${dataset.label}: ${value.toLocaleString()}`}
                      ></div>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center transform rotate-45 origin-left">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render line chart
  const renderLineChart = (maxValue: number, minValue: number) => {
    const range = maxValue - minValue;
    const pointWidth = 100 / (chartData.labels.length - 1);
    
    return (
      <div className="relative h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, minValue].map((value, index) => (
            <div key={index} className="text-right pr-2">
              {value.toLocaleString()}
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          {showGrid && (
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((percent, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-600"
                  style={{ top: `${percent}%` }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {chartData.datasets.map((dataset, datasetIndex) => {
              const points = dataset.data.map((value, valueIndex) => {
                const x = valueIndex * pointWidth;
                const y = range > 0 ? 100 - ((value - minValue) / range) * 100 : 50;
                return `${x},${y}`;
              }).join(' ');
              
              return (
                <polyline
                  key={datasetIndex}
                  points={points}
                  fill="none"
                  stroke={Array.isArray(dataset.borderColor) 
                    ? dataset.borderColor[datasetIndex] 
                    : dataset.borderColor}
                  strokeWidth={dataset.borderWidth || 2}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
            
            {/* Data points */}
            {chartData.datasets.map((dataset, datasetIndex) => (
              dataset.data.map((value, valueIndex) => {
                const x = valueIndex * pointWidth;
                const y = range > 0 ? 100 - ((value - minValue) / range) * 100 : 50;
                
                return (
                  <circle
                    key={`${datasetIndex}-${valueIndex}`}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill={Array.isArray(dataset.backgroundColor) 
                      ? dataset.backgroundColor[datasetIndex] 
                      : dataset.backgroundColor}
                    className="transition-all duration-500 ease-out"
                  />
                );
              })
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
            {chartData.labels.map((label, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render pie chart
  const renderPieChart = () => {
    const total = chartData.datasets[0]?.data.reduce((sum, value) => sum + value, 0) || 0;
    let currentAngle = 0;
    
    return (
      <div className="relative h-full flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {chartData.datasets[0]?.data.map((value, index) => {
            const percentage = total > 0 ? value / total : 0;
            const angle = percentage * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const x1 = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180);
            
            const path = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={path}
                fill={Array.isArray(chartData.datasets[0]?.backgroundColor) 
                  ? chartData.datasets[0].backgroundColor[index] 
                  : chartData.datasets[0]?.backgroundColor || chartColors[index]}
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        
        {/* Center label */}
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
      </div>
    );
  };

  // Render doughnut chart
  const renderDoughnutChart = () => {
    const total = chartData.datasets[0]?.data.reduce((sum, value) => sum + value, 0) || 0;
    let currentAngle = 0;
    
    return (
      <div className="relative h-full flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            className="dark:stroke-gray-600"
          />
          
          {/* Data segments */}
          {chartData.datasets[0]?.data.map((value, index) => {
            const percentage = total > 0 ? value / total : 0;
            const angle = percentage * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const x1 = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180);
            
            const path = [
              `M ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={path}
                fill="none"
                stroke={Array.isArray(chartData.datasets[0]?.backgroundColor) 
                  ? chartData.datasets[0].backgroundColor[index] 
                  : chartData.datasets[0]?.backgroundColor || chartColors[index]}
                strokeWidth="8"
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        
        {/* Center label */}
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
      </div>
    );
  };

  // Render area chart
  const renderAreaChart = (maxValue: number, minValue: number) => {
    const range = maxValue - minValue;
    const pointWidth = 100 / (chartData.labels.length - 1);
    
    return (
      <div className="relative h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, minValue].map((value, index) => (
            <div key={index} className="text-right pr-2">
              {value.toLocaleString()}
            </div>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          {showGrid && (
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((percent, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-600"
                  style={{ top: `${percent}%` }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Area charts */}
          <svg className="absolute inset-0 w-full h-full">
            {chartData.datasets.map((dataset, datasetIndex) => {
              const points = dataset.data.map((value, valueIndex) => {
                const x = valueIndex * pointWidth;
                const y = range > 0 ? 100 - ((value - minValue) / range) * 100 : 50;
                return `${x},${y}`;
              });
              
              // Add bottom points for area fill
              const areaPoints = [
                ...points,
                `${points[points.length - 1].split(',')[0]},100`,
                `${points[0].split(',')[0]},100`
              ].join(' ');
              
              return (
                <path
                  key={datasetIndex}
                  d={`M ${areaPoints}`}
                  fill={Array.isArray(dataset.backgroundColor) 
                    ? dataset.backgroundColor[datasetIndex] 
                    : dataset.backgroundColor}
                  fillOpacity="0.3"
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
            
            {/* Lines */}
            {chartData.datasets.map((dataset, datasetIndex) => {
              const points = dataset.data.map((value, valueIndex) => {
                const x = valueIndex * pointWidth;
                const y = range > 0 ? 100 - ((value - minValue) / range) * 100 : 50;
                return `${x},${y}`;
              }).join(' ');
              
              return (
                <polyline
                  key={datasetIndex}
                  points={points}
                  fill="none"
                  stroke={Array.isArray(dataset.borderColor) 
                    ? dataset.borderColor[datasetIndex] 
                    : dataset.borderColor}
                  strokeWidth={dataset.borderWidth || 2}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
            {chartData.labels.map((label, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title || 'Data Visualization'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {chartType} chart
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
            
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <div style={{ height: `${height}px` }} className="relative">
          {renderChart()}
        </div>
        
        {/* Legend */}
        {showLegend && chartData.datasets.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {chartData.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: Array.isArray(dataset.backgroundColor) 
                      ? dataset.backgroundColor[index] 
                      : dataset.backgroundColor
                  }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {dataset.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
