import React from "react";
import { Menu } from "../icons/Icons"; // Assuming Menu is an icon
import logo from "../logo.svg"; // Assuming this is the logo image

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
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
        <a
          href="#"
          className="block py-2 px-3 rounded-lg bg-gray-700 hover:bg-accentcolor flex items-center space-x-3"
        >
          <span>🏠</span>
          {!isCollapsed && <span>Dashboard</span>}
        </a>
        <a
          href="#"
          className="block py-2 px-3 rounded-lg hover:bg-gray-700 flex items-center space-x-3"
        >
          <span>💰</span>
          {!isCollapsed && <span>My Contribution</span>}
        </a>
        <a
          href="#"
          className="block py-2 px-3 rounded-lg hover:bg-gray-700 flex items-center space-x-3"
        >
          <span>📊</span>
          {!isCollapsed && <span>My Fundraising</span>}
        </a>
        <a
          href="#"
          className="block py-2 px-3 rounded-lg hover:bg-gray-700 flex items-center space-x-3"
        >
          <span>📅</span>
          {!isCollapsed && <span>Calendar</span>}
        </a>
      </nav>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img
            className={`h-10 w-10 rounded-full ${isCollapsed ? "mx-auto" : ""}`}
            src={logo}
            alt="Profile"
          />
          {!isCollapsed && (
            <div>
              <span className="text-sm">Wallet address</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
