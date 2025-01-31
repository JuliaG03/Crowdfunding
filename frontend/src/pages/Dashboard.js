import React from "react";

const projects = [1, 2, 3];

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
          {projects.map((_, i) => (
            <div key={i} className="bg-card shadow-md rounded-lg overflow-hidden p-6">
              {/* Project Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-dark">Project Title</h2>
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
                      className="input w-full"
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
        <div className="mt-8 bg-card p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-dark">Create New Project</h2>
          <p className="text-sm text-light mb-6">Fill in the details below to start a new fundraising project.</p>
          {/* Form Elements */}
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <input type="text" placeholder="Project Title" className="input" />
            <input type="number" placeholder="Target Amount (ETH)" className="input" />
            <input type="date" placeholder="Deadline" className="input" />
            <textarea placeholder="Project Description" className="input h-24"></textarea>
            <button className="button lg:col-span-2 w-full">Create Project</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
