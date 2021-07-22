  
const DAO = artifacts.require("DAO");

module.exports = function(deployer) {
  const contributionTime = 86400;
  const voteTime = 86400;
  const quorum = 50;
  
  deployer.deploy(DAO, contributionTime, voteTime, quorum);
};