const AlphaToken = artifacts.require("AlphaToken.sol");
const env = require("../env");

module.exports = function (deployer) {
  deployer.deploy(AlphaToken, env.TOKEN_NAME, env.TOKEN_SYMBOL);
};
