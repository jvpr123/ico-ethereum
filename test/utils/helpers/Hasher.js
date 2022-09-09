const web3 = require("web3");

const hash = (value) => web3.utils.sha3(value);

module.exports = { hash };
