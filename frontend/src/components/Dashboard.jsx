import React from 'react';
import Navbar from './Navbar';
import SalesGraph from './SalesGraph';
import Notifications from './Notifications';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-grid">
         {/* Sales Graph  */}
        <div className="dashboard-card dashboard-graph">
          <SalesGraph />
        </div>

        {/* Right Section: Notifications + Billing */}
        <div className="dashboard-right">
          <div className="dashboard-card">
            <Notifications />
          </div>

          <div className="dashboard-card dashboard-billing">
            <button
              onClick={() => navigate('/billing')}
              className="billing-button"
            >
              Go to Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
