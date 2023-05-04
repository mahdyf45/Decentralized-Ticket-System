import './css/App.css';
import { useState } from 'react';
import Web3 from "web3";
import contract from './TicketSmartContract.json';

// Access our wallet inside of our dapp

// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const smartContractAddress = "0xC9f4732a4F394514Cd0c4593E1E876BFC0817e7e"
const contractAbi = contract.abi
// This is our smart contract Instance
const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);


function App() {

  const [currentMetaMaskAccount, setCurrentMetaMaskAccount] = useState(null);

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum){
      console.log("Make sure you have metamask connected!")
      return;
    }
    else{
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentMetaMaskAccount(accounts)
    }
   }

  const checkWalletIsConnected = () => {
    const { ethereum } = window;

    if (!ethereum){
      console.log("Make sure you have metamask connected!")
      return;
    }
    else{
      console.log("Metamask wallet is connected!")
    }
   }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const contractOwner = async() => {
    let owner = await TicketCityContractInstance.methods.owner().call()
    console.log("owner: ", owner)
  }

  const contractTokenSymbol = async() => {
    let symbol = await TicketCityContractInstance.methods.symbol().call()
    console.log("symbol: ", symbol)
  }

  const nftName = async() => {
    let nftName = await TicketCityContractInstance.methods.name().call()
    console.log("nftName: ", nftName)
  }

  const viewAllEvents = async() => {
    let all_events = await TicketCityContractInstance.methods.viewAllEvents().call()
    console.log("all Events: ", all_events)
  }

  return (
    <div className='main-app'>
      <h1>Ticket City Test!</h1>
      <div>
        {connectWalletButton()}
      </div>

      <button onClick={contractOwner} className='create_event_button'>
        Get Owner of Smart Contract
      </button>

      <button onClick={contractTokenSymbol} className='get_token_symbol_button'>
        Get Token Symbol of the deployed contract
      </button>

      <button onClick={nftName} className='get_nft_name_button'>
        Get NFT Name
      </button>

      <button onClick={viewAllEvents} className='get_all_events_button'>
        Get all events
      </button>
    </div>
  );
}

export default App;


