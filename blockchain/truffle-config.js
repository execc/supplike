const path = require("path");

module.exports = {
  compilers: {
    solc: {
      version: "0.6.8",
      docker: true
    }
  },
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/bytecode"),
  networks: {
    develop: {
      port: 8545
    }
  }
};
