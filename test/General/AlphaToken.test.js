const { expect } = require("../chai.config");

const BN = require("../utils/BigNumber");
const hash = require("../utils/Hasher");
const env = require("../../env");

const AlphaToken = artifacts.require("AlphaToken");
const AlphaTokenCrowdsale = artifacts.require("AlphaTokenCrowdsale");

contract("Alpha Token", ([deployer, account1]) => {
  const options = { from: deployer };
  const DEFAULT_ADMIN_ROLE = "0X00";
  const PAUSER_ROLE = hash("PAUSER_ROLE");
  const MINTER_ROLE = hash("MINTER_ROLE");

  beforeEach(async () => {
    this.token = await AlphaToken.new(env.TOKEN_NAME, env.TOKEN_SYMBOL);
    this.crowdSale = await AlphaTokenCrowdsale.new(
      env.TOKEN_RATE,
      deployer,
      this.token.address
    );
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

  describe("Access Control features:", () => {
    it("should set deployer address as a DEFAULT_ADMIN_ROLE", async () => {
      return expect(
        this.token.hasRole(DEFAULT_ADMIN_ROLE, deployer)
      ).to.eventually.be.equal(true);
    });

    it("should set deployer address as a PAUSER_ROLE", async () => {
      return expect(
        this.token.hasRole(PAUSER_ROLE, deployer)
      ).to.eventually.be.equal(true);
    });

    it("should allow deployer to grant a ROLE to an address", async () => {
      await this.token.grantRole(MINTER_ROLE, this.crowdSale.address, options);

      return expect(
        this.token.hasRole(MINTER_ROLE, this.crowdSale.address)
      ).to.eventually.be.equal(true);
    });

    it("should allow deployer to revoke a ROLE from an address", async () => {
      await this.token.grantRole(MINTER_ROLE, this.crowdSale.address, options);
      await this.token.revokeRole(MINTER_ROLE, this.crowdSale.address, options);

      return expect(
        this.token.hasRole(MINTER_ROLE, this.crowdSale.address)
      ).to.eventually.be.equal(false);
    });

    it("should allow an account to renounce a ROLE", async () => {
      await this.token.renounceRole(PAUSER_ROLE, deployer, options);

      return expect(
        this.token.hasRole(PAUSER_ROLE, deployer)
      ).to.eventually.be.equal(false);
    });

    it("should not allow an account to renounce a ROLE granted to another address", async () => {
      return expect(
        this.token.renounceRole(MINTER_ROLE, this.crowdSale.address, options)
      ).to.eventually.be.rejected;
    });
  });

  describe("Pausable features:", async () => {
    it("should allow deployer to pause contract transactions", async () => {
      await this.token.pause(options);
      return expect(this.token.paused()).to.eventually.be.equal(true);
    });

    it("should allow deployer to unpause contract transactions", async () => {
      await this.token.pause(options);
      expect(this.token.paused()).to.eventually.be.equal(true);

      await this.token.unpause(options);
      return expect(this.token.paused()).to.eventually.be.equal(false);
    });

    it("should not allow a transaction when contract is paused", async () => {
      await this.token.pause(options);

      expect(this.token.grantRole(MINTER_ROLE, account1, options)).to.eventually
        .be.rejected;
    });
  });
});
