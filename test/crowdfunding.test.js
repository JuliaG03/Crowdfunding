const { expect } = require("chai");
const { ethers } = require("hardhat"); // import ethers from Hardhat for contract interactions

// helper function to convert ether values to wei
const etherToWei = (n) =>{
  return ethers.parseUnits(n,'ether') // parses the ether value to its wei equivalent
}

// helper function to convert a date to UNIX timestamp (in seconds)
const dateToUNIX = (date) => {
  return Math.round(new Date(date).getTime() / 1000).toString()
}

// main test suite for the Crowdfunding contract
describe("Crowdfunding", () => {

  var address1; // first address (creator)
  var address2; // second address (other user)
  var crowdfundingContract; // Crowdfunding contract instance

  // runs before each test in this suite
  beforeEach(async function () {
    // get a list of signers (addresses that can be used in tests)
    [address1, address2,  ...address] = await ethers.getSigners();

    // deploy the Crowdfunding contract
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfundingContract = await Crowdfunding.deploy(); // deploy the contract to a local Ethereum network

  })

  // describe a group of tests related to requesting funding for a project
  describe("Request for funding", async function () {
    
    // test case: Starting a new project
    it("Start a project", async function () {
      
      // set project details
      const minimumContribution=etherToWei('1');
      const deadline=dateToUNIX('2022-04-15');
      const targetContribution=etherToWei('100');
      const projectTitle='Testing title';
      const projectDesc='Testing description';

      // create a new project by calling the `createProject` function of the contract
      const project = await crowdfundingContract.connect(address1).createProject(minimumContribution,deadline,targetContribution,projectTitle,projectDesc)
      
      // wait for the transaction to be mined and get the event logs
      const event = await project.wait();

      // check if one event was emitted (`projectStarted`)
      expect(event.logs.length).to.equal(1);

      // Decode the `projectStarted` event log to get event details
      const decodedEvent = crowdfundingContract.interface.decodeEventLog("projectStarted", event.logs[0].data, event.logs[0].topics);
      
      // retrieve the list of projects from the contract (returns all projects created so far)
      const projectList = await crowdfundingContract.returnAllProjects();

      // Test Event: Verify that the decoded event data matches the project created
      
      expect(decodedEvent.projectContractAddress).to.equal(projectList[0]);
      expect(decodedEvent.creator).to.equal(address1.address);
      expect(decodedEvent.minimumContribution).to.equal(minimumContribution);
      expect(Number(decodedEvent.deadline)).to.greaterThan(0);
      expect(decodedEvent.targetContribution).to.equal(targetContribution);
      expect(decodedEvent.raisedAmount).to.equal(0);
      expect(decodedEvent.noOfContributors).to.equal(0);
      expect(decodedEvent.projectTitle).to.equal(projectTitle);
      expect(decodedEvent.projectDesc).to.equal(projectDesc);

    });
  })
});