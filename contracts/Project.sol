//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";


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
}