const Crowdsale = artifacts.require("GammaTokenCrowdsale.sol");
const env = require("../../../env");

const makeCrowdsale = async (token, wallet, openingTime, closingTime) =>
  await Crowdsale.new(
    env.TOKEN_RATE,
    wallet,
    env.TOKEN_CAP,
    env.INDIVIDUAL_MIN_CAP,
    env.INDIVIDUAL_MAX_CAP,
    openingTime,
    closingTime,
    token.address
  );

module.exports = { makeCrowdsale };
