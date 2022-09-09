const env = require("../../env");

const { expect } = require("../chai.config");
const { time } = require("@openzeppelin/test-helpers");
const { makeUnixTime } = require("../utils/helpers/TimeHandler");
const { BN } = require("../utils/helpers/BigNumber");
const { hash } = require("../utils/helpers/Hasher");
const { toWei } = require("../utils/helpers/WeiConverter");
const { makeERC20Token } = require("../utils/factories/TokenFactory");
const { makeCrowdsale } = require("../utils/factories/CrowdsaleFactory");

contract("DeltaTokenCrowdsale", ([deployer, wallet, inv1, inv2, inv3]) => {
  const MINTER_ROLE = hash("MINTER_ROLE");
  const options = { from: inv1, value: toWei(1) };

  const buyTokens = async (address, value) =>
    await this.crowdsale.sendTransaction({
      from: address,
      value: toWei(value),
    });

  beforeEach(async () => {
    this.openingTime = await makeUnixTime("weeks", 1);
    this.closingTime = await makeUnixTime("weeks", 2);

    this.token = await makeERC20Token();
    this.crowdsale = await makeCrowdsale(
      this.token,
      wallet,
      this.openingTime,
      this.closingTime
    );

    await this.crowdsale.addWhitelisted(inv1, { from: deployer });
    await this.crowdsale.addWhitelisted(inv2, { from: deployer });
    await this.token.grantRole(MINTER_ROLE, this.crowdsale.address, {
      from: deployer,
    });
  });

  describe("Crowdsale attributes:", () => {
    it("should track the correct token rate", async () => {
      return expect(await this.crowdsale.rate()).to.be.a.bignumber.equal(
        env.TOKEN_RATE
      );
    });

    it("should track the correct wallet address", async () => {
      return expect(await this.crowdsale.wallet()).to.be.equal(wallet);
    });

    it("should track the correct token address", async () => {
      return expect(await this.crowdsale.token()).to.be.equal(
        this.token.address
      );
    });

    it("should track the correct hard-cap value", async () => {
      return expect(await this.crowdsale.cap()).to.be.a.bignumber.equal(
        env.TOKEN_CAP
      );
    });

    it("should track the correct minimum individual hard-cap value", async () => {
      return expect(
        await this.crowdsale.minIndividualCap()
      ).to.be.a.bignumber.equal(env.INDIVIDUAL_MIN_CAP);
    });

    it("should track the correct maximum individual hard-cap value", async () => {
      return expect(
        await this.crowdsale.maxIndividualCap()
      ).to.be.a.bignumber.equal(env.INDIVIDUAL_MAX_CAP);
    });

    it("should track the correct crowdsale opening time", async () => {
      return expect(await this.crowdsale.openingTime()).to.be.a.bignumber.equal(
        BN(this.openingTime)
      );
    });

    it("should track the correct crowdsale closing time", async () => {
      return expect(await this.crowdsale.closingTime()).to.be.a.bignumber.equal(
        BN(this.closingTime)
      );
    });
  });

  describe("Payment features:", async () => {
    beforeEach(async () => {
      await time.increaseTo(this.openingTime + 1);
    });

    it("should accept payments in ETH using fallback (receive) function", async () => {
      return expect(this.crowdsale.sendTransaction(options)).eventually.to.be
        .fulfilled;
    });

    it("should accept payments in ETH using buyTokens() function", async () => {
      return expect(this.crowdsale.buyTokens(inv1, { value: toWei(1) })).to
        .eventually.be.fulfilled;
    });
  });

  describe("Minting features:", () => {
    beforeEach(async () => {
      await time.increaseTo(this.openingTime + 1);
    });

    it("should increase token supply on purchase", async () => {
      const intialSupply = await this.token.totalSupply();
      const finalSupply = toWei(1);
      await buyTokens(inv1, 1);

      return expect(await this.token.totalSupply()).to.be.a.bignumber.equal(
        intialSupply + finalSupply
      );
    });

    it("should increase weiRaised value on purchase", async () => {
      const intialWeRaised = await this.crowdsale.weiRaised();
      const finalWeiRaised = toWei(1);
      await buyTokens(inv1, 1);

      return expect(await this.crowdsale.weiRaised()).to.be.a.bignumber.equal(
        intialWeRaised + finalWeiRaised
      );
    });
  });

  describe("Capping features:", async () => {
    beforeEach(async () => {
      await time.increaseTo(this.openingTime + 1);
    });

    it("should return false when hard-cap has not been reached", async () => {
      expect(await this.crowdsale.capReached()).to.be.false;
    });

    it("should return true when hard-cap has been reached", async () => {
      await buyTokens(inv1, 100);
      await buyTokens(inv2, 100);

      return expect(await this.crowdsale.capReached()).to.be.true;
    });

    it("should not allow tokens purchase after hard-cap has been reached", async () => {
      await buyTokens(inv1, 100);
      await buyTokens(inv2, 100);

      return expect(this.crowdsale.sendTransaction(options)).to.eventually.be
        .rejected;
    });
  });

  describe("Individual Capping features:", () => {
    beforeEach(async () => {
      await time.increaseTo(this.openingTime + 1);
    });

    it("should return the current individual contribution amount per address", async () => {
      await buyTokens(inv1, 5);
      return expect(
        await this.crowdsale.individualContribution(inv1)
      ).to.be.a.bignumber.equal(toWei(5));
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
        await this.crowdsale.individualContribution(inv1)
      ).to.be.a.bignumber.equal(toWei(5));
    });
  });

  describe("Timed features:", () => {
    describe("before opening-time:", () => {
      it("should return false for isOpen() method when crowdsale has not been opened", async () => {
        return expect(await this.crowdsale.isOpen()).to.be.false;
      });

      it("should not allow a purchase when crowdsale has not been opened", async () => {
        return expect(buyTokens(inv1, 1)).to.eventually.be.rejected;
      });
    });

    describe("between opening/closing-time:", () => {
      beforeEach(async () => {
        await time.increaseTo(this.openingTime + 1);
      });

      it("should return true for isOpen() method when crowdsale has been opened", async () => {
        return expect(await this.crowdsale.isOpen()).to.be.true;
      });

      it("should return false for hasClosed() method when crowdsale has not been closed", async () => {
        return expect(await this.crowdsale.hasClosed()).to.be.false;
      });

      it("should allow a purchase when crowdsale has been opened", async () => {
        return expect(buyTokens(inv1, 1)).to.eventually.be.fulfilled;
      });
    });

    describe("after closing-time:", () => {
      beforeEach(async () => {
        await time.increaseTo(this.closingTime + 1);
      });

      it("should return false for isOpen() method when crowdsale has been closed", async () => {
        return expect(await this.crowdsale.isOpen()).to.be.false;
      });

      it("should return true when crowdsale has been closed", async () => {
        return expect(await this.crowdsale.hasClosed()).to.be.true;
      });

      it("should not allow a purchase when crowdsale has been closed", async () => {
        return expect(buyTokens(inv1, 1)).to.eventually.be.rejected;
      });
    });
  });

  describe("Whitelist features:", () => {
    beforeEach(async () => {
      await time.increaseTo(this.openingTime + 1);
    });

    it("should return false if an address is not whitelisted", async () => {
      return expect(await this.crowdsale.isWhitelisted(inv3)).to.be.false;
    });

    it("should return true if an address is whitelisted", async () => {
      return expect(await this.crowdsale.isWhitelisted(inv2)).to.be.true;
    });

    it("should allow deployer (ADMIN) to add an address to whitelist", async () => {
      await this.crowdsale.addWhitelisted(inv3, { from: deployer });
      return expect(await this.crowdsale.isWhitelisted(inv3)).to.be.true;
    });

    it("should allow deployer (ADMIN) to remove an address from whitelist", async () => {
      await this.crowdsale.removeWhitelisted(inv2, { from: deployer });
      return expect(await this.crowdsale.isWhitelisted(inv2)).to.be.false;
    });

    it("should allow non-deployer address to add/remove an address from whitelist", async () => {
      expect(this.crowdsale.addWhitelisted(inv2, { from: inv1 })).to.eventually
        .be.rejected;
      return expect(this.crowdsale.removeWhitelisted(inv2, { from: inv1 })).to
        .eventually.be.rejected;
    });

    it("should allow an whitelisted address to purchase tokens", async () => {
      return expect(buyTokens(inv1, 1)).to.be.fulfilled;
    });

    it("should not allow an non-whitelisted address to purchase tokens", async () => {
      return expect(buyTokens(inv3, 1)).to.be.rejected;
    });
  });
});
