import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CrowdfundingABI from "../Crowdfunding.json"; // ABI-ul contractului Crowdfunding
import ProjectABI from "../Project.json"; // ABI-ul contractului Project

const crowdfundingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Adresa contractului Crowdfunding

const Contributions = ({ provider }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
// Functie care incarca contributiile utilizatorului
  const loadContributions = async () => {
    if (!provider) return;

    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const crowdfundingContract = new ethers.Contract(
      crowdfundingAddress,
      CrowdfundingABI.abi,
      signer
    );

    try {
      const projectAddresses = await crowdfundingContract.returnAllProjects();

      const userContributions = await Promise.all(
        projectAddresses.map(async (projectAddress) => {
          const projectContract = new ethers.Contract(
            projectAddress,
            ProjectABI.abi,
            signer
          );

          const contribution = await projectContract.contributors(userAddress);
          const contributionInEth = ethers.formatEther(contribution);

          if (contribution > 0) {
            const title = await projectContract.projectTitle();
            const description = await projectContract.projectDes();
            const targetContribution = ethers.formatEther(
              await projectContract.targetContribution()
            );
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
              state,
              contribution: contributionInEth,
            };
          }

          return null;
        })
      );

      const filteredContributions = userContributions.filter(
        (contribution) => contribution !== null
      );

      setContributions(filteredContributions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading contributions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
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
      <h1 className="text-4xl font-bold text-dark mb-6">Your Contributions</h1>
      {contributions.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          You haven't contributed to any projects yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((contribution, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {contribution.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {contribution.description}
              </p>
              <div className="bg-accentcolor-light p-4 rounded-md mb-4">
                <p className="font-bold text-dark">Your Contribution:</p>
                <p className="text-lg text-gray-700">{contribution.contribution} ETH</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-bold text-dark">Target:</p>
                  <p className="text-gray-600">{contribution.targetContribution} ETH</p>
                </div>
                <div>
                  <p className="font-bold text-dark">Raised:</p>
                  <p className="text-gray-600">{contribution.raisedAmount} ETH</p>
                </div>
                <div>
                  <p className="font-bold text-dark">Deadline:</p>
                  <p className="text-gray-600">{contribution.deadline}</p>
                </div>
                <div>
                  <p className="font-bold text-dark">Status:</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${contribution.state === 0
                        ? "bg-blue-100 text-blue-700"
                        : contribution.state === 1
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"}`}
                  >
                    {contribution.state === 0
                      ? "Fundraising"
                      : contribution.state === 1
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

export default Contributions;
