const LambdaToken = artifacts.require("LambdaToken.sol");
const LambdaTokenCrowdsale = artifacts.require("LambdaTokenCrowdsale.sol");

const env = require("../env");

module.exports = async (deployer) => {
  const [_, wallet] = await web3.eth.getAccounts();

  try {
    await deployer.deploy(
      LambdaTokenCrowdsale,
      env.TOKEN_RATE,
      wallet,
      env.TOKEN_CAP,
      env.INDIVIDUAL_MIN_CAP,
      env.INDIVIDUAL_MAX_CAP,
      env.CROWDSALE_OPENING_TIME,
      env.CROWDSALE_CLOSING_TIME,
      LambdaToken.address
    );
  } catch (error) {
    console.log(error);
  }
};
