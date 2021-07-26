// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * DAO contract:
 * 1. Collects investors money (ether) & allocate shares
 * 2. Keep track of investor contributions with shares
 * 3. Allow investors to transfer shares
 * 4. allow investment proposals to be created and voted
 * 5. execute successful investment proposals (i.e send money)
 */

contract DAO {  
  struct Proposal {
    uint id;
    string name;
    uint amount;
    address payable recipient;
    uint votes;
    uint end;
    bool executed;
  }

  mapping(address => bool) public investors;
  mapping(address => uint) public shares;
  mapping(address => mapping(uint => bool)) public votes;
  mapping(uint => Proposal) public proposals;
  uint public totalShares;
  uint public availableFunds;
  uint public contributionEnd;
  uint public nextProposalId;
  uint public voteTime;
  uint public quorum;
  address public admin;

  event Shares(uint shares, uint totalShares);
  event Funds(uint availableFunds);
  event Votes(uint id, uint votes);
  event ExecuteProposal(uint id);
  event NewProposal(
    uint id,
    string name,
    uint amount,
    address payable recipient,
    uint votes,
    uint end,
    bool executed
  );

  constructor(uint contributionTime, uint _voteTime, uint _quorum) {
    require(_quorum > 0 && _quorum < 100, 'quorum must be between 0 and 100');
    contributionEnd = block.timestamp + contributionTime;
    voteTime = _voteTime;
    quorum = _quorum;
    admin = msg.sender;
  }

  function contribute() payable external {
    require(block.timestamp < contributionEnd, 'cannot contribute after contributionEnd');
    investors[msg.sender] = true;
    shares[msg.sender] += msg.value;
    totalShares += msg.value;
    availableFunds += msg.value;
    emit Shares(shares[msg.sender], totalShares);
    emit Funds(availableFunds);
  }

  function redeemShare(uint amount) external {
    require(shares[msg.sender] >= amount, 'not enough shares');
    require(availableFunds >= amount, 'not enough available funds');
    shares[msg.sender] -= amount;
    totalShares -= amount;
    availableFunds -= amount;
    payable(msg.sender).transfer(amount);
    emit Shares(shares[msg.sender], totalShares);
    emit Funds(availableFunds);
  }

  function transferShare(uint amount, address to) external {
    require(shares[msg.sender] >= amount, 'not enough shares');
    shares[msg.sender] -= amount;
    shares[to] += amount;
    investors[to] = true;
    emit Shares(shares[msg.sender], totalShares);
  }

  function createProposal(string memory name, uint amount, address payable recipient) public onlyInvestors() {
    require(availableFunds >= amount, 'not enough available funds');
    proposals[nextProposalId] = Proposal(
      nextProposalId,
      name,
      amount,
      recipient,
      0,
      block.timestamp + voteTime,
      false
    );    
    availableFunds -= amount;
    emit Funds(availableFunds);
    emit NewProposal(nextProposalId, name, amount, recipient, 0, block.timestamp + voteTime, false);
    nextProposalId ++;
  }

  function vote(uint proposalId) external onlyInvestors() {
    Proposal storage proposal = proposals[proposalId];
    require(votes[msg.sender][proposalId] == false, 'investor can only vote once per proposal');
    require(block.timestamp < proposal.end, 'can only vote until proposal end date');
    votes[msg.sender][proposalId] = true;
    proposal.votes += shares[msg.sender];
    emit Votes(proposalId, proposal.votes);
  }

  function executeProposal(uint proposalId) external onlyAdmin {
    Proposal storage proposal = proposals[proposalId];
    require(block.timestamp >= proposal.end, 'the voting period is still not over');
    require(proposal.executed == false, 'cannot execute proposal already executed');
    require((proposal.votes * 100 / totalShares) >= quorum, 'cannot execute proposal with votes # below quorum');
    _transferEther(proposal.amount, proposal.recipient);
    proposal.executed = true;
    emit ExecuteProposal(proposalId);
  }

  function withdrawEther(uint amount, address payable to) external onlyAdmin {    
    availableFunds -= amount;
    _transferEther(amount, to);
    emit Funds(availableFunds);
  }

  function _transferEther(uint amount, address payable to) internal {
    require(availableFunds >= amount, 'not enough availableFunds');    
    to.transfer(amount);
  }

  // For ether returns of proposal investment
  receive() external payable {
    availableFunds += msg.value;
    emit Funds(availableFunds);
  }

  modifier onlyInvestors() {
    require(investors[msg.sender] ==true, 'only investors');
    _;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, 'only admin');
    _;
  }
}