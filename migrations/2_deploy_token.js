const LambdaToken = artifacts.require("LambdaToken.sol");
const env = require("../env");

module.exports = async (deployer) => {
  await deployer.deploy(LambdaToken, env.TOKEN_NAME, env.TOKEN_SYMBOL);
};
