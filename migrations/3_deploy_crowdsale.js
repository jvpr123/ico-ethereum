const BetaToken = artifacts.require("BetaToken.sol");
const BetaTokenCrowdsale = artifacts.require("BetaTokenCrowdsale.sol");

const env = require("../env");

module.exports = async (deployer) => {
  const [_, wallet] = await web3.eth.getAccounts();
  await deployer.deploy(
    BetaTokenCrowdsale,
    env.TOKEN_RATE,
    wallet,
    BetaToken.address
  );
};
