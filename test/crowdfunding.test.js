const { expect } = require("chai");
const { ethers } = require("hardhat");


const etherToWei = (n) =>{
  return ethers.parseUnits(n,'ether')
}

const dateToUNIX = (date) => {
  return Math.round(new Date(date).getTime() / 1000).toString()
}

describe("Crowdfunding", () => {

  var address1; 
  var address2; 
  var crowdfundingContract;

  beforeEach(async function () {
    [address1, address2,  ...address] = await ethers.getSigners();

    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfundingContract = await Crowdfunding.deploy();

  })

  describe("Request for funding", async function () {
    it("Start a project", async function () {

      const minimumContribution=etherToWei('1');
      const deadline=dateToUNIX('2022-04-15');
      const targetContribution=etherToWei('100');
      const projectTitle='Testing title';
      const projectDesc='Testing description';

      const project = await crowdfundingContract.connect(address1).createProject(minimumContribution,deadline,targetContribution,projectTitle,projectDesc)
      const event = await project.wait();

      expect(event.logs.length).to.equal(1);

      // Decode the event
      const decodedEvent = crowdfundingContract.interface.decodeEventLog("projectStarted", event.logs[0].data, event.logs[0].topics);
      
      const projectList = await crowdfundingContract.returnAllProjects();

      // Test Event
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