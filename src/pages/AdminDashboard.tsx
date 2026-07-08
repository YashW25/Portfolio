import { useEffect, useState } from 'react';
import './styles/AdminDashboard.css';

interface AdminStats {
  totalVisitors: number;
  totalLeads: number;
  cookieAcceptance: number;
  conversionRate: number;
}

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/stats`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/leads`)
        ]);
        
        const statsData = await statsRes.json();
        const leadsData = await leadsRes.json();

        if (statsData.success) setStats(statsData.data);
        if (leadsData.success) setLeads(leadsData.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      <section className="admin-kpis">
        <div className="kpi-card">
          <h3>Total Visitors</h3>
          <p className="kpi-value">{stats?.totalVisitors || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Total Leads</h3>
          <p className="kpi-value">{stats?.totalLeads || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Cookie Acceptance</h3>
          <p className="kpi-value">{stats?.cookieAcceptance || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Conversion Rate</h3>
          <p className="kpi-value">{stats?.conversionRate?.toFixed(2) || 0}%</p>
        </div>
      </section>

      <section className="admin-recent-leads">
        <h2>Recent Leads</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email || '-'}</td>
                  <td>{lead.phone || '-'}</td>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>No leads yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
