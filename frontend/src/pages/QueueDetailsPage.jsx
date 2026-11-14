import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, CircleSlash, Clock3, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import apiClient from '../services/api';

const statusStyles = {
  waiting: 'bg-amber-50 text-amber-700',
  serving: 'bg-indigo-50 text-indigo-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-rose-50 text-rose-700',
};

function QueueDetailsPage() {
  const navigate = useNavigate();
  const { queueId } = useParams();
  const [queue, setQueue] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');

  const fetchQueue = async () => {
    try {
      const { data } = await apiClient.get(`/queues/${queueId}`);
      setQueue(data.queue);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load queue details');
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [queueId]);

  const firstWaitingTokenId = useMemo(() => {
    if (!queue) {
      return null;
    }

    const firstWaiting = (queue.tokens || []).find((token) => token.status === 'waiting');
    return firstWaiting ? firstWaiting._id : null;
  }, [queue]);

  const handleAddToken = async (event) => {
    event.preventDefault();

    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    try {
      await apiClient.post(`/queues/${queueId}/tokens`, { name: customerName.trim() });
      setCustomerName('');
      setError('');
      fetchQueue();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to add token');
    }
  };

  const handleMove = async (tokenId, direction) => {
    try {
      await apiClient.patch(`/queues/${queueId}/tokens/${tokenId}/move`, { direction });
      fetchQueue();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reorder token');
    }
  };

  const handleServe = async (tokenId) => {
    try {
      await apiClient.patch(`/queues/${queueId}/tokens/${tokenId}/serve`);
      fetchQueue();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to serve token');
    }
  };

  const handleCancel = async (tokenId) => {
    try {
      await apiClient.delete(`/queues/${queueId}/tokens/${tokenId}`);
      fetchQueue();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to cancel token');
    }
  };

  const queueName = queue ? queue.name : 'Queue details';
  const tokens = queue?.tokens || [];

  return (
    <div>
      <PageHeader
        title={queueName}
        description="Monitor token movement and assign the next customer to service."
        action={
          <button
            type="button"
            onClick={() => navigate('/dashboard/my-queues')}
            className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
          >
            Back to queues
          </button>
        }
      />

      <SectionCard title="Add customer token" subtitle="Create a new waiting token for this queue">
        <form onSubmit={handleAddToken} className="flex flex-col gap-3 md:flex-row">
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Customer name"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Add token
          </button>
        </form>

        {error ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Queue status" subtitle="Token and service overview" className="mt-6">
        {tokens.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Person</th>
                  <th className="pb-3 pr-4 font-medium">Token</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token._id} className="border-b border-slate-100 align-middle">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-slate-400" />
                        {token.name}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-slate-900">#{token.number}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[token.status]}`}>
                        {token.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleMove(token._id, 'up')}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:border-slate-300"
                          aria-label="Move token up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(token._id, 'down')}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:border-slate-300"
                          aria-label="Move token down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleServe(token._id)}
                          disabled={token._id !== firstWaitingTokenId}
                          className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 p-2 text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Serve token"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(token._id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700"
                          aria-label="Cancel token"
                        >
                          <CircleSlash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No tokens in this queue"
            description="This queue is empty right now. Add a customer to begin creating the waiting list."
          />
        )}
      </SectionCard>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SectionCard title="Queue health" subtitle="Service status">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
            <Clock3 className="h-5 w-5" />
            <span className="font-medium">
              {tokens.filter((token) => token.status === 'waiting').length} customers waiting
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Current status" subtitle="Operational summary">
          <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 text-indigo-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">
              {tokens.filter((token) => token.status === 'serving').length} currently in service
            </span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default QueueDetailsPage;
