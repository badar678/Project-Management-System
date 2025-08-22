import React from 'react';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill,
  BsFillGrid3X3GapFill, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import '../../src/Styles/Sidebar.css';

function Sidebar({ openSidebarToggle, OpenSidebar, role }) {
  // Debug log to verify the role prop
  console.log('Sidebar role:', role);
  const isSimpleSidebar = role === "client" || role === "employee";
  let panelTitle = "CEO Panel";
  if (role === "client") panelTitle = "Client Panel";
  else if (role === "employee") panelTitle = "Emp Panel";
  else if (role === "pm") panelTitle = "PM Panel";
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className={`sidebar-brand ${
           role === "client" ? "client-title" :
           role === "employee" ? "employee-title" :
           role === "pm" ? "pm-title" :
             "ceo-title"
           }`}>
  <BsCart3 className='icon_header' /> {panelTitle}
</div>

        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        {isSimpleSidebar ? (
          <>
            <li className='sidebar-list-item'>
              <Link to={role === "client" ? "/dashboard/client" : "/dashboard/employee"}>
                <BsGrid1X2Fill className='icon' /> Dashboard
              </Link>
            </li>

             {role === "client" && (
              <li className='sidebar-list-item'>
                 <Link to="/dashboard/client/submitted-projects">
                <BsFillGrid3X3GapFill className='icon' /> Submitted Projects
              </Link>
              </li>
              
            )}
            
            {role === "client" && (
              <li className='sidebar-list-item'>
                <Link to="/dashboard/client/reports">
                  <BsMenuButtonWideFill className='icon' /> Reports
                </Link>
              </li>
              
            )}
            
            
            {role === "employee" && (
              <li className='sidebar-list-item'>
                <Link to="/dashboard/employee/reports">
                  <BsMenuButtonWideFill className='icon' /> Reports
                </Link>
              </li>
            )}
            
          </>
        ) : role === "pm" ? (
          <>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/pm">
                <BsGrid1X2Fill className='icon' /> Dashboard
              </Link>
            </li>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/pm/reports">
                <BsMenuButtonWideFill className='icon' /> Reports
              </Link>
            </li>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/pm/create-task">
                <BsFillGearFill className='icon' /> Create Task
              </Link>
            </li>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/pm/view-tasks">
                <BsFillArchiveFill className='icon' /> View Tasks
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/ceo">
                <BsGrid1X2Fill className='icon' /> Dashboard
              </Link>
            </li>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/project-approvals">
                <BsFillArchiveFill className='icon' /> Project Approvals
              </Link>
            </li>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/assign-projects">
                <BsFillGrid3X3GapFill className='icon' /> Assign Projects
              </Link>
            </li>
            <li className='sidebar-list-item'>
              <Link to="/dashboard/ceo/reports">
                <BsMenuButtonWideFill className='icon' /> Reports
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
