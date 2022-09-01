const chai = require("chai");
const web3 = require("web3");
const chaiBN = require("chai-bn")(web3.utils.BN);
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiBN);
chai.use(chaiAsPromised);

module.exports = chai;
