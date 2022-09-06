// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../@openzeppelin/crowdsale/Crowdsale.sol";
import "../@openzeppelin/crowdsale/MintedCrowdsale.sol";
import "../@openzeppelin/crowdsale/CappedCrowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract BetaTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale {
    constructor(
        uint256 _rate,
        address payable _wallet,
        ERC20PresetMinterPauser _token,
        uint256 _cap
    ) MintedCrowdsale(_rate, _wallet, _token) CappedCrowdsale(_cap) {}

    function _deliverTokens(address beneficiary, uint256 tokenAmount)
        internal
        override(Crowdsale, MintedCrowdsale)
    {
        super._deliverTokens(beneficiary, tokenAmount);
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        override(Crowdsale, CappedCrowdsale)
    {
        super._preValidatePurchase(beneficiary, weiAmount);
    }
}
