const web3 = require("web3");

const BN = (value) => {
  return web3.utils.toBN(value);
};

module.exports = { BN };
