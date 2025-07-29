'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface MigrationMetrics {
  totalMigrations: number;
  completedMigrations: number;
  inProgressMigrations: number;
  averageCompletionTime: number;
  successRate: number;
  costSavings: number;
  timeSaved: number;
}

interface MigrationTrend {
  date: string;
  started: number;
  completed: number;
  failed: number;
}

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<MigrationMetrics>({
    totalMigrations: 0,
    completedMigrations: 0,
    inProgressMigrations: 0,
    averageCompletionTime: 0,
    successRate: 0,
    costSavings: 0,
    timeSaved: 0
  });
  const [trends, setTrends] = useState<MigrationTrend[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  // const { currentMigration } = useAppStore();

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch(`/api/analytics?timeframe=${selectedTimeframe}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setTrends(data.trends);
      } else {
        // Use mock data for demo
        setMockData();
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setMetrics({
      totalMigrations: 24,
      completedMigrations: 18,
      inProgressMigrations: 4,
      averageCompletionTime: 12.5,
      successRate: 94.7,
      costSavings: 2840,
      timeSaved: 156
    });

    setTrends([
      { date: '2024-01', started: 3, completed: 2, failed: 0 },
      { date: '2024-02', started: 5, completed: 4, failed: 1 },
      { date: '2024-03', started: 7, completed: 6, failed: 0 },
      { date: '2024-04', started: 4, completed: 3, failed: 0 },
      { date: '2024-05', started: 5, completed: 3, failed: 1 }
    ]);
  };

  const getMetricCard = (title: string, value: string | number, icon: React.ComponentType<{ className?: string }>, trend?: number, color: string = 'blue') => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center mt-2">
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend)}% from last month
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </div>
    );
  };

  const getProgressRing = (percentage: number, size: number = 120) => {
    const radius = (size - 20) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-600 transition-all duration-300"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Migration Analytics</h1>
          <p className="text-gray-600">Track your migration performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getMetricCard('Total Migrations', metrics.totalMigrations, FileText, 12, 'blue')}
        {getMetricCard('Success Rate', `${metrics.successRate}%`, CheckCircle, 5, 'green')}
        {getMetricCard('Cost Savings', `$${metrics.costSavings.toLocaleString()}`, DollarSign, 8, 'purple')}
        {getMetricCard('Time Saved', `${metrics.timeSaved} hours`, Clock, 15, 'orange')}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Migration Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Progress</h3>
          <div className="flex items-center justify-center">
            {getProgressRing(metrics.successRate)}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{metrics.completedMigrations}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{metrics.inProgressMigrations}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {metrics.totalMigrations - metrics.completedMigrations - metrics.inProgressMigrations}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Migration Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Trends</h3>
          <div className="space-y-4">
            {trends.slice(-5).map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{trend.date}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{trend.started} started</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{trend.completed} completed</span>
                  </div>
                  {trend.failed > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{trend.failed} failed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cost Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Migration Cost</span>
              <span className="font-semibold">$2,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cost Savings per Migration</span>
              <span className="font-semibold text-green-600">$1,180</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ROI</span>
              <span className="font-semibold text-green-600">48%</span>
            </div>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Migration Time</span>
              <span className="font-semibold">{metrics.averageCompletionTime} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Saved per Migration</span>
              <span className="font-semibold text-green-600">6.5 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Efficiency Gain</span>
              <span className="font-semibold text-green-600">34%</span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-semibold">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medium Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm font-semibold">20%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <span className="text-sm font-semibold">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Review Failed Migrations</p>
              <p className="text-sm text-blue-700">2 migrations need attention</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Optimize Process</p>
              <p className="text-sm text-blue-700">Reduce average completion time by 2 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 