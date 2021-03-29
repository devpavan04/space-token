const { assert } = require("chai");

const SpaceToken = artifacts.require("./SpaceToken.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Space Token", async (accounts) => {
  let spaceToken, result;

  before(async () => {
    spaceToken = await SpaceToken.deployed();
  });

  describe("ERC-20 Token Contract Deployment", async () => {
    it("contract has an address", async () => {
      const address = await spaceToken.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("token has a name", async () => {
      const name = await spaceToken.name();
      assert.equal(name, "Space");
    });

    it("token has a symbol", async () => {
      const symbol = await spaceToken.symbol();
      assert.equal(symbol, "SPACE");
    });

    it("allocates total supply to admin address on deployment", async () => {
      const tokenBalance = await spaceToken.balanceOf(accounts[0]);
      assert.equal(tokenBalance.toString(), "500");
    });
  });

  describe("ERC-20 Token Implementation", async () => {
    it("allows token transfer", async () => {
      let oldSenderBalance, oldReceiverBalance, newSenderBalance, newReceiverBalance;
      oldSenderBalance = await spaceToken.balanceOf(accounts[0]);
      oldSenderBalance = oldSenderBalance.toString();
      assert.equal(oldSenderBalance, "500");

      oldReceiverBalance = await spaceToken.balanceOf(accounts[1]);
      oldReceiverBalance = oldReceiverBalance.toString();
      assert.equal(oldReceiverBalance, "0");

      result = await spaceToken.transfer(accounts[1], 10, { from: accounts[0] });

      newSenderBalance = await spaceToken.balanceOf(accounts[0]);
      newSenderBalance = newSenderBalance.toString();
      assert.equal(newSenderBalance, "490");

      newReceiverBalance = await spaceToken.balanceOf(accounts[1]);
      newReceiverBalance = newReceiverBalance.toString();
      assert.equal(newReceiverBalance, "10");

      await spaceToken.transfer(accounts[1], 10, { from: 0x0000000000000000000000000000000000000000 }).should.be.rejected;
      await spaceToken.transfer(0x0000000000000000000000000000000000000000, 500, { from: accounts[0] }).should.be.rejected;
      await spaceToken.transfer(accounts[2], 11, { from: accounts[1] }).should.be.rejected;
    });

    it("allows token approval", async () => {
      let oldApprovedTokensForAccount2ByAccount0, newApprovedTokensForAccount2ByAccount0;
      oldApprovedTokensForAccount2ByAccount0 = await spaceToken.getTokensApproved(accounts[0], accounts[2]);
      assert.equal(oldApprovedTokensForAccount2ByAccount0.toString(), 0);

      result = await spaceToken.approve(accounts[2], 40, { from: accounts[0] });

      newApprovedTokensForAccount2ByAccount0 = await spaceToken.getTokensApproved(accounts[0], accounts[2]);
      assert.equal(newApprovedTokensForAccount2ByAccount0.toString(), 40);

      await spaceToken.approve(accounts[3], 11, { from: accounts[1] }).should.be.rejected;
    });

    it("allows spender to spend token on behalf of the token owner after token approval", async () => {
      let oldSrcBalance,
        oldDestBalance,
        newSrcBalance,
        newDestBalance,
        oldApprovedTokensForAccount2ByAccount0,
        newApprovedTokensForAccount2ByAccount0;
      oldSrcBalance = await spaceToken.balanceOf(accounts[0]);
      assert.equal(oldSrcBalance.toString(), "490");

      oldDestBalance = await spaceToken.balanceOf(accounts[3]);
      assert.equal(oldDestBalance.toString(), "0");

      oldApprovedTokensForAccount2ByAccount0 = await spaceToken.getTokensApproved(accounts[0], accounts[2]);
      assert.equal(oldApprovedTokensForAccount2ByAccount0.toString(), "40");

      result = await spaceToken.transferFrom(accounts[0], accounts[3], 40, { from: accounts[2] });

      newSrcBalance = await spaceToken.balanceOf(accounts[0]);
      assert.equal(newSrcBalance.toString(), "450");

      newDestBalance = await spaceToken.balanceOf(accounts[3]);
      assert.equal(newDestBalance.toString(), "40");

      newApprovedTokensForAccount2ByAccount0 = await spaceToken.getTokensApproved(accounts[0], accounts[2]);
      assert.equal(newApprovedTokensForAccount2ByAccount0.toString(), "0");

      await spaceToken.transferFrom(accounts[0], accounts[3], 41, { from: accounts[2] }).should.be.rejected;
      await spaceToken.transferFrom(accounts[0], accounts[2], 60, { from: accounts[3] }).should.be.rejected;
    });
  });
});
