var SupplyChainFactory = artifacts.require("./SupplyChainFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChainFactory);
};
