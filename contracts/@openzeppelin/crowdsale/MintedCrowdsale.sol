// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MintedCrowdsale is Crowdsale {
    constructor(
        uint256 _rate,
        address payable _wallet,
        IERC20 _token
    ) Crowdsale(_rate, _wallet, _token) {}

    function _deliverTokens(address beneficiary, uint256 tokenAmount)
        internal
        virtual
        override(Crowdsale)
    {
        ERC20PresetMinterPauser(address(token())).mint(
            beneficiary,
            tokenAmount
        );
    }
}
