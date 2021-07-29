  
const DAO = artifacts.require("DAO");

module.exports = function(deployer) {
  const voteTime = 3600;
  const quorum = 50;
  
  deployer.deploy(DAO, voteTime, quorum);
};