import { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  Mic,
  Clock3,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Activity,
  Timer
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsStat {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: typeof Clock;
}

// Generate mock data for charts
const generateMockChartData = (days: number) => {
  const labels: string[] = [];
  const recordings: number[] = [];
  const duration: number[] = [];
  const cumulativeUsers: number[] = [];
  const cumulativeOrganizations: number[] = [];
  let totalUsers = 50; // Starting base
  let totalOrgs = 5; // Starting base

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('no', { day: 'numeric', month: 'short' }));

    const count = Math.floor(Math.random() * 20) + 5;
    recordings.push(count);
    duration.push(Math.floor(Math.random() * 120) + 30);

    // Add new users and organizations
    const newUsers = Math.floor(Math.random() * 10) + 2;
    const newOrgs = Math.random() < 0.3 ? 1 : 0; // 30% chance of new org
    totalUsers += newUsers;
    totalOrgs += newOrgs;

    cumulativeUsers.push(totalUsers);
    cumulativeOrganizations.push(totalOrgs);
  }

  return { labels, recordings, duration, cumulativeUsers, cumulativeOrganizations };
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [chartData, setChartData] = useState<ReturnType<typeof generateMockChartData> | null>(null);
  const [stats, setStats] = useState<AnalyticsStat[]>([]);

  useEffect(() => {
    const days = timeRange === 'today' ? 1 : timeRange === 'week' ? 7 : 30;
    const data = generateMockChartData(days);

    const totalRecordings = data.recordings.reduce((a, b) => a + b, 0);
    const totalDuration = data.duration.reduce((a, b) => a + b, 0);
    const avgDuration = totalRecordings > 0 ? totalDuration / totalRecordings : 0;

    setStats([
      {
        label: 'Totalt antall opptak',
        value: totalRecordings,
        change: { value: 12.5, trend: 'up' },
        icon: Mic
      },
      {
        label: 'Gjennomsnittlig varighet',
        value: `${Math.floor(avgDuration)}m`,
        icon: Clock3
      },
      {
        label: 'Total opptakstid',
        value: `${Math.floor(totalDuration / 60)}t ${totalDuration % 60}m`,
        icon: Clock
      }
    ]);

    setChartData(data);
    setIsLoading(false);
  }, [timeRange]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {/* Evergreen Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Users */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aktive brukere per nå</p>
                <p className="text-2xl font-semibold">{Math.floor(Math.random() * 50) + 100}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Trial Users */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aktiv prøveperiode</p>
                <p className="text-2xl font-semibold">{Math.floor(Math.random() * 30) + 20}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Timer className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Error Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Feilrate (siste 30 dager)</p>
                <p className="text-2xl font-semibold">{(Math.random() * 2).toFixed(2)}%</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tidsbasert oversikt</h2>

          <div className="flex items-center space-x-2">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  timeRange === range
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {range === 'today' ? 'I dag' :
                  range === 'week' ? 'Denne uken' :
                  'Denne måneden'}
              </button>
            ))}
          </div>
        </div>

        {/* Time-Filtered Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      {stat.change.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={cn(
                        "text-sm ml-1",
                        stat.change.trend === 'up' ? "text-green-600" : "text-red-600"
                      )}>
                        {stat.change.value.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recordings Count */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Antall opptak</h3>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : chartData && (
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: [{
                      label: 'Antall opptak',
                      data: chartData.recordings,
                      borderColor: 'rgb(2, 132, 199)',
                      backgroundColor: 'rgba(2, 132, 199, 0.1)',
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Transcribed Hours */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Timer transkribert</h3>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : chartData && (
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [{
                      label: 'Timer',
                      data: chartData.duration.map(minutes => (minutes / 60).toFixed(1)),
                      backgroundColor: 'rgb(219, 39, 119)',
                      borderRadius: 4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Brukervekst</h3>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : chartData && (
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: [{
                      label: 'Antall brukere',
                      data: chartData.cumulativeUsers,
                      borderColor: 'rgb(124, 58, 237)',
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Organization Growth */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Organisasjonsvekst</h3>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : chartData && (
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: [{
                      label: 'Antall organisasjoner',
                      data: chartData.cumulativeOrganizations,
                      borderColor: 'rgb(16, 185, 129)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
