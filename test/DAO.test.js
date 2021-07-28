const { expectRevert, time } = require('@openzeppelin/test-helpers');
const DAO = artifacts.require('DAO');

contract('DAO', (accounts) => {
  let dao;

  const [investor1, investor2, investor3] = [accounts[1], accounts[2], accounts[3]];
  before(async () => {
    dao = await DAO.new(20, 50);
  });

  describe('Contribution', () => {
    it('Should accept contribution', async () => {
      await dao.contribute({from: investor1, value: 100});
      await dao.contribute({from: investor2, value: 200});      
      
      const shares1 = await dao.shares(investor1);
      const shares2 = await dao.shares(investor2);
      const isInvestor1 = await dao.investors(investor1);
      const isInvestor2 = await dao.investors(investor2);
      const totalShares = await dao.totalShares();
      const availableFunds = await dao.availableFunds();

      assert(shares1.toNumber() === 100 );
      assert(shares2.toNumber() === 200 );
      assert(isInvestor1 === true);
      assert(isInvestor2 === true);
      assert(totalShares.toNumber() === 300);
      assert(availableFunds.toNumber() === 300);
    });

    it('Emits Events Shares and Funds', async() => {
      const result = await dao.contribute({from: investor3, value: 300});
      const eventShares = result.logs[0].args;
      const eventFunds = result.logs[1].args;
      assert(eventShares.shares.toNumber() === 300);
      assert(eventShares.totalShares.toNumber() === 600);
      assert(eventFunds.availableFunds.toNumber() === 600);
    });
  });

  describe('Redeem Shares', () => {
    it('Should redeem shares', async() => {
      await dao.contribute({from: investor1, value: 100});
      const sharesBefore = await dao.shares(investor1);
      const fundsBefore = await dao.availableFunds();
      await dao.redeemShare(100, {from: investor1});
      const sharesAfter = await dao.shares(investor1);
      const fundsAfter = await dao.availableFunds();
      assert(sharesBefore.toNumber() - sharesAfter.toNumber() == 100);
      assert(fundsBefore.toNumber() - fundsAfter.toNumber() == 100);
    });

    it('Should NOT redeem shares if not enough shares', async() => {
      await expectRevert(
        dao.redeemShare(200, {from: investor1}),
        'not enough shares'
      );
    });

    it('Should NOT redeem shares if not enough funds', async() => {
      await dao.withdrawEther(600, investor1);
      await expectRevert(        
        dao.redeemShare(50, {from: investor1}),
        'not enough available funds'
      );
      await web3.eth.sendTransaction({from: investor1, to: dao.address, value: 600 });
    });

    it('Emits Events Shares and Funds', async() => {
      const result = await dao.redeemShare(10, {from: investor1});
      const eventShares = result.logs[0].args;
      const eventFunds = result.logs[1].args;
      const shares = await dao.shares(investor1);
      const totalShares = await dao.totalShares();
      const availableFunds = await dao.availableFunds();
      assert(eventShares.shares.toNumber() === shares.toNumber());
      assert(eventShares.totalShares.toNumber() === totalShares.toNumber());
      assert(eventFunds.availableFunds.toNumber() === availableFunds.toNumber());
    });
  });

  describe('Transfer Shares', () => {
    it('Should transfer shares', async() => {
      const investor1SharesBefore = await dao.shares(investor1);
      const investor2SharesBefore = await dao.shares(investor2);
      await dao.transferShare(10, investor2, {from: investor1});
      const investor1SharesAfter = await dao.shares(investor1);
      const investor2SharesAfter = await dao.shares(investor2);
      assert(investor1SharesBefore.toNumber() - investor1SharesAfter.toNumber() == 10);
      assert(investor2SharesAfter.toNumber() - investor2SharesBefore.toNumber() == 10);
    });

    it('Should NOT transfer if not enough shares', async() => {
      await expectRevert(        
        dao.transferShare(500, investor2, {from: investor1}),
        'not enough shares'
      );
    });

    it('Emits Event Shares', async() => {
      const result = await dao.transferShare(10, investor2, {from: investor1});
      const eventShares = result.logs[0].args;
      const shares = await dao.shares(investor1);
      const totalShares = await dao.totalShares();
      assert(eventShares.shares.toNumber() === shares.toNumber());
      assert(eventShares.totalShares.toNumber() === totalShares.toNumber());
    });
  });

  describe('Create Proposal', () => {
    it('Should create proposal', async () => {
      await dao.createProposal('proposal 1', 100, accounts[8], {from: investor1});
      const proposal = await dao.proposals(0);
      assert(proposal.name === 'proposal 1');
      assert(proposal.recipient === accounts[8]);
      assert(proposal.amount.toNumber() === 100);
      assert(proposal.votes.toNumber() === 0);
      assert(proposal.status.toNumber() === 0);
    });

    it('Should NOT create proposal if not from investor', async () => {
      await expectRevert(
        dao.createProposal('proposal 2', 10, accounts[8], {from: accounts[5]}),
        'only investors'
      );
    });

    it('Should NOT create proposal if amount too big', async () => {
      await expectRevert(
        dao.createProposal('proposal 2', 1000, accounts[8], {from: investor1}),
        'not enough available funds'
      );
    });

    it('Emits Events Funds and NewProposal', async() => {
      const result = await dao.createProposal('proposal 2', 100, accounts[8], {from: investor1});
      const eventFunds = result.logs[0].args;
      const eventNewProposal = result.logs[1].args;
      const availableFunds = await dao.availableFunds();
      assert(eventFunds.availableFunds.toNumber() === availableFunds.toNumber());
      assert(eventNewProposal.name === 'proposal 2');
      assert(eventNewProposal.recipient === accounts[8]);
      assert(eventNewProposal.amount.toNumber() === 100);
      assert(eventNewProposal.votes.toNumber() === 0);
      assert(eventNewProposal.status.toNumber() === 0);
    });
  });
  
  describe('Vote', () => {
    it('Should vote', async () => {
      await dao.vote(1, {from: investor1});
      const votes = await dao.votes(investor1, 1);
      assert(votes == true);
    });
  
    it('Should NOT vote if not investor', async () => {
      await expectRevert(
        dao.vote(1, {from: accounts[8]}), 
        'only investors'
      );
    });
  
    it('Should NOT vote if already voted', async () => {
      await expectRevert(
        dao.vote(1, {from: investor1}), 
        'investor can only vote once per proposal'
      );
    });

    it('Emits Event Votes', async() => {
      const result = await dao.vote(1, {from: investor2});
      const event = result.logs[0].args;
      const proposal = await dao.proposals(1);
      assert(event.votes.toNumber() === proposal.votes.toNumber());
    });
  
    it('Should NOT vote if after proposal end date', async () => {
      await time.increase(2001); 
      expectRevert(
        dao.vote(1, {from: investor3}), 
        'can only vote until proposal end date'
      );
    });
  });

  describe('Execute Proposal', () => {
    it('Should execute proposal', async () => {
      await dao.createProposal('proposal 3', 100, accounts[8], {from: investor1});
      //total shares = 600. 50% * 600 = 300
      await dao.vote(2, {from: investor1}); //100 shares
      await dao.vote(2, {from: investor3}); //300 shares
      await time.increase(2001);
      await dao.executeProposal(2);
      const proposal = await dao.proposals(2);
      assert(proposal.status.toNumber() == 1);
    });
  
    it('Should reject proposal', async () => {
      await dao.createProposal('proposal 4', 100, accounts[8], {from: investor1});
      //total shares = 600. 50% * 600 = 300
      await dao.vote(3, {from: investor1}); //100 shares
      await time.increase(2001);
      const fundsBefore = await dao.availableFunds();
      await await dao.executeProposal(3);
      const proposal = await dao.proposals(3);
      const fundsAfter = await dao.availableFunds();
      assert(proposal.status.toNumber() == 2);
      assert(fundsAfter.toNumber() - fundsBefore.toNumber() == 100);
    });
  
    it('Should NOT execute proposal twice', async () => {
      await expectRevert(
        dao.executeProposal(3),
        'cannot execute proposal already executed'
      );  
    });
  
    it('Should NOT execute proposal before end date', async () => {
      await dao.createProposal('proposal 5', 50, accounts[8], {from: investor1});
      await dao.vote(4, {from: investor1});
      await dao.vote(4, {from: investor2});
      expectRevert(
        dao.executeProposal(4),
        'the voting period is still not over'
      );
    });

    it('Emits Event Funds and ExecuteProposal', async() => {
      await dao.createProposal('proposal 6', 50, accounts[8], {from: investor1});
      await dao.vote(5, {from: investor1});
      await dao.vote(5, {from: investor3});
      await time.increase(2001);
      const result = await dao.executeProposal(5);
      const availableFunds = await dao.availableFunds();
      const eventFund = result.logs[0].args;
      const eventExecuteProposal = result.logs[1].args;
      assert(eventFund.availableFunds.toNumber() === availableFunds.toNumber());
      assert(eventExecuteProposal.status.toNumber() === 1);
    });
  });

  describe('Withdraw Ether', () => {
    it('Should withdraw ether', async () => {
      const balanceBefore = await web3.eth.getBalance(accounts[8]);
      const fundsBefore = await dao.availableFunds();
      await dao.withdrawEther(10, accounts[8]);
      const balanceAfter = await web3.eth.getBalance(accounts[8]);
      const fundsAfter = await dao.availableFunds();
      balanceAfterBN = web3.utils.toBN(balanceAfter);
      balanceBeforeBN = web3.utils.toBN(balanceBefore);
      assert(balanceAfterBN.sub(balanceBeforeBN).toNumber() == 10);
      assert(fundsBefore.toNumber() - fundsAfter.toNumber() == 10);
    });
  
    it('Should NOT withdraw ether if not admin', async () => {
      await expectRevert(
        dao.withdrawEther(10, accounts[8], {from: investor1}),
        'only admin'
      );
    });
  
    it('Should NOT withdraw ether if trying to withdraw too much', async () => {
      await expectRevert(
        dao.withdrawEther(1000, accounts[8]),
        'not enough available funds'
      );
    });

    it('Emits Event Funds', async () => {
      const result = await dao.withdrawEther(10, accounts[8]);
      const funds = await dao.availableFunds();
      const event = result.logs[0].args;
      assert(event.availableFunds.toNumber() === funds.toNumber());
    });
  });

  describe('Set Admin', () => {
    it('transfer Admin rights', async() => {
      await dao.setAdmin(investor1);
      const admin = await dao.admin();
      assert(admin == investor1);
    });
  });
});