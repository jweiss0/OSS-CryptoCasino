Crypto Casino
===========

### Overview
_Crypto Casino_ is a web-based game, built on blockchain technology. It will utilize the blockchain to record and verify transactions that occur within the game, such as actions or task a player completes. Crypto Casino is a collection of casino games that will be played on a front end web application, with transactions recorded on the blockchain. This includes games such as blackjack, roulette, and slots.

Ultimately, we plan to use this project as a learning experience for blockchain development. The project is licensed under [GPL v3.0](https://github.com/jweiss0/OSS-CryptoCasino/blob/main/LICENSE) to ensure it maintains an open source status and can be used by others in the community to learn blockchain development. Much of the project is not set in stone, leaving it up to the developers and community to modify the plans for the project as they see fit.

## Development
This project is currently under development, utilizing React + Typescript for the front end with Solidity + Hardhat for the smart contract back end. We plan to deploy the smart contracts to the _Polygon_ network, but this is subject to change. For testing purposes, the Localhost network and Matic Mumbai network are used.
### Front End
#### Running Local Project in Development Mode
- Navigate to the `frontend` folder
- Run `$ npm install`
- Run `$ npm start`
- Open http://localhost:3000 to view in browser
### Back End
#### Configuring and Using Hardhat Environment
- Navigate to project root folder
- Run `$ npm install`

Try running some of the following tasks with Hardhat:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```
#### Etherscan Verification
To try out Etherscan verification, first deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
#### Performance Optimizations
For faster runs of tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

## Team
| **Name** | **GitHub Handle** |
|:------:|:-------:|
| Jeremy Weiss | jweiss0 | 
| Eugene Rozental | eugrro |
| Kevin Cruz | kevtlw |
| Brandon Red | brandon-red |
| Ben Xu | x-u-b |

## License
GPL v3.0
