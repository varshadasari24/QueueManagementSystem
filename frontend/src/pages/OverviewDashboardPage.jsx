import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, Clock3, Users, CheckCircle2 } from 'lucide-react';

import EmptyState from '../components/EmptyState';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import apiClient from '../services/api';

function OverviewDashboardPage() {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const { data } = await apiClient.get('/queues');
        setQueues(data.queues || []);
      } catch (error) {
        console.error('Unable to load dashboard analytics', error);
      }
    };

    fetchQueues();
  }, []);

  const summaryCards = useMemo(() => {
    const totalQueues = queues.length;
    const waitingTokens = queues.reduce(
      (sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'waiting').length,
      0,
    );
    const servingTokens = queues.reduce(
      (sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'serving').length,
      0,
    );
    const completedTokens = queues.reduce(
      (sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'completed').length,
      0,
    );

    return [
      { label: 'Total queues', value: String(totalQueues), hint: totalQueues > 0 ? 'Active queue groups' : 'Waiting for queue setup', tone: 'default' },
      { label: 'Waiting tokens', value: String(waitingTokens), hint: waitingTokens > 0 ? 'Customers waiting' : 'No customers waiting', tone: 'warning' },
      { label: 'Currently serving', value: String(servingTokens), hint: servingTokens > 0 ? 'Counters in use' : 'No active service', tone: 'accent' },
      { label: 'Completed tokens', value: String(completedTokens), hint: 'Completed service visits', tone: 'success' },
    ];
  }, [queues]);

  const chartData = useMemo(() => {
    if (queues.length === 0) {
      return [];
    }

    return queues.map((queue) => ({
      name: queue.name.length > 12 ? `${queue.name.slice(0, 12)}...` : queue.name,
      value: (queue.tokens || []).length,
    }));
  }, [queues]);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Overview</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">
              Queue operations and live service activity across all active queues.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            <ArrowUpRight className="h-4 w-4" />
            Live queue analytics
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            hint={card.hint}
            tone={card.tone}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Queue performance" subtitle="Queue length trend by queue">
          {chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="queuePerformance" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#queuePerformance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No performance data available"
              description="Create a queue and add tokens to see analytics here."
            />
          )}
        </SectionCard>

        <SectionCard title="Recent queue activity" subtitle="Current queue summary">
          <div className="space-y-3">
            {queues.length > 0 ? (
              queues.slice(0, 4).map((queue) => (
                <div key={queue._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-800">{queue.name}</span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                      {queue.tokens?.length || 0} tokens
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No recent activity"
                description="This feed updates when queues are created and tokens are added."
              />
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Waiting" subtitle="Current queue load">
          <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-amber-700">
            <Clock3 className="h-5 w-5" />
            <span className="font-medium">
              {queues.reduce((sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'waiting').length, 0)} waiting
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Serving" subtitle="Active counters">
          <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 text-indigo-700">
            <Users className="h-5 w-5" />
            <span className="font-medium">
              {queues.reduce((sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'serving').length, 0)} serving
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Completed" subtitle="Finished tokens">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">
              {queues.reduce((sum, queue) => sum + (queue.tokens || []).filter((token) => token.status === 'completed').length, 0)} completed
            </span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default OverviewDashboardPage;
