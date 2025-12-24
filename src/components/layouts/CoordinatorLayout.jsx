// src/components/layouts/CoordinatorLayout.jsx
import React from 'react';
import CoordinatorSidebar from '../Sidebar/CoordinatorSidebar.jsx';
import TopBar from '../common/TopBar.jsx';

const CoordinatorLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <CoordinatorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CoordinatorLayout;