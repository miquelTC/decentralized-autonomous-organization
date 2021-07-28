// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAO {  
  enum Status { ongoing, executed, rejected }
  
  struct Proposal {
    uint id;
    string name;
    uint amount;
    address payable recipient;
    uint votes;
    uint end;
    Status status;
  }

  mapping(address => bool) public investors;
  mapping(address => uint) public shares;
  mapping(address => mapping(uint => bool)) public votes;
  mapping(uint => Proposal) public proposals;
  uint public totalShares;
  uint public availableFunds;
  uint public nextProposalId;
  uint public voteTime;
  uint public quorum;
  address public admin;

  event Shares(uint shares, uint totalShares);
  event Funds(uint availableFunds);
  event Votes(uint id, uint votes);
  event ExecuteProposal(uint id, Status status);
  event NewProposal(
    uint id,
    string name,
    uint amount,
    address payable recipient,
    uint votes,
    uint end,
    Status status
  );

  constructor(uint _voteTime, uint _quorum) {
    require(_quorum > 0 && _quorum < 100, 'quorum must be between 0 and 100');
    voteTime = _voteTime;
    quorum = _quorum;
    admin = msg.sender;
  }  

  function contribute() payable external {
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

  function createProposal(string memory name, uint amount, address payable recipient) public onlyInvestors {
    require(availableFunds >= amount, 'not enough available funds');
    proposals[nextProposalId] = Proposal(
      nextProposalId,
      name,
      amount,
      recipient,
      0,
      block.timestamp + voteTime,
      Status.ongoing
    );    
    availableFunds -= amount;
    emit Funds(availableFunds);
    emit NewProposal(nextProposalId, name, amount, recipient, 0, block.timestamp + voteTime, Status.ongoing);
    nextProposalId ++;
  }

  function vote(uint proposalId) external onlyInvestors {
    Proposal storage proposal = proposals[proposalId];
    require(votes[msg.sender][proposalId] == false, 'investor can only vote once per proposal');
    require(block.timestamp < proposal.end, 'can only vote until proposal end date');
    votes[msg.sender][proposalId] = true;
    proposal.votes += shares[msg.sender];
    emit Votes(proposalId, proposal.votes);
  }

  function executeProposal(uint proposalId) external {
    Proposal storage proposal = proposals[proposalId];
    require(block.timestamp >= proposal.end, 'the voting period is still not over');
    require(proposal.status == Status.ongoing, 'cannot execute proposal already executed');
    if((proposal.votes * 100 / totalShares) >= quorum) {
      _transferEther(proposal.amount, proposal.recipient);
      proposal.status = Status.executed;
    } else {
      availableFunds += proposal.amount;
      proposal.status = Status.rejected;
    }    
    emit Funds(availableFunds);
    emit ExecuteProposal(proposalId, proposal.status);
  }

  function withdrawEther(uint amount, address payable to) external onlyAdmin {    
    require(availableFunds >= amount, 'not enough available funds');
    availableFunds -= amount;
    _transferEther(amount, to);
    emit Funds(availableFunds);
  }

  function _transferEther(uint amount, address payable to) internal {    
    to.transfer(amount);
  }

  function setAdmin(address payable _admin) external onlyAdmin {
    admin = _admin;
  }

  // For ether returns of proposal investment
  receive() external payable {
    availableFunds += msg.value;
    emit Funds(availableFunds);
  }

  modifier onlyInvestors() {
    require(investors[msg.sender] == true, 'only investors');
    _;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, 'only admin');
    _;
  }
}