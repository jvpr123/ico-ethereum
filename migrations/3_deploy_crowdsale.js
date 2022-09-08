const GammaToken = artifacts.require("GammaToken.sol");
const GammaTokenCrowdsale = artifacts.require("GammaTokenCrowdsale.sol");

const env = require("../env");

module.exports = async (deployer) => {
  const [_, wallet] = await web3.eth.getAccounts();
  await deployer.deploy(
    GammaTokenCrowdsale,
    env.TOKEN_RATE,
    wallet,
    env.TOKEN_CAP,
    env.INDIVIDUAL_MIN_CAP,
    env.INDIVIDUAL_MAX_CAP,
    GammaToken.address
  );
};
