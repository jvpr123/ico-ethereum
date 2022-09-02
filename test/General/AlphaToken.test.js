const { expect } = require("../chai.config");
const BN = require("../utils/BigNumber");
const env = require("../../env");

const AlphaToken = artifacts.require("AlphaToken");

contract("Alpha Token", ([deployer, alice]) => {
  beforeEach(async () => {
    this.token = await AlphaToken.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);
  });

  describe("Token attributes:", () => {
    it("should return the correct token name", async () => {
      return expect(this.token.name()).to.eventually.be.equal(env.TOKEN_NAME);
    });

    it("should return the correct token symbol", async () => {
      return expect(this.token.symbol()).to.eventually.be.equal(
        env.TOKEN_SYMBOL
      );
    });

    it("should return the correct token decimals", async () => {
      return expect(this.token.decimals()).to.eventually.be.a.bignumber.equal(
        BN(env.TOKEN_DECIMALS)
      );
    });
  });
});
