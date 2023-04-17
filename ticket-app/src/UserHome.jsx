import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import Tickets from './Tickets.jsx';
import Events from './Events.jsx';
import React from 'react';
import './css/App.css';
import './css/UserHome.css';
import Web3 from "web3";
import contract from './TicketSmartContract.json';

// Access our wallet inside of our dapp

// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
const smartContractAddress = "0x9D1442b3150bF6AbA6d9802760Fa5f798bA58649"
const contractAbi = contract.abi
// This is our smart contract Instance
const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);

function UserHome() {

    const [open, setOpen] = useState('0');

    const [account, setAccount] = useState('');

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    const viewAllEvents = async() => {
      let all_events = await TicketCityContractInstance.methods.viewAllEvents().call()
      console.log("all Events: ", all_events)
    }

    useEffect(() => {
      requestAccount();
    }, []);

    if (account == '') {
      return
    }
    else {
      return (
          <div className = "body">
            
            <div className = "navbar">
              <a href = "/"><img src = {logo} className = "logo2" id = "logo2" alt = "ticketcity logo"></img></a>
              <button className = "profileb">Profile</button>
              <button className = "browse">Browse</button>
              <button className = "create">Create</button>
            </div>

            <div className = "profilebox">
              <button className =  {`mytickets${open == 0? 'active' : 'inactive'}`} onClick = {() => setOpen('0')}>My Tickets</button>
              <button className = {`myevents${open == 0? 'active' : 'inactive'}`} onClick = {() => {setOpen('1'); viewAllEvents();}}>My Events</button>
              <hr></hr>
              {open == 1 && <Events />}
              {open == 0 && <Tickets />}
            </div>

            <h3>Connected: {account}</h3>

            <img src = {city} className = "city" id = "city" alt = "background of city"></img>
          </div>
        );
    }
}
export default UserHome;