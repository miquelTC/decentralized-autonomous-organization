  
const DAO = artifacts.require("DAO");

module.exports = function(deployer) {
  const voteTime = 86400;
  const quorum = 50;
  
  deployer.deploy(DAO, voteTime, quorum);
};