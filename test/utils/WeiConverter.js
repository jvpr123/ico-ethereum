const web3 = require("web3");
const { BN } = require("./BigNumber");

const toWei = (value) => BN(web3.utils.toWei(value.toString(), "ether"));

module.exports = { toWei };
