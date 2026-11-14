import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import apiClient from '../services/api';

function MyQueuesPage() {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const { data } = await apiClient.get('/queues');
        setQueues(data.queues || []);
      } catch (error) {
        console.error('Unable to load queues', error);
      }
    };

    fetchQueues();
  }, []);

  return (
    <div>
      <PageHeader
        title="My Queues"
        description="Manage all queue groups and their live status."
        action={
          <Link
            to="/dashboard/create-queue"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Create Queue
          </Link>
        }
      />

      <SectionCard title="Queue list" subtitle="Current queue inventory">
        {queues.length > 0 ? (
          <div className="space-y-3">
            {queues.map((queue) => {
              const queueId = queue._id;
              const waitingCount = (queue.tokens || []).filter((token) => token.status === 'waiting').length;

              return (
                <Link
                  key={queueId}
                  to={`/dashboard/queues/${queueId}`}
                  className="block rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{queue.name}</p>
                      <p className="text-sm text-slate-500">
                        {waitingCount} waiting • {(queue.tokens || []).length} total tokens
                      </p>
                    </div>

                    <span className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700">
                      View Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No queues yet"
            description="Create your first queue to begin managing customer flow."
            action={
              <Link
                to="/dashboard/create-queue"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Create Queue
              </Link>
            }
          />
        )}
      </SectionCard>
    </div>
  );
}

export default MyQueuesPage;
