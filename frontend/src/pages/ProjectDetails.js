import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import ProjectABI from "../Project.json"; // ABI for the Project contract

const ProjectDetails = ({ provider }) => {
  const { projectAddress } = useParams(); // Get the project address from the URL
  const [project, setProject] = useState(null); // Store project details
  const [isCreator, setIsCreator] = useState(false); // Check if the user is the creator
  const [isContributor, setIsContributor] = useState(false); // Check if the user is a contributor
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [withdrawRequests, setWithdrawRequests] = useState([]); // Store withdraw requests
  const [newWithdrawRequest, setNewWithdrawRequest] = useState({
    description: "",
    amount: "",
    recipient: "",
  }); // State for new withdraw request

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

      // Check if the user is the creator or a contributor
      setIsCreator(creator.toLowerCase() === userAddress.toLowerCase());

      const contributors = await projectContract.contributors(userAddress);
      setIsContributor(contributors > 0); // User is a contributor if they have contributed

      // Load all withdrawal requests dynamically
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

      // Update state with project details
      setProject({
        title,
        description,
        targetContribution,
        raisedAmount,
        deadline,
        state,
        noOfContributers: await projectContract.noOfContributers(),
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

  // Function to handle creating a new withdraw request
  const handleCreateWithdrawRequest = async () => {
    if (!provider || !projectAddress) return;

    const signer = await provider.getSigner();
    const projectContract = new ethers.Contract(
      projectAddress,
      ProjectABI.abi,
      signer
    );

    try {
      const tx = await projectContract.createWithdrawRequest(
        newWithdrawRequest.description,
        ethers.parseEther(newWithdrawRequest.amount),
        newWithdrawRequest.recipient
      );
      await tx.wait();
      alert("Withdraw request created successfully!");

      // Clear the form
      setNewWithdrawRequest({ description: "", amount: "", recipient: "" });

      // Reload project details to reflect the new request
      loadProjectDetails();
    } catch (error) {
      console.error("Error creating withdraw request:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Function to handle voting for withdrawal requests
  const handleVote = async (requestId) => {
    if (!provider || !projectAddress) return;

    const signer = await provider.getSigner();
    const projectContract = new ethers.Contract(
      projectAddress,
      ProjectABI.abi,
      signer
    );

    try {
      const tx = await projectContract.voteWithdrawRequest(requestId);
      await tx.wait();
      alert("You have successfully voted for the withdrawal!");

      // Reload the project details to reflect new votes
      loadProjectDetails();
    } catch (error) {
      console.error("Error voting for withdrawal:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Function to handle fund withdrawal by the creator
  const handleWithdraw = async (requestId) => {
    if (!provider || !projectAddress) return;

    const signer = await provider.getSigner();
    const projectContract = new ethers.Contract(
      projectAddress,
      ProjectABI.abi,
      signer
    );

    try {
      const tx = await projectContract.withdrawRequestedAmount(requestId); // Use the request ID
      await tx.wait();
      alert("Funds withdrawn successfully!");

      // Reload project details to reflect the withdrawal
      loadProjectDetails();
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
                className={`font-semibold ${project.state === 0 ? "text-blue-600" : project.state === 1 ? "text-red-600" : "text-green-600"}`}
              >
                {project.state === 0 ? "Fundraising" : project.state === 1 ? "Expired" : "Successful"}
              </span>
            </div>
          </div>

          {/* Withdraw request form for the creator */}
          {isCreator && project.state === 2 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Create Withdraw Request</h3>
              <div className="space-y-4 mt-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newWithdrawRequest.description}
                  onChange={(e) =>
                    setNewWithdrawRequest({
                      ...newWithdrawRequest,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Amount (ETH)"
                  value={newWithdrawRequest.amount}
                  onChange={(e) =>
                    setNewWithdrawRequest({
                      ...newWithdrawRequest,
                      amount: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={newWithdrawRequest.recipient}
                  onChange={(e) =>
                    setNewWithdrawRequest({
                      ...newWithdrawRequest,
                      recipient: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={handleCreateWithdrawRequest}
                  className="w-full bg-accentcolor text-white py-2 px-4 rounded-md hover:bg-accentcolor/80 transition-colors"
                >
                  Create Withdraw Request
                </button>
              </div>
            </div>
          )}

          {/* Withdraw requests and voting for contributors */}
          {isContributor && project.state === 2 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Withdraw Requests</h3>
              <div className="space-y-4 mt-4">
                {withdrawRequests.map((request) => (
                  <div key={request.id} className="bg-white shadow-lg p-4 rounded-md border">
                    <h4 className="font-semibold">{request.description}</h4>
                    <p className="text-sm text-gray-600">{request.amount} ETH</p>
                    <p className="text-sm text-gray-600">
                      Votes: {request.noOfVotes} / {Math.ceil(project.noOfContributers / 2)} required
                    </p>
                    {!request.isCompleted && (
                      <button
                        onClick={() => handleVote(request.id)}
                        className="mt-4 bg-accentcolor text-white py-2 px-4 rounded-md hover:bg-accentcolor/80 transition-colors"
                      >
                        Vote for Withdrawal
                      </button>
                    )}
                    {isCreator && request.noOfVotes >= Math.ceil(project.noOfContributers / 2) && (
                      <button
                        onClick={() => handleWithdraw(request.id)}
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                      >
                        Withdraw Funds
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
