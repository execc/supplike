var SupplyChainFactory = artifacts.require("./SupplyChainFactory.sol");
var SupplyChainSimple = artifacts.require("./SupplyChainSimple.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChainFactory);
};
