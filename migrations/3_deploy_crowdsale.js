const DeltaToken = artifacts.require("DeltaToken.sol");
const DeltaTokenCrowdsale = artifacts.require("DeltaTokenCrowdsale.sol");

const env = require("../env");

module.exports = async (deployer) => {
  const [_, wallet] = await web3.eth.getAccounts();

  try {
    await deployer.deploy(
      DeltaTokenCrowdsale,
      env.TOKEN_RATE,
      wallet,
      env.TOKEN_CAP,
      env.INDIVIDUAL_MIN_CAP,
      env.INDIVIDUAL_MAX_CAP,
      env.CROWDSALE_OPENING_TIME,
      env.CROWDSALE_CLOSING_TIME,
      DeltaToken.address
    );
  } catch (error) {
    console.log(error);
  }
};
