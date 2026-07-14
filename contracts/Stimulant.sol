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

    // Mainnet approval transaction hashes
    string public constant APPROVAL_TX_1 = "0x6387457c5600500934253031a1356f8c61f48ed9d891da1385551cde629c1181";
    string public constant APPROVAL_TX_2 = "0x050c0e2945e206fcc715008e051e2bf78e7a5e8b624874324a590c8727dd72e5";
    
    // Designated owner address
    address public constant DESIGNATED_OWNER = 0x0311502EA9AcF3a532d32C8D8830839Ce34bD378;

    /**
     * @dev Constructor to initialize the token
     * @param initialSupply Initial number of tokens to mint (in wei)
     */
    constructor(uint256 initialSupply) ERC20("Stimulant", "STIM") Ownable(DESIGNATED_OWNER) {
        require(initialSupply > 0, "Initial supply must be greater than 0");
        _mint(DESIGNATED_OWNER, initialSupply);
        emit TokensMinted(DESIGNATED_OWNER, initialSupply);
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

    /**
     * @dev Get approval transaction hashes
     * @return tx1 First approval transaction hash
     * @return tx2 Second approval transaction hash
     */
    function getApprovalTransactions()
        public
        pure
        returns (string memory tx1, string memory tx2)
    {
        return (APPROVAL_TX_1, APPROVAL_TX_2);
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
