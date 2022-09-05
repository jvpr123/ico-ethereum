const { expect } = require("../chai.config");
const { BN } = require("../utils/BigNumber");
const { hash } = require("../utils/Hasher");
const { toWei } = require("../utils/WeiConverter");

const AlphaTokenCrowdsale = artifacts.require("AlphaTokenCrowdsale.sol");
const AlphaToken = artifacts.require("AlphaToken.sol");
const env = require("../../env");

contract("AlphaTokenCrowdsale", ([deployer, wallet, investor]) => {
  const MINTER_ROLE = hash("MINTER_ROLE");

  beforeEach(async () => {
    this.token = await AlphaToken.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);
    this.crowdsale = await AlphaTokenCrowdsale.new(
      env.TOKEN_RATE,
      wallet,
      this.token.address
    );

    await this.token.grantRole(MINTER_ROLE, this.crowdsale.address, {
      from: deployer,
    });
  });

  describe("Crowdsale attributes:", () => {
    it("should track the correct token rate", async () => {
      return expect(this.crowdsale.rate()).to.eventually.be.a.bignumber.equal(
        BN(env.TOKEN_RATE)
      );
    });

    it("should track the correct wallet address", async () => {
      return expect(this.crowdsale.wallet()).to.eventually.be.equal(wallet);
    });

    it("should track the correct token address", async () => {
      return expect(this.crowdsale.token()).to.eventually.be.equal(
        this.token.address
      );
    });

    it("payment", async () => {
      await this.crowdsale.sendTransaction({ from: investor, value: toWei(1) });
    });
  });
});
