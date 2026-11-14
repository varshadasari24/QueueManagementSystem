import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsPage from './pages/AnalyticsPage';
import CreateQueuePage from './pages/CreateQueuePage';
import LoginPage from './pages/LoginPage';
import MyQueuesPage from './pages/MyQueuesPage';
import OverviewDashboardPage from './pages/OverviewDashboardPage';
import QueueDetailsPage from './pages/QueueDetailsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('qms-token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewDashboardPage />} />
          <Route path="my-queues" element={<MyQueuesPage />} />
          <Route path="create-queue" element={<CreateQueuePage />} />
          <Route path="queues/:queueId" element={<QueueDetailsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
