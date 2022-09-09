const DeltaToken = artifacts.require("DeltaToken.sol");
const env = require("../env");

module.exports = async (deployer) => {
  await deployer.deploy(DeltaToken, env.TOKEN_NAME, env.TOKEN_SYMBOL);
};
