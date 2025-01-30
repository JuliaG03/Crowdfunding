const { expect } = require("chai");
const { ethers } = require("hardhat");
const etherToWei = (n) =>{
  return ethers.parseUnits(n,'ether')
}
const dateToUNIX = (date) => {
  return Math.round(new Date(date).getTime() / 1000).toString()
}
describe("Project", () => {
    var address1; 
    var address2; 
    var projectContract;
    
    beforeEach(async function () {
      [address1, address2,  ...address] = await ethers.getSigners();
      const creator = address1.address;
      const minimumContribution = etherToWei("1");
      const deadline = dateToUNIX('2026-10-22');
      
      const targetContribution = etherToWei("10");
      const projectTitle = "Testing project";
      const projectDes = "Testing project description"
  
      const Project = await ethers.getContractFactory("Project");
      projectContract = await Project.deploy(creator,minimumContribution,deadline,targetContribution,projectTitle,projectDes);
    })
    describe("Check project variables & Contribute", async function () {
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
        it("Contribute", async function () {
            const project = await projectContract.connect(address1).contribute({value:etherToWei('4')});
            const event = await project.wait();
            
            expect(event.logs.length).to.equal(1);

            // Decode event
            const decodedEvent = projectContract.interface.decodeEventLog("FundingReceived", event.logs[0].data, event.logs[0].topics);
            
            // Test Event
            expect(decodedEvent.contributor).to.equal(address1.address);
            expect(decodedEvent.amount).to.equal(etherToWei('4'));
            expect(decodedEvent.currentTotal).to.equal(etherToWei('4'));
            expect(await projectContract.noOfContributers()).to.equal(1);
            expect(await projectContract.getContractBalance()).to.equal(etherToWei('4'));            
            
        })
        it("Should fail if amount is less than minimum contribution amount", async () => {
            await expect(projectContract.connect(address1).contribute({value:etherToWei('0.5')})).to.be.revertedWith('Contribution amount is too low!');
        })
        it("State should change to Successful if targeted amount hit", async () => {
            await projectContract.connect(address1).contribute({value:etherToWei('12')});
            expect(Number(await projectContract.completeAt())).to.greaterThan(0);
            expect(await projectContract.state()).to.equal(+2);
        })
    })


    describe("Create withdraw request", async function () {
      it("should fail if someone else try to request (Only owner can make request) ", async() => {
        await 
        expect(projectContract.connect(address2).createWithdrawRequest("Testing description", etherToWei('2'),address2.address)).to.be.revertedWith('You dont have access to perform this operation!');
        
      })

      it("Withdraw request should fail if status not equal to succesful", async () => {
        await
        expect(projectContract.connect(address1).createWithdrawRequest("Testing description", etherToWei('2'),address1.address)).to.be.revertedWith('Invalid state');

        })

        it("Request for withdraw", async () =>{
          await
          projectContract.connect(address1).contribute({value:etherToWei("12")});

          const withdrawRequest = await
                projectContract.connect(address1).createWithdrawRequest("Testing description",etherToWei('2'),address1.address)

          const event = await withdrawRequest.wait();

          expect(event.logs.length).to.equal(1);
          const decodedEvent = projectContract.interface.decodeEventLog("WithdrawRequestCreated", event.logs[0].data,event.logs[0].topics);

          //Test event:

          
          expect(decodedEvent.description).to.equal("Testing description");

          expect(decodedEvent.amount).to.equal(etherToWei('2'));

          expect(decodedEvent.noOfVotes).to.equal(0);
          expect(decodedEvent.isCompleted).to.equal(false);
            
          expect(decodedEvent.recipient).to.equal(address1.address);
          })
      })
    
    describe("Vote for withdraw request", async function () {

        it("Only contributors can vote" , async () =>{
          await
          projectContract.connect(address1).contribute({value:etherToWei('12')});
          await
          projectContract.connect(address1).createWithdrawRequest("Testing description", etherToWei('2'),address1.address)
          await
          expect(projectContract.connect(address2).voteWithdrawRequest(0)).to.be.revertedWith('Only contributors can vote!');

        })

        it("Vote withdraw request", async () => {
          await
          projectContract.connect(address1).contribute({value:etherToWei('6')});
          await
          projectContract.connect(address2).contribute({value:etherToWei('7')});
          await
          projectContract.connect(address1).createWithdrawRequest("Testing description",etherToWei('2'),address1.address)
          const voteforWithdraw = await
                        projectContract.connect(address2).voteWithdrawRequest(0)
          const event = await 
                        voteforWithdraw.wait();
          
          expect(event.logs.length).to.equal(1);
          const decodedEvent = projectContract.interface.decodeEventLog("WithdrawVote", event.logs[0].data,event.logs[0].topics);

          //Test event: 

        //  expect(decodedEvent.event).to.equal("WithdrawVote");

          expect(decodedEvent.voter).to.equal(address2.address);
          expect(Number(decodedEvent.totalVote)).to.equal(1);

        })

        it("Should fail if request already vote", async() =>{
        
      await
        projectContract.connect(address1).contribute({value:etherToWei('6')});
      await
        projectContract.connect(address2).contribute({value:etherToWei('7')});
      await
        projectContract.connect(address1).createWithdrawRequest("Testing description",etherToWei('2'),address1.address)
      await
        projectContract.connect(address2).voteWithdrawRequest(0)
      
      await expect(projectContract.connect(address2).voteWithdrawRequest(0)).to.be.revertedWith('You already voted!');
     })
    })


    describe("Withdraw balance", async function () {
    })
})