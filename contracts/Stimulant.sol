// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Stimulant
 * @dev A comprehensive ERC-20 token contract with burn and pause capabilities
 * @notice This contract implements the ERC-20 standard with additional features
 */
contract Stimulant is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    // Emission events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor to initialize the token
     * @param initialSupply Initial number of tokens to mint (in wei)
     */
    constructor(uint256 initialSupply) ERC20("Stimulant", "STIM") Ownable(msg.sender) {
        require(initialSupply > 0, "Initial supply must be greater than 0");
        _mint(msg.sender, initialSupply);
        emit TokensMinted(msg.sender, initialSupply);
    }

    /**
     * @dev Pause all token transfers
     * @notice Only owner can pause
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Resume token transfers
     * @notice Only owner can unpause
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Mint new tokens
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint
     * @notice Only owner can mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn tokens from an account
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     * @notice Only owner can burn tokens from other accounts
     */
    function burnFrom(address from, uint256 amount) public override onlyOwner {
        require(from != address(0), "Cannot burn from zero address");
        require(amount > 0, "Amount must be greater than 0");
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    /**
     * @dev Get token metadata
     * @return name Token name
     * @return symbol Token symbol
     * @return decimals Token decimals
     * @return totalSupply Total token supply
     */
    function getTokenInfo()
        public
        view
        returns (
            string memory,
            string memory,
            uint8,
            uint256
        )
    {
        return (name(), symbol(), decimals(), totalSupply());
    }

    // Required function overrides for ERC20 and ERC20Pausable

    /**
     * @dev Override _update to include pause check
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) whenNotPaused {
        super._update(from, to, amount);
    }

    /**
     * @dev Override nonces for permit functionality
     */
    function nonces(address owner)
        public
        view
        override(ERC20)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
