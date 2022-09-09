const Token = artifacts.require("DeltaToken.sol");
const env = require("../../../env");

const makeERC20Token = async () =>
  await Token.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);

module.exports = { makeERC20Token };
