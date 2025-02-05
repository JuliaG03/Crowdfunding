import React from "react";
import { Menu } from "../icons/Icons"; 
import logo from "../logo.svg"; 
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed, account, balance }) => {
  const location = useLocation(); // Get current location

  // Function to check if the current link is active
  const isActive = (path) => location.pathname === path;
  return (
    <aside
      className={`bg-dark text-card flex flex-col transition-all duration-300 fixed top-0 left-0 h-screen ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo and Toggle Button */}
      <div className="p-4 flex items-center justify-between bg-button">
        <div className={`${isCollapsed ? "hidden" : "block"} text-2xl font-bold`}>
          Crowdfunding
        </div>
        <button
          className="text-card focus:outline-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu />
        </button>
      </div>

       {/* Navigation Links */}
       <nav className="flex-1 p-4 space-y-4">
        <Link
          to="/"
          className={`block py-2 px-3 rounded-lg flex items-center space-x-3 ${isActive("/") ? "bg-accentcolor" : "hover:bg-gray-700"}`}
        >
          <span>🏠</span>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link
          to="/contribution"
          className={`block py-2 px-3 rounded-lg flex items-center space-x-3 ${isActive("/contribution") ? "bg-accentcolor" : "hover:bg-gray-700"}`}
        >
          <span>💰</span>
          {!isCollapsed && <span>My Contribution</span>}
        </Link>
        <Link
          to="/fundraising"
          className={`block py-2 px-3 rounded-lg flex items-center space-x-3 ${isActive("/fundraising") ? "bg-accentcolor" : "hover:bg-gray-700"}`}
        >
          <span>📊</span>
          {!isCollapsed && <span>My Fundraising</span>}
        </Link>
      </nav>

      {/* Wallet Info */}
      {account && (
        <div className="p-4 mt-auto bg-gray-700 rounded-b-lg">
          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full border border-gray-500"
              src={logo}
              alt="Profile"
            />
            {!isCollapsed && (
              <div className="text-sm">
                <p className="truncate max-w-[140px]">{account}</p>
                <p className="text-accent font-semibold">{balance} ETH</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
