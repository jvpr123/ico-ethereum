// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../@openzeppelin/crowdsale/Crowdsale.sol";
import "../@openzeppelin/crowdsale/MintedCrowdsale.sol";
import "../@openzeppelin/crowdsale/CappedCrowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GammaTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale {
    using SafeMath for uint256;

    uint256 public _minIndividualCap;
    uint256 public _maxIndividualCap;

    mapping(address => uint256) public _contributions;

    constructor(
        uint256 rate_,
        address payable wallet_,
        uint256 cap_,
        uint256 minIndividualCap_,
        uint256 maxIndividualCap_,
        ERC20PresetMinterPauser token_
    ) MintedCrowdsale(rate_, wallet_, token_) CappedCrowdsale(cap_) {
        _minIndividualCap = minIndividualCap_;
        _maxIndividualCap = maxIndividualCap_;
    }

    function minIndividualCap() public view returns (uint256) {
        return _minIndividualCap;
    }

    function maxIndividualCap() public view returns (uint256) {
        return _maxIndividualCap;
    }

    function individualContribution(address _contributor)
        public
        view
        returns (uint256)
    {
        return _contributions[_contributor];
    }

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

        require(
            _contributions[beneficiary].add(weiAmount) >= _minIndividualCap,
            "GammaTokenCrowdsale: Contribution value is lower then minimum allowed"
        );
        require(
            _contributions[beneficiary].add(weiAmount) <= _maxIndividualCap,
            "GammaTokenCrowdsale: Contribution value is greater then maximum allowed"
        );
    }

    function _updatePurchasingState(address beneficiary, uint256 weiAmount)
        internal
        override
    {
        _contributions[beneficiary] = _contributions[beneficiary].add(
            weiAmount
        );
    }
}
