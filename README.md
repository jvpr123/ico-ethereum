# ETHEREUM ICO - CAPPED CROWDSALE

## Summary

This project implements several Etherem ICO use-cases to practice Solidity important concepts.

Inside this branch, a **Capped Crowdsale** is developed, which means there is a maximum amount of wei to be raised **(so called hard-cap)**. Once the hard-cap value is reached, the crowdsale is closed and no tokens purachase is allowed anymore. Also in this contract, a feature to set a minimum/maximum amount of tokens purchase is implemented. Thus, users will only be able to buy tokens within the range configured.

In order to allow these features to work properly, two smart contracts will be required:

1. [BetaToken.sol:](./contracts/token/BetaToken.sol) token smart contract that extends ERC20 standard by inheriting the contract [ERC20PresetMinterPauser.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol) (OpenZeppelin latest version), that besides ERC20 token features, adds the ability to the smart contract of minting tokens and managing who is allowed to perform minting and pauser operations.
2.  [BetaTokenCrowdsale.sol:](./contracts//crowdsale/BetaTokenCrowdsale.sol) performs tokens purchase operations extending the behavior of [Crowdsale.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/Crowdsale.sol), [MintedCrowdsale.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/emission/MintedCrowdsale.sol) and [CappedCrowdsale.sol](./contracts/%40openzeppelin/crowdsale/CappedCrowdsale.sol) smart contracts (OpenZeppelin 2.5.0 version). Since OpenZeppelin has not updated these contracts to latest Solidity compiler versions, it was necessary to make some minor changes in order to the contracts work properly according to compiler version ^0.8.15. The updates were made following the steps showed in [this article.](https://www.bluelabellabs.com/blog/crowdsale-mintedcrowdsale-solidity-contracts-openzeppelin/)

<br/>

## References:

1. [What is a crowdsale?](https://docs.openzeppelin.com/contracts/2.x/crowdsales) - @OpenZeppelin docs 
2. [What is a minted crowdsale?](https://docs.openzeppelin.com/contracts/2.x/crowdsales#minted-crowdsale) - @OpenZeppelin docs
3. [Building a real-world ICO](https://www.youtube.com/playlist?list=PLS5SEs8ZftgULF-lbxy-is9x_7mTMHFIN) - @gwmccubbin YouTube playlist
4. [Solidity Contracts to Work With OpenZeppelin 4.0](https://www.bluelabellabs.com/blog/crowdsale-mintedcrowdsale-solidity-contracts-openzeppelin/) - @bll-bobbygill article

<br/>

### Thanks for sharing such great articles and tutorials with the community!

