  
const DAO = artifacts.require("DAO");

module.exports = function(deployer) {
  const voteTime = 60;
  const quorum = 50;
  
  deployer.deploy(DAO, voteTime, quorum);
};