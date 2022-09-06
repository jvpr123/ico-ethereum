const { expect } = require("../chai.config");
const { BN } = require("../utils/BigNumber");
const { hash } = require("../utils/Hasher");
const { toWei } = require("../utils/WeiConverter");

const BetaTokenCrowdsale = artifacts.require("BetaTokenCrowdsale.sol");
const BetaToken = artifacts.require("BetaToken.sol");
const env = require("../../env");

contract("BetaTokenCrowdsale", ([deployer, wallet, investor]) => {
  const MINTER_ROLE = hash("MINTER_ROLE");
  const options = { from: investor, value: toWei(1) };

  beforeEach(async () => {
    this.token = await BetaToken.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);
    this.crowdsale = await BetaTokenCrowdsale.new(
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
  });

  describe("Payment features:", async () => {
    it("should accept payments in ETH using fallback (receive) function", async () => {
      return expect(this.crowdsale.sendTransaction(options)).to.eventually.be
        .fulfilled;
    });

    it("should accept payments in ETH using buyTokens() function", async () => {
      return expect(this.crowdsale.buyTokens(investor, { value: toWei(1) })).to
        .eventually.be.fulfilled;
    });
  });

  describe("Minting features:", () => {
    it("should increase token supply on purchase", async () => {
      const intialSupply = await this.token.totalSupply();
      const finalSupply = toWei(1);

      await this.crowdsale.sendTransaction(options);
      return expect(
        this.token.totalSupply()
      ).to.eventually.be.a.bignumber.equal(intialSupply + finalSupply);
    });

    it("should increase weiRaised value on purchase", async () => {
      const intialWeRaised = await this.crowdsale.weiRaised();
      const finalWeiRaised = toWei(1);

      await this.crowdsale.sendTransaction(options);
      return expect(
        this.crowdsale.weiRaised()
      ).to.eventually.be.a.bignumber.equal(intialWeRaised + finalWeiRaised);
    });
  });
});
