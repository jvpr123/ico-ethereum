# ETHEREUM ICO - TIMED CROWDSALE

## Summary

This project implements several Etherem ICO use-cases to practice Solidity important concepts.

Inside this branch, a **Timed Crowdsale** is developed, which means that tokens purchases will be allowed only during a specific period of time. In order to define this interval duration, two properties are provided during the contract deloy: **uint256 openingTime_** and **uint256 closingTime_** - both provided in seconds (Unix Epoch Timestamp). These values are avaiable to be checked anytime, and users may verify if the crowdsale is open by calling methods **isOpen()** or **hasClosed()**. During a token purchase, the internal function **_preValidatePurchase()** will be called to verify if crowdsale is open.

In order to allow these features to work properly, two smart contracts will be required:

1. [GammaToken.sol:](./contracts/token/GammaToken.sol) token smart contract that extends ERC20 standard by inheriting the contract [ERC20PresetMinterPauser.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol) (OpenZeppelin latest version), that besides ERC20 token features, adds the ability to the smart contract of minting tokens and managing who is allowed to perform minting and pauser operations.
2.  [GammaTokenCrowdsale.sol:](./contracts//crowdsale/GammaTokenCrowdsale.sol) performs tokens purchase operations extending the behavior of [Crowdsale.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/Crowdsale.sol), [MintedCrowdsale.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/emission/MintedCrowdsale.sol), [CappedCrowdsale.sol](./contracts/%40openzeppelin/crowdsale/CappedCrowdsale.sol) and [TimedCrowdsale.sol](./contracts/@openzeppelin/crowdsale/TimedCrowdsale.sol) smart contracts (OpenZeppelin 2.5.0 version). Since OpenZeppelin has not updated these contracts to latest Solidity compiler versions, it was necessary to make some minor changes in order to the contracts work properly according to compiler version ^0.8.15. The updates were made following the steps showed in [this article.](https://www.bluelabellabs.com/blog/crowdsale-mintedcrowdsale-solidity-contracts-openzeppelin/)

<br/>

## References:

1. [What is a crowdsale?](https://docs.openzeppelin.com/contracts/2.x/crowdsales) - @OpenZeppelin docs 
2. [What is a minted crowdsale?](https://docs.openzeppelin.com/contracts/2.x/crowdsales#minted-crowdsale) - @OpenZeppelin docs
3. [Building a real-world ICO](https://www.youtube.com/playlist?list=PLS5SEs8ZftgULF-lbxy-is9x_7mTMHFIN) - @gwmccubbin YouTube playlist
4. [Solidity Contracts to Work With OpenZeppelin 4.0](https://www.bluelabellabs.com/blog/crowdsale-mintedcrowdsale-solidity-contracts-openzeppelin/) - @bll-bobbygill article

<br/>

### Thanks for sharing such great articles and tutorials with the community!
