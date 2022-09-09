const { time } = require("@openzeppelin/test-helpers");

const makeUnixTime = async (period, value) => {
  const latestBlock = await web3.eth.getBlock("latest");

  return latestBlock.timestamp + time.duration[period](value).toNumber();
};

module.exports = { makeUnixTime };
