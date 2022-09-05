const AlphaToken = artifacts.require("AlphaToken.sol");
const env = require("../env");

module.exports = async (deployer) => {
  await deployer.deploy(AlphaToken, env.TOKEN_NAME, env.TOKEN_SYMBOL);
};
