import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import ProjectABI from "../Project.json"; // ABI for the Project contract

const ProjectDetails = ({ provider }) => {
  const { projectAddress } = useParams(); // Get the project address from the URL
  const [project, setProject] = useState(null); // Store project details
  const [isCreator, setIsCreator] = useState(false); // Check if the user is the creator
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [withdrawRequests, setWithdrawRequests] = useState([]); // Store withdraw requests
  const [isWithdrawCompleted, setIsWithdrawCompleted] = useState(false); // Track if withdrawal is completed

  const loadProjectDetails = useCallback(async () => {
    if (!provider || !projectAddress) {
      setError("Provider or Project address is missing.");
      setLoading(false);
      return;
    }

    try {
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const projectContract = new ethers.Contract(
        projectAddress,
        ProjectABI.abi,
        signer
      );

      // Fetch project details
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
      const creator = await projectContract.creator();
      const noOfWithdrawRequests = await projectContract.noOfWithdrawRequests;

      // Check if the user is the creator
      setIsCreator(creator.toLowerCase() === userAddress.toLowerCase());

      // Fetch all withdrawal requests
      const requests = [];
      for (let i = 0; i < noOfWithdrawRequests; i++) {
        const request = await projectContract.withdrawRequests(i);
        requests.push({
          id: i,
          description: request.description,
          amount: ethers.formatEther(request.amount),
          noOfVotes: request.noOfVotes,
          isCompleted: request.isCompleted,
          recipient: request.recipient,
        });
      }

      // Check if any withdrawal request is already completed
      const isCompleted = requests.some((request) => request.isCompleted);
      setIsWithdrawCompleted(isCompleted);

      // Update state with project details and withdrawal requests
      setProject({
        title,
        description,
        targetContribution,
        raisedAmount,
        deadline,
        state,
      });
      setWithdrawRequests(requests);
      setLoading(false);
    } catch (error) {
      console.error("Error loading project details:", error);
      setError("Error loading project details. Please try again.");
      setLoading(false);
    }
  }, [provider, projectAddress]);

  useEffect(() => {
    if (provider && projectAddress) {
      loadProjectDetails();
    }
  }, [provider, projectAddress, loadProjectDetails]);

  // Function to handle fund withdrawal
  const handleWithdraw = async () => {
    if (!provider || !projectAddress) return;

    const signer = await provider.getSigner();
    const projectContract = new ethers.Contract(
      projectAddress,
      ProjectABI.abi,
      signer
    );

    try {
   
      const requestId = 0; 
      const tx = await projectContract.withdrawRequestedAmount(requestId); 
      await tx.wait();
      alert("Funds withdrawn successfully!");
      setIsWithdrawCompleted(true); // Mark withdrawal as completed
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-backgroundcolor">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accentcolor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-backgroundcolor">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-backgroundcolor">
        <p className="text-light">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundcolor p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dark mb-6">{project.title}</h1>
        <div className="bg-card shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>
          <p className="text-sm text-gray-600 mb-4">{project.description}</p>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Target Contribution</span>
              <span className="text-gray-900">{project.targetContribution} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Raised Amount</span>
              <span className="text-gray-900">{project.raisedAmount} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Deadline</span>
              <span className="text-gray-900">{project.deadline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Status</span>
              <span
                className={`font-semibold ${
                  project.state === 0
                    ? "text-blue-600"
                    : project.state === 1
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {project.state === 0
                  ? "Fundraising"
                  : project.state === 1
                  ? "Expired"
                  : "Successful"}
              </span>
            </div>
          </div>

          {/* Withdraw button for the creator if the project is successful */}
          {isCreator && project.state === 2 && (
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawCompleted} // Disable if withdrawal is already completed
              className={`mt-6 w-full bg-accentcolor text-white py-2 px-4 rounded-md ${
                isWithdrawCompleted
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-accentcolor/80"
              } transition-colors`}
            >
              {isWithdrawCompleted ? "Withdrawal Completed" : "Withdraw Funds"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;