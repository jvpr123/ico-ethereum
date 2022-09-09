# ETHEREUM ICO - WHITELIST CROWDSALE

## Summary

This project implements several Etherem ICO use-cases to practice Solidity important concepts.

Inside this branch, a **Whitelist Crowdsale** is developed, which means that, for KYC registration purposes, only whitelisted addresses will be able to purchase tokens. To make it possible, the [AccessControl.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) smart-contract (latest OpenZeppeln version) is inherited by our custom TimedCrowdsale contract. This contarct is provided by OpenZeppelin, but some changes are required to make it work properly using the latest compiler. A role called **WHITELISTED_INVESTOR_ROLE** was added to store known addresses, and anyone is able to verify if and address is whitelisted by calling the method **isWhitelisted()**. Also, the deployer (contract-owner) is able to add to or remove an address from whitelist, and during a token purchase, the internal function **_preValidatePurchase()** will be called to verify sender address is included.

In order to allow these features to work properly, two smart contracts will be required:

1. [DeltaToken.sol:](./contracts/token/DeltaToken.sol) token smart contract that extends ERC20 standard by inheriting the contract [ERC20PresetMinterPauser.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol) (OpenZeppelin latest version), that besides ERC20 token features, adds the ability to the smart contract of minting tokens and managing who is allowed to perform minting and pauser operations.
2.  [DeltaTokenCrowdsale.sol:](./contracts//crowdsale/DeltaTokenCrowdsale.sol) performs tokens purchase operations extending the behavior of [Crowdsale.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/Crowdsale.sol), [MintedCrowdsale.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/emission/MintedCrowdsale.sol), [CappedCrowdsale.sol](./contracts/%40openzeppelin/crowdsale/CappedCrowdsale.sol), [TimedCrowdsale.sol](./contracts/@openzeppelin/crowdsale/TimedCrowdsale.sol) and [WhitelistCrowdsale.sol](./contracts/%40openzeppelin/crowdsale/WhitelistCrowdsale.sol) smart contracts (OpenZeppelin 2.5.0 version). Since OpenZeppelin has not updated these contracts to latest Solidity compiler versions, it was necessary to make some minor changes in order to the contracts work properly according to compiler version ^0.8.15. The updates were made following the steps showed in [this article.](https://www.bluelabellabs.com/blog/crowdsale-mintedcrowdsale-solidity-contracts-openzeppelin/)

<br/>

## References:

1. [What is a crowdsale?](https://docs.openzeppelin.com/contracts/2.x/crowdsales) - @OpenZeppelin docs 
2. [What is a minted crowdsale?](https://docs.openzeppelin.com/contracts/2.x/crowdsales#minted-crowdsale) - @OpenZeppelin docs
3. [Building a real-world ICO](https://www.youtube.com/playlist?list=PLS5SEs8ZftgULF-lbxy-is9x_7mTMHFIN) - @gwmccubbin YouTube playlist
4. [Solidity Contracts to Work With OpenZeppelin 4.0](https://www.bluelabellabs.com/blog/crowdsale-mintedcrowdsale-solidity-contracts-openzeppelin/) - @bll-bobbygill article
