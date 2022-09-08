const BetaToken = artifacts.require("BetaToken.sol");
const env = require("../env");

module.exports = async (deployer) => {
  await deployer.deploy(BetaToken, env.TOKEN_NAME, env.TOKEN_SYMBOL);
};
