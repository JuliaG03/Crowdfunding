import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import CrowdfundingABI from "../Crowdfunding.json"; 
import ProjectABI from "../Project.json";

const crowdfundingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

const Dashboard = ({ provider }) => {
  const [fundraisings, setFundraisings] = useState([]);
  const [contributionAmounts, setContributionAmounts] = useState({});
  const [contract, setContract] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [targetContribution, setTargetContribution] = useState("");
  const [minimumContribution, setMinimumContribution] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFundraisings = async () => {
    if (!provider) return;

    const signer = await provider.getSigner();
    const crowdfundingContract = new ethers.Contract(
      crowdfundingAddress,
      CrowdfundingABI.abi,
      signer
    );

    setContract(crowdfundingContract);

    try {
      const projectAddresses = await crowdfundingContract.returnAllProjects();

      const fetchedProjects = await Promise.all(
        projectAddresses.map(async (projectAddress) => {
          const projectContract = new ethers.Contract(projectAddress, ProjectABI.abi, signer);

          const title = await projectContract.projectTitle();
          const description = await projectContract.projectDes();
          const targetContribution = await projectContract.targetContribution();
          const raisedAmount = await projectContract.raisedAmount();
          const deadline = new Date(Number(await projectContract.deadline()) * 1000).toLocaleDateString();
          const state = Number(await projectContract.state());
          const minimumContribution = await projectContract.minimumContribution();

          return {
            address: projectAddress,
            title,
            description,
            targetContribution: ethers.formatEther(targetContribution),
            raisedAmount: ethers.formatEther(raisedAmount),
            deadline,
            state,
            minimumContribution: ethers.formatEther(minimumContribution),
          };
        })
      );

      setFundraisings(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const contribute = async (projectAddress) => {
    if (!contract) return;
    const amount = contributionAmounts[projectAddress];

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid contribution amount!");
      return;
    }

    try {
      const tx = await contract.contribute(projectAddress, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Contribution successful!");
      loadFundraisings();
    } catch (error) {
      console.error("Error with contribution:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectTitle || !projectDesc || !minimumContribution || !targetContribution || !deadline) {
      alert("All fields are required!");
      return;
    }

    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    setIsSubmitting(true);

    try {
      const signer = await provider.getSigner();
      const crowdfundingContract = new ethers.Contract(crowdfundingAddress, CrowdfundingABI.abi, signer);

      const minContributionInWei = ethers.parseUnits(minimumContribution, "ether");
      const targetContributionInWei = ethers.parseUnits(targetContribution, "ether");
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

      const tx = await crowdfundingContract.createProject(
        minContributionInWei,
        deadlineTimestamp,
        targetContributionInWei,
        projectTitle,
        projectDesc
      );

      await tx.wait();
      alert("Fundraiser created successfully!");
      loadFundraisings();
    } catch (error) {
      console.error("Error creating fundraiser:", error);
      alert("Error creating fundraiser. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadFundraisings();
  }, [provider]);

  return (
    <div className="min-h-screen bg-backgroundcolor p-6">
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark">Projects</h1>
          <p className="text-sm text-light">Here are your ongoing projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fundraisings.length === 0 ? (
            <p>No active fundraisers available.</p>
          ) : (
            fundraisings.map((fund, index) => (
              <div key={index} className="bg-card shadow-md rounded-lg overflow-hidden p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <Link
                    to={`/project-details/${fund.address}`}
                    className="font-sans text-xl text-gray-700 font-semibold hover:text-sky-500 hover:cursor-pointer"
                  >
                    {fund.title}
                  </Link>
                  <span className="text-sm bg-accentcolor text-card px-2 py-1 rounded-full">
                    {fund.state === 0 ? "Fundraising" : fund.state === 1 ? "Expired" : "Successful"}
                  </span>
                </div>

                <p className="text-sm text-light mb-4">{fund.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-accentcolor-light p-4 rounded-md">
                    <p className="text-dark font-bold">Target Contribution</p>
                    <p className="text-light">{fund.targetContribution} ETH</p>
                    <p className="text-dark font-bold mt-4">Deadline</p>
                    <p className="text-light">{fund.deadline}</p>
                  </div>
                  <div className="p-4">
                    <label className="text-sm text-gray-700 font-semibold">Contribution Amount:</label>
                    <div className="flex mt-2">
                      <input
                        type="number"
                        placeholder="Type here"
                        value={contributionAmounts[fund.address] || ""}
                        onChange={(e) =>
                          setContributionAmounts({
                            ...contributionAmounts,
                            [fund.address]: e.target.value,
                          })
                        }
                        className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                        disabled={fund.state !== 0}
                      />
                      <button
                        className="button ml-2"
                        onClick={() => contribute(fund.address)}
                        disabled={fund.state !== 0}
                      >
                        Contribute
                      </button>
                    </div>
                    <p className="text-sm text-red mt-2">
                      <span className="font-bold">NOTE:</span> Minimum contribution is {fund.minimumContribution} ETH
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full mt-4">
                <div
                className="progress bg-accentcolor"
                style={{
                  width: `${Math.min((fund.raisedAmount / fund.targetContribution) * 100, 100)}%`
                }}
              >
                {Math.min((fund.raisedAmount / fund.targetContribution) * 100, 100).toFixed(2)}%
              </div>

                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 w-full my-8 ">
          <h1 className="font-sans font-bold text-2xl text-dark mb-6">Start a Fundraiser for Free</h1>
          <form onSubmit={handleCreateProject}>
            <div className="grid grid-cols-1 gap-6">
              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Title :</label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                />
              </div>

              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Description :</label>
                <textarea
                  placeholder="Enter project description"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md h-32"
                ></textarea>
              </div>

              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Targeted Contribution Amount :</label>
                <input
                  type="number"
                  placeholder="Enter target amount"
                  value={targetContribution}
                  onChange={(e) => setTargetContribution(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                />
              </div>

              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Minimum Contribution :</label>
                <input
                  type="number"
                  placeholder="Enter minimum contribution"
                  value={minimumContribution}
                  onChange={(e) => setMinimumContribution(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                />
              </div>

              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Deadline :</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                />
              </div>

              <div className="mt-6">
                <button type="submit" className="button" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Fundraiser"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
