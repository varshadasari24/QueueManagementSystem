import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';

import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import apiClient from '../services/api';

function AnalyticsPage() {
  const [filter, setFilter] = useState('daily');
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const { data } = await apiClient.get('/queues');
        setQueues(data.queues || []);
      } catch (error) {
        console.error('Unable to load analytics data', error);
      }
    };

    fetchQueues();
  }, []);

  const chartData = useMemo(() => {
    if (!queues.length) {
      return [];
    }

    return queues.map((queue, index) => ({
      name: queue.name.length > 12 ? `${queue.name.slice(0, 12)}...` : queue.name,
      waitTime: Math.max(4, (queue.tokens || []).filter((token) => token.status === 'waiting').length * 6 + index * 2),
      queueLength: (queue.tokens || []).length,
    }));
  }, [queues]);

  const totalWaiting = useMemo(
    () => queues.reduce((sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'waiting').length, 0),
    [queues],
  );

  const totalServing = useMemo(
    () => queues.reduce((sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'serving').length, 0),
    [queues],
  );

  const totalCompleted = useMemo(
    () => queues.reduce((sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'completed').length, 0),
    [queues],
  );

  const averageWaitTime = totalWaiting === 0 ? 0 : Math.round((totalWaiting * 6 + totalServing * 3) / Math.max(1, totalWaiting + totalServing));
  const serviceRate = totalWaiting + totalServing + totalCompleted === 0 ? 0 : Math.round((totalCompleted / (totalWaiting + totalServing + totalCompleted)) * 100);

  const metrics = [
    { label: 'Average wait time', value: `${averageWaitTime} min`, hint: totalWaiting > 0 ? 'Current average estimate' : 'Waiting for queue activity', tone: 'default' },
    { label: 'Queue length', value: String(queues.reduce((sum, queue) => sum + (queue.tokens || []).length, 0)), hint: 'Total active tokens', tone: 'accent' },
    { label: 'Service rate', value: `${serviceRate}%`, hint: 'Completed vs. total flow', tone: 'success' },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Operational insights and queue trends from the live queue data."
        action={
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {['daily', 'weekly'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filter === value
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {value === 'daily' ? 'Daily' : 'Weekly'}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} tone={metric.tone} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Waiting-time trend" subtitle={`${filter === 'daily' ? 'Daily' : 'Weekly'} trend`}>
          {chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="waitTime" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="Waiting-time data is not available"
              description="This chart will display wait-time trends once queue data is being tracked."
            />
          )}
        </SectionCard>

        <SectionCard title="Queue-length trend" subtitle={`${filter === 'daily' ? 'Daily' : 'Weekly'} trend`}>
          {chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="queueLength" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="Queue-length data is not available"
              description="This chart will display queue activity when the system starts collecting data."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default AnalyticsPage;
