// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../@openzeppelin/crowdsale/MintedCrowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract AlphaTokenCrowdsale is MintedCrowdsale {
    constructor(
        uint256 _rate,
        address payable _wallet,
        ERC20PresetMinterPauser _token
    ) MintedCrowdsale(_rate, _wallet, _token) {}
}
