const Token = artifacts.require("GammaToken.sol");
const env = require("../../../env");

const makeERC20Token = async () =>
  await Token.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);

module.exports = { makeERC20Token };
