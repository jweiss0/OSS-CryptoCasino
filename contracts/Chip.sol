// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/* The Chip contract defines a utility token used for all transactions
*  within the Casino games. There is no intention of providing any liquidity
*  or monetary value to the Chip token.
*/
contract Chip is ERC20, Ownable {
    constructor() ERC20("Chip", "OSSC") {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}