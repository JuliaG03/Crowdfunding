import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import CrowdfundingABI from "../Crowdfunding.json"; // Assuming this is the ABI file for your contract

const crowdfundingAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with actual contract address

const Dashboard = ({ provider }) => {
  const [fundraisings, setFundraisings] = useState([]);
  const [contributionAmounts, setContributionAmounts] = useState({}); // Store contribution amounts
  const [contract, setContract] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
const [projectDesc, setProjectDesc] = useState("");
const [targetContribution, setTargetContribution] = useState("");
const [minimumContribution, setMinimumContribution] = useState("");
const [deadline, setDeadline] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);


  // Load the Crowdfunding contract and fetch projects
  const loadFundraisings = async () => {
    if (!provider) return;
  
    const signer = await provider.getSigner();
    const crowdfundingContract = new ethers.Contract(
      crowdfundingAddress,
      CrowdfundingABI.abi,
      signer
    );
  


    
    try {
      console.log("Fetching project addresses...");

      // Log the raw result before decoding
      const rawResult = await crowdfundingContract.returnAllProjects.staticCall();
      console.log("Raw Result:", rawResult);
  
      // Fetch the project addresses from the contract
      const projectAddresses = await crowdfundingContract.returnAllProjects();
      console.log("Project Addresses:", projectAddresses); // Debugging output
  

      // Fetch details for each project
      const fundraisers = await Promise.all(
        projectAddresses.map(async (address) => {
          const projectContract = new ethers.Contract(address, CrowdfundingABI.abi, signer);
  
          const projectTitle = await projectContract.projectTitle;
          console.log(projectTitle);
          const projectDesc = await projectContract.projectDesc;
          const targetContribution = ethers.formatEther(await projectContract.targetContribution);
          const raisedAmount = ethers.formatEther(await projectContract.raisedAmount);
          const minimumContribution = ethers.formatEther(await projectContract.minimumContribution);
          const deadline = await projectContract.deadline;
  
          

          return {
            address: address,
            title: projectTitle,
            description: projectDesc,
            targetContribution,
            raisedAmount,
            minimumContribution,
            deadline: new Date(deadline.toNumber() * 1000).toLocaleString(),
            state: await projectContract.state(),
          };
        })
      );
  
      setFundraisings(fundraisers);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setFundraisings([]);
    }
  };
  
  
  

  useEffect(() => {
    loadFundraisings();
  }, [provider]);

  // Handle contribution
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
    } catch (error) {
      console.error("Error with contribution:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
  
    // Validate all form fields before proceeding
    if (!projectTitle || !projectDesc || !minimumContribution || !targetContribution || !deadline) {
      alert("All fields are required!");
      return;
    }
  
    // Check if the provider exists, if not, alert the user
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }
  
    // Set the submitting state to true while waiting for the transaction
    setIsSubmitting(true);
  
    try {
      // Get the signer from the provider
      const signer = await provider.getSigner();
  
      // Create the contract instance using the signer
      const crowdfundingContract = new ethers.Contract(
        crowdfundingAddress,
        CrowdfundingABI.abi,
        signer
      );
  
      // Convert the contribution amounts and deadline into the appropriate formats
      const minContributionInWei = ethers.parseUnits(minimumContribution, "ether");
      const targetContributionInWei = ethers.parseUnits(targetContribution, "ether");
      const deadlineTimestamp = new Date(deadline).getTime() / 1000; // Convert to UNIX timestamp (in seconds)
  
      // Call the smart contract's createProject function
      const tx = await crowdfundingContract.createProject(
        minContributionInWei,
        deadlineTimestamp,
        targetContributionInWei,
        projectTitle,
        projectDesc
      );
  

      
      // Wait for the transaction to be mined
      await tx.wait();
  
      // Notify the user that the project was created successfully
      alert("Fundraiser created successfully!");
    } catch (error) {
      // Log and show an error message if something goes wrong
      console.error("Error creating fundraiser:", error);
      alert("Error creating fundraiser. Please try again.");
    } finally {
      // Set submitting state to false after the transaction is done
      setIsSubmitting(false);
    }
  };
  
  


  
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
          {fundraisings.length === 0 ? (
            <p>No active fundraisers available.</p>
          ) : (
            fundraisings.map((fund, index) => (
              <div key={index} className="bg-card shadow-md rounded-lg overflow-hidden p-6">
                {/* Project Header */}
                <div className="flex justify-between items-center mb-4">
                  <Link
                    to={`/project-details/${fund.address}`}
                    className="font-sans text-xl text-gray-700 font-semibold hover:text-sky-500 hover:cursor-pointer"
                  >
                    {fund.title}
                  </Link>
                  <span className="text-sm bg-accentcolor text-card px-2 py-1 rounded-full">
                    {fund.state === 0 ? "Fundraising" : "Completed"}
                  </span>
                </div>

                {/* Project Description */}
                <p className="text-sm text-light mb-4">{fund.description}</p>

                {/* Project Details and Contribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-accentcolor-light p-4 rounded-md">
                    <p className="text-dark font-bold">Target Contribution</p>
                    <p className="text-light">{fund.targetContribution} ETH</p>
                    <p className="text-dark font-bold mt-4">Deadline</p>
                    <p className="text-light">{fund.deadline}</p>
                  </div>
                  <div className="p-4">
                    <label className="text-sm text-gray-700 font-semibold">
                      Contribution Amount:
                    </label>
                    <div className="flex mt-2">
                      <input
                        type="number"
                        placeholder="Type here"
                        value={contributionAmounts[fund.address] || ""}
                        onChange={(e) => setContributionAmounts({
                          ...contributionAmounts,
                          [fund.address]: e.target.value,
                        })}
                        className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                        disabled={fund.state !== 0} // Disable if project is not fundraising
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

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full mt-4">
                  <div className="progress bg-accentcolor" style={{ width: `${(fund.raisedAmount / fund.targetContribution) * 100}%` }}>
                    {((fund.raisedAmount / fund.targetContribution) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 w-full my-8">
          <h1 className="font-sans font-bold text-2xl text-dark mb-6">Start a Fundraiser for Free</h1>
          <form onSubmit={handleCreateProject}>
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
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

              {/* Description */}
              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Description :</label>
                <textarea
                  placeholder="Enter project description"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md h-32"
                ></textarea>
              </div>

              {/* Target Contribution */}
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

              {/* Minimum Contribution */}
              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Minimum Contribution Amount :</label>
                <input
                  type="number"
                  placeholder="Enter minimum contribution"
                  value={minimumContribution}
                  onChange={(e) => setMinimumContribution(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                />
              </div>

              {/* Deadline */}
              <div className="form-control">
                <label className="text-sm text-dark font-semibold mb-2">Deadline :</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input w-full border-gray-300 focus:border-accentcolor focus:ring-1 focus:ring-accentcolor rounded-md"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 p-3 w-full bg-accentcolor text-white rounded-md hover:bg-accentcolor/80 focus:outline-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Starting Fundraiser..." : "Start Fundraiser"}
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
