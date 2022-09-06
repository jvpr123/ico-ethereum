const { expect } = require("../chai.config");
const { BN } = require("../utils/BigNumber");
const { hash } = require("../utils/Hasher");
const { toWei } = require("../utils/WeiConverter");

const BetaTokenCrowdsale = artifacts.require("BetaTokenCrowdsale.sol");
const BetaToken = artifacts.require("BetaToken.sol");
const env = require("../../env");

contract("BetaTokenCrowdsale", ([deployer, wallet, inv1, inv2, inv3]) => {
  const MINTER_ROLE = hash("MINTER_ROLE");
  const options = { from: inv3, value: toWei(1) };

  const buyTokens = async (address, value) =>
    await this.crowdsale.sendTransaction({
      from: address,
      value: toWei(value),
    });

  beforeEach(async () => {
    this.token = await BetaToken.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);
    this.crowdsale = await BetaTokenCrowdsale.new(
      env.TOKEN_RATE,
      wallet,
      env.TOKEN_CAP,
      env.INDIVIDUAL_MIN_CAP,
      env.INDIVIDUAL_MAX_CAP,
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

    it("should track the correct hard-cap value", async () => {
      return expect(this.crowdsale.cap()).to.eventually.be.a.bignumber.equal(
        env.TOKEN_CAP
      );
    });

    it("should track the correct minimum individual hard-cap value", async () => {
      return expect(
        this.crowdsale.minIndividualCap()
      ).to.eventually.be.a.bignumber.equal(env.INDIVIDUAL_MIN_CAP);
    });

    it("should track the correct maximum individual hard-cap value", async () => {
      return expect(
        this.crowdsale.maxIndividualCap()
      ).to.eventually.be.a.bignumber.equal(env.INDIVIDUAL_MAX_CAP);
    });
  });

  describe("Payment features:", async () => {
    it("should accept payments in ETH using fallback (receive) function", async () => {
      return expect(this.crowdsale.sendTransaction(options)).to.eventually.be
        .fulfilled;
    });

    it("should accept payments in ETH using buyTokens() function", async () => {
      return expect(this.crowdsale.buyTokens(inv1, { value: toWei(1) })).to
        .eventually.be.fulfilled;
    });
  });

  describe("Minting features:", () => {
    it("should increase token supply on purchase", async () => {
      const intialSupply = await this.token.totalSupply();
      const finalSupply = toWei(1);
      await buyTokens(inv1, 1);

      return expect(
        this.token.totalSupply()
      ).to.eventually.be.a.bignumber.equal(intialSupply + finalSupply);
    });

    it("should increase weiRaised value on purchase", async () => {
      const intialWeRaised = await this.crowdsale.weiRaised();
      const finalWeiRaised = toWei(1);
      await buyTokens(inv1, 1);

      return expect(
        this.crowdsale.weiRaised()
      ).to.eventually.be.a.bignumber.equal(intialWeRaised + finalWeiRaised);
    });
  });

  describe("Capping features:", async () => {
    it("should return false when hard-cap has not been reached", async () => {
      expect(this.crowdsale.capReached()).to.eventually.be.false;
    });

    it("should return true when hard-cap has been reached", async () => {
      await buyTokens(inv1, 100);
      await buyTokens(inv2, 100);

      return expect(this.crowdsale.capReached()).to.eventually.be.true;
    });

    it("should not allow tokens purchase after hard-cap has been reached", async () => {
      await buyTokens(inv1, 100);
      await buyTokens(inv2, 100);

      return expect(this.crowdsale.sendTransaction(options)).to.eventually.be
        .rejected;
    });
  });

  describe("Individual Capping features:", () => {
    it("should return the current individual contribution amount per address", async () => {
      await buyTokens(inv1, 5);
      return expect(
        this.crowdsale.individualContribution(inv1)
      ).to.eventually.be.a.bignumber.equal(toWei(5));
    });

    it("should not allow a purchase which value is under minimum individual hard-cap", async () => {
      return expect(buyTokens(inv1, 0.001)).to.eventually.be.rejected;
    });

    it("should not allow a purchase which value is over maximum individual hard-cap", async () => {
      return expect(buyTokens(inv1, 150)).to.eventually.be.rejected;
    });

    it("should allow a purchase which value is under minimum individual hard-cap if address has already contributed", async () => {
      await buyTokens(inv1, 5);
      return expect(buyTokens(inv1, 0.001)).to.eventually.be.fulfilled;
    });

    it("should increase the individual contribution amount on purchase", async () => {
      await buyTokens(inv1, 5);
      return expect(
        this.crowdsale.individualContribution(inv1)
      ).to.eventually.be.a.bignumber.equal(toWei(5));
    });
  });
});
