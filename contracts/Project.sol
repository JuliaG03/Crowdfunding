//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

// Anyone can contribute - done
// If targeted contribution is not reached - we end the project - done
// If raised amount is not equal to the targeted contribution 
//         - the project expire and the donated amount is returned to the contributors - done
// The owner can request contributors before withdraw amount - done
// The owner can withdraw amount if 50 % of the contributors agree


contract Project{

   // Project state

    enum State {
        Fundraising,
        Expired,
        Successful
    }

    // structs

    struct WithdrawRequest{
        string description;
        uint256 amount;
        uint256 noOfVotes;
        mapping(address => uint256) voters;
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


        mapping (address => uint) public contributors;
        mapping (uint256 => WithdrawRequest) public withdrawRequests;

        uint256 noOfWithdrawRequests = 0;

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

        // events:

        //event that will be emitted when funding is received
        event FundingReceived(address contributor, uint amount, uint currentTotal);
        //event that will be emitted when a withdraw request is created
        event WithdrawRequestCreated(
            uint256 requestId,
            string description,
            uint256 amount,
            uint256 noOfVotes,
            bool isCompleted,
            address recipient
        );
        //event that will be emitted when contributor votes for withdraw request
        event WithdrawVote(address contributor, uint amount, uint currentTotal);


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
        require(msg.value >= minimumContribution, 'Contribution amount is too low !');

        if(contributors[msg.sender] == 0){
            noOfContributers++;
        }
        contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;
        emit FundingReceived(msg.sender, msg.value, raisedAmount);
        checkFundingCompleteOrExpire();
    }


    function checkFundingCompleteOrExpire() internal {
        if(raisedAmount >= targetContribution){
            state = State.Successful;
        }else if(block.timestamp > deadline){
            state = State.Expired;
        }
        completeAt = block.timestamp;
    }


    function getContractBalance() public view returns(uint256){
        return address(this).balance;
    }


    function requestRefund() public validateExpiry(State.Expired) returns(bool) {
        require(contributors[msg.sender] > 0, 'You dont have any contributed amount!');
        address payable user = payable(msg.sender);
        user.transfer(contributors[msg.sender]);
        contributors[msg.sender] = 0;
        return true;
    }


    function createWithdrawRequest(string memory _description, uint256 _amount, address payable _recipient) public isCreator() {
        WithdrawRequest storage newRequest = withdrawRequests[noOfWithdrawRequests];
        noOfWithdrawRequests++;

        newRequest.description = _description;
        newRequest.amount = _amount;
        newRequest.noOfVotes = 0;
        newRequest.isCompleted = false;
        newRequest.recipient = _recipient;

        emit WithdrawRequestCreated(noOfWithdrawRequests, _description, _amount, 0, false, _recipient);
    }
}