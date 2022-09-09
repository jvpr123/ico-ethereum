// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./Crowdsale.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title WhitelistCrowdsale
 * @dev Crowdsale in which only whitelisted users can contribute.
 */
abstract contract WhitelistCrowdsale is AccessControl, Crowdsale {
    bytes32 public constant WHITELISTED_INVESTOR_ROLE =
        keccak256("WHITELISTED_INVESTOR_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function isWhitelisted(address _investor) public view returns (bool) {
        return hasRole(WHITELISTED_INVESTOR_ROLE, _investor);
    }

    function addWhitelisted(address _investor)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(WHITELISTED_INVESTOR_ROLE, _investor);
    }

    function removeWhitelisted(address _investor)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _revokeRole(WHITELISTED_INVESTOR_ROLE, _investor);
    }

    /**
     * @dev Extend parent behavior requiring beneficiary to be whitelisted. Note that no
     * restriction is imposed on the account sending the transaction.
     * @param _beneficiary Token beneficiary
     * @param _weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount)
        internal
        view
        virtual
        override
    {
        require(
            isWhitelisted(_beneficiary),
            "WhitelistCrowdsale: caller does not have the WHITELISTED_INVESTOR_ROLE"
        );
        super._preValidatePurchase(_beneficiary, _weiAmount);
    }
}
