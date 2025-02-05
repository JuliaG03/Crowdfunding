import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CrowdfundingABI from "../Crowdfunding.json"; // ABI for the Crowdfunding contract
import ProjectABI from "../Project.json"; // ABI for the Project contract

const crowdfundingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Crowdfunding contract address

const Fundraising = ({ provider }) => {
  const [fundraisings, setFundraisings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all fundraisings created by the user
  const loadFundraisings = async () => {
    if (!provider) return;
    // Get the signer
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    // Create a new contract instance
    const crowdfundingContract = new ethers.Contract(
      crowdfundingAddress,
      CrowdfundingABI.abi,
      signer
    );
// Fetch all project addresses
    try {
      const projectAddresses = await crowdfundingContract.returnAllProjects();

      // Fetch fundraisings created by the user
      const userFundraisings = await Promise.all(
        projectAddresses.map(async (projectAddress) => {
          const projectContract = new ethers.Contract(
            projectAddress,
            ProjectABI.abi,
            signer
          );

          // Get the creator of the project
          const creator = await projectContract.creator();

          // Check if the current user is the creator
          if (creator.toLowerCase() === userAddress.toLowerCase()) {
            // Fetch project details
            const title = await projectContract.projectTitle();
            const description = await projectContract.projectDes();
            const targetContribution = ethers.formatEther(
              await projectContract.targetContribution()
            );
            // Fetch raised amount
            const raisedAmount = ethers.formatEther(
              await projectContract.raisedAmount()
            );
            const deadline = new Date(
              Number(await projectContract.deadline()) * 1000
            ).toLocaleDateString();
            const state = Number(await projectContract.state());

            return {
              projectAddress,
              title,
              description,
              targetContribution,
              raisedAmount,
              deadline,
              state, // 0: Fundraising, 1: Expired, 2: Successful
            };
          } else {
            return null; // Not created by the user
          }
        })
      );

      // Filter out null values (projects not created by the user)
      const filteredFundraisings = userFundraisings.filter(
        (fundraising) => fundraising !== null
      );

      setFundraisings(filteredFundraisings);
      setLoading(false);
    } catch (error) {
      console.error("Error loading fundraisings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundraisings();
  }, [provider]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accentcolor border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundcolor p-6">
      <h1 className="text-4xl font-bold text-dark mb-6">Your Fundraisings</h1>
      {fundraisings.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          You haven't created any fundraisings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundraisings.map((fundraising, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {fundraising.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {fundraising.description}
              </p>
              <div className="bg-accentcolor-light p-4 rounded-md mb-4">
                <p className="font-bold text-dark">Target Contribution:</p>
                <p className="text-lg text-gray-700">
                  {fundraising.targetContribution} ETH
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-bold text-dark">Raised:</p>
                  <p className="text-gray-600">{fundraising.raisedAmount} ETH</p>
                </div>
                <div>
                  <p className="font-bold text-dark">Deadline:</p>
                  <p className="text-gray-600">{fundraising.deadline}</p>
                </div>
                <div>
                  <p className="font-bold text-dark">Status:</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${fundraising.state === 0
                        ? "bg-blue-100 text-blue-700"
                        : fundraising.state === 1
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"}`}
                  >
                    {fundraising.state === 0
                      ? "Fundraising"
                      : fundraising.state === 1
                      ? "Expired"
                      : "Successful"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fundraising;