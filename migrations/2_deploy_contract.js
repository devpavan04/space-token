const SpaceToken = artifacts.require("SpaceToken");

module.exports = function (deployer) {
  deployer.deploy(SpaceToken, "0xcc8Bc709c1cE0a5E55c0F117CBA9e95e758c5dB3");
};
