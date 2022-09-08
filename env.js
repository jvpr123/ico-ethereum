const { BN } = require("./test/utils/BigNumber");
const { toWei } = require("./test/utils/WeiConverter");

module.exports = {
  TOKEN_NAME: "Beta Token",
  TOKEN_SYMBOL: "BTK",
  TOKEN_DECIMALS: BN(18),
  TOKEN_RATE: BN(1),
  TOKEN_CAP: toWei(200),
  INDIVIDUAL_MIN_CAP: toWei(0.002),
  INDIVIDUAL_MAX_CAP: toWei(100),
};
