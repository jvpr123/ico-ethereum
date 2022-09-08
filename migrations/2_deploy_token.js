const GammaToken = artifacts.require("GammaToken.sol");
const env = require("../env");

module.exports = async (deployer) => {
  await deployer.deploy(GammaToken, env.TOKEN_NAME, env.TOKEN_SYMBOL);
};
