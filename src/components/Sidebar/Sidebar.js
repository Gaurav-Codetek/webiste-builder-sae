import React from 'react';
import ElementLibrary from '../ElementLibrary/ElementLibrary';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Elements</h3>
      </div>
      <ElementLibrary />
    </div>
  );
};

export default Sidebar;
