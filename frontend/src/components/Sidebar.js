import React from "react";
import { Menu } from "../icons/Icons"; // Assuming Menu is an icon
import logo from "../logo.svg"; // Assuming this is the logo image
import { Link } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed, account, balance }) => {
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
          to="/dashboard"
          className="block py-2 px-3 rounded-lg bg-gray-700 hover:bg-accentcolor flex items-center space-x-3"
        >
          <span>🏠</span>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link
          to="/contribution"
          className="block py-2 px-3 rounded-lg hover:bg-gray-700 flex items-center space-x-3"
        >
          <span>💰</span>
          {!isCollapsed && <span>My Contribution</span>}
        </Link>
        <Link
          to="/fundraising"
          className="block py-2 px-3 rounded-lg hover:bg-gray-700 flex items-center space-x-3"
        >
          <span>📊</span>
          {!isCollapsed && <span>My Fundraising</span>}
        </Link>
        <Link
          to="/calendar"
          className="block py-2 px-3 rounded-lg hover:bg-gray-700 flex items-center space-x-3"
        >
          <span>📅</span>
          {!isCollapsed && <span>Calendar</span>}
        </Link>
      </nav>

      {/* Wallet Info (Account and Balance) */}
      {account && (
        <div className="p-4 mt-auto">
          <div className="flex items-center space-x-3">
            {/* Profile Icon */}
            <img
              className={`h-10 w-10 rounded-full ${isCollapsed ? "mx-auto" : ""}`}
              src={logo}
              alt="Profile"
            />
            {/* Wallet Address and Balance */}
            {!isCollapsed && (
              <div className="text-sm text-gray-200">
                <p>{account}</p>
                <p>{balance} ETH</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
