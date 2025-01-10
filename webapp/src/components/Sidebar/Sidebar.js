import React from 'react';
import { SidebarHeader } from './SidebarHeader.js';
import  SearchInput  from '../Search/SearchInput.js';
import '../../styles/components/Sidebar.css';

const Sidebar = ({ 
    location, 
    setLocation, 
    onClickSearchLocation, 
    onClickUsers, 
    onClickShowUsersLocation 
  }) => {
    return (
      <div className="sidebar">
        <SidebarHeader />
        <div className="divider"></div>
        <div className="sidebar__content">
          <SearchInput 
            location={location} 
            setLocation={setLocation} 
            onSearch={onClickSearchLocation} 
          />
          <button className="sidebar__button" onClick={onClickUsers}>
            אישור משתמש חדש
          </button>
          <button className="sidebar__button" onClick={onClickShowUsersLocation}>
            הצג מיקומי משתמשים
          </button>
        </div>
      </div>
    );
  };

export default Sidebar;