import { useEffect, useState } from 'react';
import { PencilLine, ShieldCheck, UserRound } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

const defaultProfile = {
  name: 'Operations manager',
  email: 'manager@example.com',
  location: 'Main branch',
};

function SettingsPage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const rawManager = localStorage.getItem('qms-manager');
    const storedProfile = rawManager ? JSON.parse(rawManager) : null;

    if (storedProfile) {
      setProfile({
        name: storedProfile.name || defaultProfile.name,
        email: storedProfile.email || defaultProfile.email,
        location: localStorage.getItem('qms-branch') || defaultProfile.location,
      });
      return;
    }

    const storedSettings = localStorage.getItem('qms-settings');
    if (storedSettings) {
      setProfile({ ...defaultProfile, ...JSON.parse(storedSettings) });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    if (status) {
      setStatus('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem('qms-settings', JSON.stringify(profile));
    localStorage.setItem('qms-branch', profile.location);

    const savedManager = localStorage.getItem('qms-manager');
    if (savedManager) {
      const manager = JSON.parse(savedManager);
      manager.name = profile.name;
      manager.email = profile.email;
      localStorage.setItem('qms-manager', JSON.stringify(manager));
    }

    setStatus('Preferences updated successfully.');
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Adjust your operational profile and account preferences."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <SectionCard title="Manager profile" subtitle="Account overview">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{profile.name}</p>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Role
            </div>
            <p className="mt-2 text-slate-600">Queue operations supervisor</p>
          </div>
        </SectionCard>

        <SectionCard title="Account settings" subtitle="Basic preferences and settings">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="full-name" className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="full-name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                placeholder="Manager name"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="manager@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-700">
                Branch location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={profile.location}
                onChange={handleChange}
                placeholder="Branch or office"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {status ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {status}
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <PencilLine className="h-4 w-4" />
              Update preferences
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

export default SettingsPage;
