// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../../@openzeppelin/crowdsale/Crowdsale.sol";

contract AlphaTokenCrowdsale is Crowdsale {
    constructor(
        uint256 _rate,
        address payable _wallet,
        IERC20 _token
    ) Crowdsale(_rate, _wallet, _token) {}
}
