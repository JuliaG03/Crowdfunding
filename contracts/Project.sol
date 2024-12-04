//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

// --- to do
// Anyone can contribute
// If targeted contribution is not reached - we end the project
// If raised amount is not equal to the targeted contribution
//         - the project expire and the donated amount is returned to the contributors
// The owner can request contributors before withdraw amount
// The owner can withdraw amount if 50 % of the contributors agree


contract Project{

   // Project state

    enum State {
        Fundraising,
        Expired,
        Successful
    }

// variables: 
    address payable public creator;
    uint256 minimumContribution;
    uint256 deadline;
    uint256 targetContribution; // the contribution is required to be at least this amount
    uint public completeAt;
    uint256 raisedAmount; // Total raised untill present moment
    string projectTitle;
    string projectDes;
    State public state = State.Fundraising; 
    mapping (address => uint) public contributiors;

// modifiers: 
    
    // Modifiers
    modifier isCreator(){
        require(msg.sender == creator,'You dont have access to perform this operation !');
        _;
    }
    modifier validateExpiry(State _state){
        require(state == _state,'Invalid state');
        require(block.timestamp < deadline,'Deadline has passed !');
        _;
    }
   constructor(
       address _creator,
       uint256 _minimumContribution,
       uint256 _deadline,
       uint256 _targetContribution,
       string memory _projectTitle,
       string memory _projectDes
   ) {
       creator = payable(_creator);
       minimumContribution = _minimumContribution;
       deadline = _deadline;
       targetContribution = _targetContribution;
       projectTitle = _projectTitle;
       projectDes = _projectDes;
       raisedAmount = 0;
   }
 function contribute() public validateExpiry(State.Fundraising) payable {
     require(msg.value >= minimumContribution,'Contribution amount is too low !');

          if(contributiors[msg.sender] == 0){
         
     }
 }
}