# Getting Started with Ticket City!

This project is a Decentralized Ticket Master application

## Prerequisites:


Have the following installed :


* NPM: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
* Truffle: https://trufflesuite.com/docs/truffle/how-to/install/
* Ganache: https://trufflesuite.com/ganache/


## Start the application
In the `ticket-app` directory, follow the steps below to start the application locally


1. Install dependencies by executing the following command, `npm install`


2. Run the application by entering `npm start` in the terminal.

3. (Optional) Create a `.env` file in the `src` folder and add the the following Key: **REACT_APP_DB_API_KEY**. For this to work, you need to first have a firebase account. Once you have an account, you can add the API key as the Value to the Key above.

4. (Optional) Update the contents of const *firebaseConfig* in `src/firebase.js` to match those of your new collection!

5. Open http://localhost:3000 to view the application in your browser.


## Deploy TicketSmartContract to Ganache
In the project directory, follow the steps below to deploy the smart contract on the development network (Ganache). Make sure Ganache is running locally on your device before executing the steps below


1. Enter ticket-contract directory by entering the following command in the terminal, `cd ticket-contract`


2. Install dependencies by executing the following command, `npm install`

3. Open up your Ganache app and create a new workspace:
    - Link the truffle-config.js from 'Decentralized-Ticket-System’ folder to the new workspace.

4. Under the `Server` settings in your Ganache workspace, please change the networkID to `1337` instead of 5777.

5. Open up your `MetaMask` settings and add the ganache network if you haven’t. Make sure that you put the exact RPC URL (HTTP://127.0.0.0.0:7545), Chain ID (`1337`), and Currency Symbol (ETH). If you already have the ganache network connected, please change it appropriately.

6. Deploy smart contract to Ganache network by entering `truffle migrate --network ganache --reset` in the terminal.


7. Once everything is done migrating, please copy all of the contents within the JSON file located in the path `../Decentralzied-Ticket-System/ticket-contract/build/contracts/TicketSmartContract.json`. Then, go to the file located at `../Decentralzied-Ticket-System/ticket-app/src/TicketSmartContract.json` and delete all of the contents within it (if any), and then `paste the contents you copied from ../Decentralzied-Ticket-System/ticket-contract/build/contracts/TicketSmartContract.json` into that file. Then save the file.

8. Once you have copied over the contents from `../contract/TicketSmartContract.json` and `pasted
in ticket-app/src/TicketSmartContract.json`, cd into the `../ticket-app directory by opening up a 
new terminal in the `Decentralized-Ticket-System` directory and typing the command `cd ticket-app`.

9. Follow the steps detailed in **'Start the application'** section to run the application


## Deploy TicketSmartContract to Goerli
In the project directory, follow the steps below to deploy the smart contract on the Goerli network.


1. Enter ticket-contract directory by entering the following command in the terminal, `cd ticket-contract`


2. Install dependencies by executing the following command, `npm install`


3. Locate the .env file (or CREATE one if there isn't any) and populate the values for PROJECT_ID and MNEMONIC. For **PROJECT_ID** variable enter the Infura project API Key in between the quotes. For **MNEMONIC** variable enter the account seed phrase. Note: The contract will be deployed on the address that is associated with that seed phrase


4. Deploy smart contract to Ganache network by entering `truffle migrate --network goerli` in the terminal.


5. The command above should have created a new json file under `./build/contracts` named `TicketSmartContract.json`. Find the file. 

6. Then, go to the file located at `../Decentralzied-Ticket-System/ticket-app/src/TicketSmartContract.json` and delete all of the contents within it (if any), and then `paste the contents you copied from ../Decentralzied-Ticket-System/ticket-contract/build/contracts/TicketSmartContract.json` into that file. Then save the file.

7. Once you have copied over the contents from `../contract/TicketSmartContract.json` and `pasted
in ticket-app/src/TicketSmartContract.json`, cd into the ../ticket-app` directory by opening up a 
new terminal in the `Decentralized-Ticket-System` directory and typing the command `cd ticket-app`.

8. Follow the steps detailed in **'Start the application'** section to run the application

