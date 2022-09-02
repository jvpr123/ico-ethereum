const { expect } = require("../chai.config");
const BN = require("../utils/BigNumber");
const env = require("../../env");

const AlphaTokenCrowdsale = artifacts.require("AlphaTokenCrowdsale");
const AlphaToken = artifacts.require("AlphaToken");

contract("AlphaTokenCrowdsale", ([_deployer, wallet]) => {
  beforeEach(async () => {
    this.token = await AlphaToken.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);
    this.crowdSale = await AlphaTokenCrowdsale.new(
      env.TOKEN_RATE,
      wallet,
      this.token.address
    );
  });

  describe("Crowdsale attributes:", () => {
    it("should track the correct token rate", async () => {
      return expect(this.crowdSale.rate()).to.eventually.be.a.bignumber.equal(
        BN(env.TOKEN_RATE)
      );
    });

    it("should track the correct wallet address", async () => {
      return expect(this.crowdSale.wallet()).to.eventually.be.equal(wallet);
    });

    it("should track the correct token address", async () => {
      return expect(this.crowdSale.token()).to.eventually.be.equal(
        this.token.address
      );
    });
  });
});
