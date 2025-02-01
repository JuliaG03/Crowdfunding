import React from "react";
import { Link } from "react-router-dom";

var projects = [1, 2, 3];

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="flex-1 bg-backgroundcolor p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark">Projects</h1>
          <p className="text-sm text-light">Here are your ongoing projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Cards */}
          {projects.map((data, i) => (
            <div key={i} className="bg-card shadow-md rounded-lg overflow-hidden p-6">
              {/* Project Header */}
              <div className="flex justify-between items-center mb-4">
                <Link to={`/project-details/${i}`} className="font-sans text-xl text-gray-700 font-semibold hover:text-sky-500 hover:cursor-pointer">Project Title</Link>
                <span className="text-sm bg-accentcolor text-card px-2 py-1 rounded-full">Popular</span>
              </div>

              {/* Project Description */}
              <p className="text-sm text-light mb-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </p>

              {/* Project Details and Contribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-accentcolor-light p-4 rounded-md">
                  <p className="text-dark font-bold">Target Contribution</p>
                  <p className="text-light">100,000 ETH</p>
                  <p className="text-dark font-bold mt-4">Deadline</p>
                  <p className="text-light">2025-06-17 10:15 PM</p>
                </div>
                <div className="p-4">
                  <label className="text-sm text-gray-700 font-semibold">
                    Contribution Amount:
                  </label>
                  <div className="flex mt-2">
                    <input
                      type="number"
                      placeholder="Type here"
                      className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                    />
                    <button className="button ml-2">Contribute</button>
                  </div>
                  <p className="text-sm text-red mt-2">
                    <span className="font-bold">NOTE:</span> Minimum contribution is 2 ETH
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full mt-4">
                <div className="progress bg-accentcolor" style={{ width: "25%" }}>
                  25%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 w-full my-8">
  <h1 className="font-sans font-bold text-2xl text-dark mb-6">Start a Fundraiser for Free</h1>
  <form>
    <div className="grid grid-cols-1 gap-6">
      {/* Title */}
      <div className="form-control">
        <label className="text-sm text-dark font-semibold mb-2">Title :</label>
        <input
          type="text"
          placeholder="Enter project title"
          className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
        />
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="text-sm text-dark font-semibold mb-2">Description :</label>
        <textarea
          placeholder="Enter project description"
          className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md h-32"
        ></textarea>
      </div>

      {/* Target Contribution */}
      <div className="form-control">
        <label className="text-sm text-dark font-semibold mb-2">Targeted Contribution Amount :</label>
        <input
          type="number"
          placeholder="Enter target amount"
          className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
        />
      </div>

      {/* Minimum Contribution */}
      <div className="form-control">
        <label className="text-sm text-dark font-semibold mb-2">Minimum Contribution Amount :</label>
        <input
          type="number"
          placeholder="Enter minimum contribution"
          className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
        />
      </div>

      {/* Deadline */}
      <div className="form-control">
        <label className="text-sm text-dark font-semibold mb-2">Deadline :</label>
        <input
          type="date"
          className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
        />
      </div>

      {/* Submit Button */}
      <button
        className="mt-4 p-3 w-full bg-accentcolor text-white rounded-md hover:bg-accentcolor/80 focus:outline-none"
        disabled
      >
        Start Fundraiser
      </button>
    </div>
  </form>
</div>

      </main>
    </div>
  );
};

export default Dashboard;