const { expect } = require("chai");
const { ethers } = require("hardhat");

const etherToWei = (n) =>{
  return ethers.parseUnits(n,'ether')
}

const dateToUNIX = (date) => {
  return Math.round(new Date(date).getTime() / 1000).toString()
}

// main test suite for the Project contract
describe("Project", () => {
    var address1; // first test address (creator)
    var address2; // second test address (another user)
    var projectContract; // Project contract instance
    
    // setup function that runs before each test
    beforeEach(async function () {
      [address1, address2,  ...address] = await ethers.getSigners(); // get available signers (wallets) from the test environment
      
      // set up project parameters for contract deployment
      const creator = address1.address;
      const minimumContribution = etherToWei("1");
      const deadline = dateToUNIX('2026-10-22');
      
      const targetContribution = etherToWei("10");
      const projectTitle = "Testing project";
      const projectDes = "Testing project description"
  
      // Deploy the Project contract with the given parameters
      const Project = await ethers.getContractFactory("Project");
      projectContract = await Project.deploy(creator,minimumContribution,deadline,targetContribution,projectTitle,projectDes);
    })

    // test suite for project variable validation and contribution functionality
    describe("Check project variables & Contribute", async function () {

        // test to validate that project variables are set correctly upon deployment
        it("Validate variables", async function () {
           expect(await projectContract.creator()).to.equal(address1.address);
           expect(await projectContract.minimumContribution()).to.equal(etherToWei("1"));
           expect(Number(await projectContract.deadline())).to.greaterThan(0);
           expect(await projectContract.targetContribution()).to.equal(etherToWei("10"));
           expect(await projectContract.projectTitle()).to.equal("Testing project");
           expect(await projectContract.projectDes()).to.equal("Testing project description");
           expect(await projectContract.state()).to.equal(+0);
           expect(await projectContract.noOfContributers()).to.equal(0);
        })

        // test to check if contribution functionality works and events are emitted properly
        it("Contribute", async function () {
            const project = await projectContract.connect(address1).contribute({value:etherToWei('4')}); // contribute 4 ether to the project
            const event = await project.wait(); // wait for the transaction to be mined
            
            expect(event.logs.length).to.equal(1); // ensure one event was emitted

            // Decode event
            const decodedEvent = projectContract.interface.decodeEventLog("FundingReceived", event.logs[0].data, event.logs[0].topics);
            
            // Test Event
            expect(decodedEvent.contributor).to.equal(address1.address);
            expect(decodedEvent.amount).to.equal(etherToWei('4'));
            expect(decodedEvent.currentTotal).to.equal(etherToWei('4'));
            expect(await projectContract.noOfContributers()).to.equal(1);
            expect(await projectContract.getContractBalance()).to.equal(etherToWei('4'));            
            
        })

        // test to ensure contribution reverts if below the minimum contribution amount 
        it("Should fail if amount is less than minimum contribution amount", async () => {
            await expect(projectContract.connect(address1).contribute({value:etherToWei('0.5')})).to.be.revertedWith('Contribution amount is too low!');
        })

        // test to check if project state changes to 'Successful' after target contribution is reached
        it("State should change to Successful if targeted amount hit", async () => {
            await projectContract.connect(address1).contribute({value:etherToWei('12')}); // contribute 12 ether to exceed the target
            expect(Number(await projectContract.completeAt())).to.greaterThan(0); // ensure the project is marked complete
            expect(await projectContract.state()).to.equal(+2); // check that state is '2' (successful)
        })
    })

    // test suite for withdraw request functionality
    describe("Create withdraw request", async function () {
      
        // test to ensure only the owner can create a withdraw request
        it("should fail if someone else try to request (Only owner can make request) ", async() => {
        await 
        expect(projectContract.connect(address2).createWithdrawRequest("Testing description", etherToWei('2'),address2.address)).to.be.revertedWith('You dont have access to perform this operation!');
        
      })

        // test to ensure withdraw request can't be made before project completion
        it("Withdraw request should fail if status not equal to succesful", async () => {
        await
        expect(projectContract.connect(address1).createWithdrawRequest("Testing description", etherToWei('2'),address1.address)).to.be.revertedWith('Invalid state');

        })

        // test to successful withdraw request creation
        it("Request for withdraw", async () =>{
          await
          projectContract.connect(address1).contribute({value:etherToWei("12")}); // contribute to mark the project successful

          const withdrawRequest = await
                projectContract.connect(address1).createWithdrawRequest("Testing description",etherToWei('2'),address1.address) // create a withdraw request

          const event = await withdrawRequest.wait();

          expect(event.logs.length).to.equal(1); // ensure event is emitted
          const decodedEvent = projectContract.interface.decodeEventLog("WithdrawRequestCreated", event.logs[0].data,event.logs[0].topics);

          //Test event
          expect(decodedEvent.description).to.equal("Testing description");
          expect(decodedEvent.amount).to.equal(etherToWei('2'));
          expect(decodedEvent.noOfVotes).to.equal(0);
          expect(decodedEvent.isCompleted).to.equal(false);
          expect(decodedEvent.recipient).to.equal(address1.address);
          })
      })
    
    // test suite for voting functionality in withdraw requests
    describe("Vote for withdraw request", async function () {

        // test to ensure only contributors can vote
        it("Only contributors can vote" , async () =>{
          await
          projectContract.connect(address1).contribute({value:etherToWei('12')});
          await
          projectContract.connect(address1).createWithdrawRequest("Testing description", etherToWei('2'),address1.address)
          await
          expect(projectContract.connect(address2).voteWithdrawRequest(0)).to.be.revertedWith('Only contributors can vote!');

        })

        // test for successful voting by contributors
        it("Vote withdraw request", async () => {
          await
          projectContract.connect(address1).contribute({value:etherToWei('6')}); // contribute to the project
          await
          projectContract.connect(address2).contribute({value:etherToWei('7')}); // another contributor
          await
          projectContract.connect(address1).createWithdrawRequest("Testing description",etherToWei('2'),address1.address) // create withdraw request
          const voteforWithdraw = await
                        projectContract.connect(address2).voteWithdrawRequest(0) // vote on the withdraw request
          const event = await 
                        voteforWithdraw.wait();
          
          expect(event.logs.length).to.equal(1);
          const decodedEvent = projectContract.interface.decodeEventLog("WithdrawVote", event.logs[0].data,event.logs[0].topics);

          // Test event
          expect(decodedEvent.voter).to.equal(address2.address);
          expect(Number(decodedEvent.totalVote)).to.equal(1); // ensure total votes incremented

        })
        
        // test to ensure that contributors can't vote twice on the same request
        it("Should fail if request already vote", async() =>{
        
      await
        projectContract.connect(address1).contribute({value:etherToWei('6')}); // first contribution
      await
        projectContract.connect(address2).contribute({value:etherToWei('7')}); // second contribution
      await
        projectContract.connect(address1).createWithdrawRequest("Testing description",etherToWei('2'),address1.address) // withdraw request
      await
        projectContract.connect(address2).voteWithdrawRequest(0) // first vote

      await expect(projectContract.connect(address2).voteWithdrawRequest(0)).to.be.revertedWith('You already voted!'); // ensure second vote reverts
     })
    })

    describe("Withdraw balance", async function () {

      it("Should fail if 50% contributor need to voted", async () => {
        await 
          projectContract.connect(address1).contribute({value:etherToWei('6') });
        await
          projectContract.connect(address2).contribute({value:etherToWei('7') });
        await
          projectContract.connect(address1).createWithdrawRequest("Testing description", etherToWei('2'),address1.address)
        await
        expect(projectContract.connect(address1).withdrawRequestedAmount(0)).to.be.revertedWith('At least 50% of the contributors need to vote for this request');

      })

      it("Withdraw requested balance", async () =>{

        await 
          projectContract.connect(address1).contribute({value:etherToWei('6')});
        await 
          projectContract.connect(address2).contribute({value:etherToWei('7')});
        await
          projectContract.connect(address1).createWithdrawRequest("Testing description", etherToWei('2'), address1.address)
        await 
          projectContract.connect(address1).voteWithdrawRequest(0)
        await
          projectContract.connect(address2).voteWithdrawRequest(0)

        const withdrawAmount = await
                        projectContract.connect(address1).withdrawRequestedAmount(0);
        const event = await withdrawAmount.wait();

        expect(event.logs.length).to.equal(1);
        const decodedEvent = projectContract.interface.decodeEventLog("AmountWithdrawSuccessful", event.logs[0].data,event.logs[0].topics);

        // test event: 


        expect(decodedEvent.amount).to.equal(etherToWei('2'));
        expect(decodedEvent.noOfVotes).to.equal(2);
        expect(decodedEvent.isCompleted).to.equal(true);
        expect(decodedEvent.recipient).to.equal(address1.address);
      })


      it("Should fail if request already completed", async() => {
        await
          projectContract.connect(address1).contribute({value:etherToWei('6')});
        await
          projectContract.connect(address2).contribute({value:etherToWei('7')});
        await
          projectContract.connect(address1).createWithdrawRequest("Testing description",etherToWei('2'),address1.address)
        await 
          projectContract.connect(address1).voteWithdrawRequest(0)
        await 
          projectContract.connect(address2).voteWithdrawRequest(0)
        await 
          projectContract.connect(address1).withdrawRequestedAmount(0);
        await
        expect(projectContract.connect(address1).withdrawRequestedAmount(0)).to.be.revertedWith('Request already completed');

      })
    })
})