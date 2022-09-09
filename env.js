const moment = require("moment");
const { BN } = require("./test/utils/helpers/BigNumber");
const { toWei } = require("./test/utils//helpers/WeiConverter");

module.exports = {
  TOKEN_NAME: "Lambda Token",
  TOKEN_SYMBOL: "DLT",
  TOKEN_DECIMALS: BN(18),
  TOKEN_RATE: BN(1),
  TOKEN_CAP: toWei(200),
  INDIVIDUAL_MIN_CAP: toWei(0.002),
  INDIVIDUAL_MAX_CAP: toWei(100),
  CROWDSALE_OPENING_TIME: BN(moment().add(1, "weeks").unix()),
  CROWDSALE_CLOSING_TIME: BN(moment().add(2, "weeks").unix()),
};
