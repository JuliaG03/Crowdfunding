// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import the Hardhat console for debugging & the Project contract
import "hardhat/console.sol";
import './Project.sol';

// Crowdfunding contract that allows users to create and manage crowdfunding projects
contract Crowdfunding{

// ---to do 
// Anyone can start a funding project    (done)
// get all project list  (done)
// filter project 


// event that is emitted when a new project is started
event projectStarted(
    address projectContractAddress,
    address creator,
    uint256 minimumContribution,
    uint256 deadline,
    uint256 targetContribution,
    uint256 raisedAmount,
    uint256 noOfContributors,
    string projectTitle,
    string projectDesc
);

// array to store all created Project contracts
 Project[] private projects;

// function to create a new project
function createProject(
    uint256 minimumContribution,
    uint256 deadline,
    uint256 targetContribution,
    string memory projectTitle,
    string memory projectDesc
 ) public {
   // set the deadline as the current timestamp plus the duration passed as input
   deadline = block.timestamp+deadline;

   // create a new Project contract using provided parameters
   Project newProject = new Project(msg.sender,minimumContribution,deadline,targetContribution,projectTitle,projectDesc);
   
   // add the new project to the projects array
   projects.push(newProject);
 
 // emit the projectStarted event with the new project's details
 emit projectStarted(
    address(newProject) ,
    msg.sender,
    minimumContribution,
    deadline,
    targetContribution,
    0,
    0,
    projectTitle,
    projectDesc
 );

 }

// function to return all projects created
// external view function that allows anyone to retrieve the list of all projects
function returnAllProjects() external view returns(Project[] memory){
   return projects;
}
}