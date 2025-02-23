import React from 'react'
import { ExpandableCardDemo } from '../components/DashboardCard'
import Topbar from '../components/topBar';

const Dashboard = () => {
    return (
        <div>

          <div className="p-4">
            <ExpandableCardDemo/>
          </div>
        </div>
      );
}

export default Dashboard
