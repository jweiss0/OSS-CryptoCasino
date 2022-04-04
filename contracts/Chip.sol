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

    constructor() ERC20("Chip", "CHIP") {}

    // Modifier to check if the calling address is the Casino contract address.
    modifier onlyCasino {
        require(msg.sender == casinoAddress, "Caller must be Casino.");
        _;
    }

    // Set the address of the Casino contract.
    function setCasinoAddress(address _addr) external onlyOwner {
        casinoAddress = _addr;
    }

    // Getters
    function getCasinoAddress() public view returns (address) {return casinoAddress;}

    // Minting function available only to the deploying address.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Minting function available only to the Casino contract address.
    function casinoMint(address to, uint256 amount) external onlyCasino {
        _mint(to, amount);
    }

    // Allows the Casino contract to transfer tokens from a user to the contract.
    // Also allows for the transfer of tokens from the contract to a user.
    function casinoTransferFrom(address _from, address _to, uint256 _value) external onlyCasino {
        transferFrom(_from, _to, _value);
    }
}