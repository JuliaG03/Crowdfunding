//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

// Anyone can contribute - done
// If targeted contribution is not reached - we end the project - done
// If raised amount is not equal to the targeted contribution 
//         - the project expire and the donated amount is returned to the contributors - done
// The owner can request contributors before withdraw amount - done
// The owner can withdraw amount if 50 % of the contributors agree - done

// contract to manage a crowdfunding project
contract Project{

   // Project state

    enum State {
        Fundraising,
        Expired,
        Successful
    }

    // structs

    // struct to represent a request to withdraw funds from the project
    struct WithdrawRequest{
        string description;
        uint256 amount;
        uint256 noOfVotes;
        mapping(address => bool) voters;
        bool isCompleted;
        address payable recipient;
    }

    // variables: 
        address payable public creator;
        uint256 public minimumContribution;
        uint256 public deadline;
        uint256 public targetContribution; // the contribution is required to be at least this amount
        uint public completeAt;
        uint256 public raisedAmount; // Total raised untill present moment
        uint256 public noOfContributers;
        string public projectTitle;
        string public projectDes;
        State public state = State.Fundraising; 


        // mappings to store contributions and withdraw requests

        // tracks how much each address has contributed
        mapping (address => uint) public contributors;
        // tracks withdrawal requests by their ID
        mapping (uint256 => WithdrawRequest) public withdrawRequests;

        // counter to track the number of withdraw requests
        uint256 noOfWithdrawRequests = 0;

    // modifiers: 
        
        // ensures that only the creator (project owner) can call certain functions
        modifier isCreator(){
            require(msg.sender == creator,'You dont have access to perform this operation!');
            _;
        }

        // ensures the project state is valid and checks if the deadline has passed
        modifier validateExpiry(State _state){
            require(state == _state,'Invalid state');
            require(block.timestamp < deadline,'Deadline has passed!');
            _;
        }

        // events:

        //event emitted when funds are received for the project
        event FundingReceived(address contributor, uint amount, uint currentTotal);
        
        //event emitted when a new withdraw request is created
        event WithdrawRequestCreated(
            uint256 requestId,
            string description,
            uint256 amount,
            uint256 noOfVotes,
            bool isCompleted,
            address recipient
        );

        //event emitted when a contributor votes on a withdrawal request
        event WithdrawVote(address voter, uint totalVote);
        event AmountWithdrawSuccessful(
            uint256 requestId,
            string description,
            uint256 amount,
            uint256 noOfVotes,
            bool isCompleted,
            address recipient
        );

    // constructor to initialize a new project
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

    // function for users to contribute funds to the project
    function contribute() public validateExpiry(State.Fundraising) payable {
        require(msg.value >= minimumContribution, 'Contribution amount is too low!');

        // if the contributor hasn't contributed before, increase the contributor count
        if(contributors[msg.sender] == 0){
            noOfContributers++;
        }
        contributors[msg.sender] += msg.value; // update contributor's contribution amount
        raisedAmount += msg.value; // increase the total raised amount

        emit FundingReceived(msg.sender, msg.value, raisedAmount); // emit event
        checkFundingCompleteOrExpire(); // check if the project has met its funding goal or expired
    }

    // internal function to check if the funding goal is reached or if the project has expired
    function checkFundingCompleteOrExpire() internal {
        if(raisedAmount >= targetContribution){
            state = State.Successful; // project is successful if target is met
        }else if(block.timestamp >= deadline){
            state = State.Expired; // if deadline passes without meeting target, the project expires
        }
        completeAt = block.timestamp; // mark the completion time
    }

    // function to get the balance of funds held by the contract
    function getContractBalance() public view returns(uint256){
        return address(this).balance;
    }

    // function to request a refund if the project has expired
    function requestRefund() public validateExpiry(State.Expired) returns(bool) {
        require(contributors[msg.sender] > 0, 'You dont have any contributed amount!');
        address payable user = payable(msg.sender);
        user.transfer(contributors[msg.sender]); // refund the contributor
        contributors[msg.sender] = 0; // reset the contributor's balance to 0
        return true;
    }

    // function for the creator to create a withdraw request
    function createWithdrawRequest(string memory _description, uint256 _amount, address payable _recipient) public isCreator() validateExpiry(State.Successful) {
        WithdrawRequest storage newRequest = withdrawRequests[noOfWithdrawRequests];
        noOfWithdrawRequests++;

        newRequest.description = _description;
        newRequest.amount = _amount;
        newRequest.noOfVotes = 0;
        newRequest.isCompleted = false;
        newRequest.recipient = _recipient;

        emit WithdrawRequestCreated(noOfWithdrawRequests, _description, _amount, 0, false, _recipient);
    }

    // function for contributors to vote on a withdrawal request
    function voteWithdrawRequest(uint256 _requestId) public {
        require(contributors[msg.sender] > 0, 'Only contributors can vote!');
        WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
        require(requestDetails.voters[msg.sender] == false, 'You already voted!');
        requestDetails.voters[msg.sender] = true; // mark the contributor as having voted
        requestDetails.noOfVotes++; // increment the vote count
        emit WithdrawVote(msg.sender, requestDetails.noOfVotes); // emit vote event
    }

    // function to allow the creator to withdraw funds if the request is approved
    function withdrawRequestedAmount(uint256 _requestId) isCreator() validateExpiry(State.Successful) public {
        WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
        require(requestDetails.isCompleted == false, 'Request already completed');
        require(requestDetails.noOfVotes == noOfContributers/2, 'At least 50% of the contributors need to vote for this request');
        requestDetails.recipient.transfer(requestDetails.amount); // transfer the requested amount
        requestDetails.isCompleted == true; // mark the request as completed

        emit AmountWithdrawSuccessful(
            _requestId,
            requestDetails.description,
            requestDetails.amount,
            requestDetails.noOfVotes,
            requestDetails.isCompleted,
            requestDetails.recipient
        ); // emit successful withdrawal event
    }
}