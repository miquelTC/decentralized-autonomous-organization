  
const DAO = artifacts.require("DAO");

module.exports = function(deployer) {
  const contributionTime = 3600;
  const voteTime = 3600;
  const quorum = 50;
  
  deployer.deploy(DAO, contributionTime, voteTime, quorum);
};