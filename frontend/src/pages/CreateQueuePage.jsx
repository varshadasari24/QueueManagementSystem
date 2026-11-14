import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import apiClient from '../services/api';

const initialForm = {
  name: '',
};

function CreateQueuePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) {
      setError('');
    }
    if (statusMessage) {
      setStatusMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setError('Queue name is required.');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Queue name must be at least 2 characters long.');
      return;
    }

    try {
      await apiClient.post('/queues', { name: trimmedName });
      setError('');
      setStatusMessage('Queue created successfully.');
      setForm(initialForm);
      setTimeout(() => navigate('/dashboard/my-queues'), 600);
    } catch (requestError) {
      setStatusMessage('');
      setError(requestError.response?.data?.message || 'Unable to create queue right now.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Queue"
        description="Set up a new queue service and start handling customer flow."
      />

      <SectionCard title="Queue details" subtitle="Enter the basic information for a new queue">
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="queue-name" className="mb-2 block text-sm font-medium text-slate-700">
              Queue name
            </label>
            <input
              id="queue-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Example: Customer Support"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {statusMessage}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              to="/dashboard/my-queues"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Create
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

export default CreateQueuePage;
