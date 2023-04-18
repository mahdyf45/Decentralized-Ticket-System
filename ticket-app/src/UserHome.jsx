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
import { useNavigate } from "react-router-dom";

// Access our wallet inside of our dapp

// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const smartContractAddress = "0xC9f4732a4F394514Cd0c4593E1E876BFC0817e7e"
const contractAbi = contract.abi
// This is our smart contract Instance
const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);

function UserHome() {

    const [open, setOpen] = useState('0');
    const [account, setAccount] = useState('');
    const navigate = useNavigate();

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    function createGo() {
      navigate("/create");
    }

    function browseGo() {
      navigate("/browse");
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
              <button className = "browse" onClick = {browseGo}>Browse</button>
              <button className = "create" onClick = {createGo}>Create</button>
            </div>

            <div className = "profilebox">
              <button className =  {`mytickets${open == 0? 'active' : 'inactive'}`} onClick = {() => setOpen('0')}>My Tickets</button>
              <button className = {`myevents${open == 0? 'active' : 'inactive'}`} onClick = {() => {setOpen('1')}}>My Events</button>
              <hr></hr>
              <div id='info_box'></div>
              <div id='info_box2'></div>
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
