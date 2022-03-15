// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/* The Chip contract defines a utility token used for all transactions
*  within the Casino games. There is no intention of providing any liquidity
*  or monetary value to the Chip token.
*/
contract Chip is ERC20, Ownable {

    // State variables.
    address private casinoAddress;
    address private casinoGameAddress;

    // Constructor mints 1000 for deploying wallet.
    constructor() ERC20("Chip", "OSSC") {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    // Modifier to check if the calling address is the Casino contract address.
    modifier onlyCasino {
        require(msg.sender == casinoAddress, "Caller must be Casino.");
        _;
    }

    modifier onlyCasinoGame {
        require(msg.sender == casinoGameAddress, "Caller must be CasinoGame.");
        _;   
    }

    // Set the address of the Casino contract.
    function setCasinoAddress(address _addr) external onlyOwner {
        casinoAddress = _addr;
    }

    // Set the address of the CasinoGame contract.
    function setCasinoGameAddress(address _addr) external onlyOwner {
        casinoGameAddress = _addr;
    }

    // Minting function available only to the deploying address.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Minting function available only to the Casino contract address.
    function casinoMint(address to, uint256 amount) external onlyCasino {
        _mint(to, amount * 10 ** decimals());
    }

    // Allows the Casino Game contract to check the balance of a user.
    function casinoGameBalanceOf(address _owner) external view onlyCasinoGame returns (uint256 balance)  {

    }

    // Allows the Casino Game contract to transfer tokens from a user.
    function casinoGameTransferFrom(address _from, address _to, uint256 _value) external onlyCasinoGame returns (bool success)  {

    }
}