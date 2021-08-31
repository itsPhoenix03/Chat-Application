import React from 'react';
import CreateRoomBtnModel from './CreateRoomBtnModel';
import DashboardToggle from './Dashboard/DashboardToggle';

const Sidebar = () => {
  return (
    <div className="h-100 pt-2">
      <div>
        <DashboardToggle />
        <CreateRoomBtnModel />
      </div>
      Bottom
    </div>
  );
};

export default Sidebar;
