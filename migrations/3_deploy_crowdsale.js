const AlphaToken = artifacts.require("AlphaToken.sol");
const AlphaTokenCrowdsale = artifacts.require("AlphaTokenCrowdsale.sol");

const env = require("../env");

module.exports = async (deployer) => {
  const [_, wallet] = await web3.eth.getAccounts();
  await deployer.deploy(
    AlphaTokenCrowdsale,
    env.TOKEN_RATE,
    wallet,
    AlphaToken.address
  );
};
