const { expect } = require("../chai.config");
const env = require("../../env");

const AlphaToken = artifacts.require("AlphaToken");

contract("Alpha Token", ([deployer, alice]) => {
  beforeEach(async () => {
    this.token = await AlphaToken.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);
  });

  describe("Token attributes:", () => {
    it("should be able to provide the correct token name", async () => {
      expect(this.token.name()).to.eventually.be.equal(env.TOKEN_NAME);
    });

    it("should be able to provide the correct token symbol", async () => {
      expect(this.token.symbol()).to.eventually.be.equal(env.TOKEN_SYMBOL);
    });

    it("should be able to provide the correct token decimals", async () => {
      expect(this.token.decimals()).to.eventually.be.a.bignumber.equal(18);
    });
  });
});
