import city from './city.svg';
import logo from './logo.svg';
import ticket from './ticket.svg'
import event from './event.svg'
import { useEffect, useState } from 'react';
import Tickets from './Tickets.jsx';
import Events from './Events.jsx';
import BuyTickets from './BuyTickets.jsx';
import React from 'react';
import './css/App.css';
import './css/UserHome.css';
import Homepage from "./Homepage.jsx";
import Web3 from "web3";
import Contract from './TicketSmartContract.json';
import { useNavigate } from "react-router-dom";

// Access our wallet inside of our dapp

function Buy() {

    const [open, setOpen] = useState('0');
    const [account, setAccount] = useState('');
    const navigate = useNavigate();
    // This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
    const url = "https://127.0.0.1:7545"
    const contractAbi = Contract.abi
    let web3Provider = null;

    // Is there an Injected web3 instance?
    if (typeof Web3 !== 'undefined') {
      web3Provider = Web3.givenProvider;
    } else {
      // If there is no injected web3 instance is detected, fallback to TestRPC
      web3Provider = new Web3(new Web3.providers.HttpProvider(url));
    }
    let web3 = new Web3(web3Provider)
    

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
  
    function profileGo() {
        navigate("/userhome");
    }

    useEffect(() => {
      requestAccount();
    }, []);

    if (account == "") {
      return (
        <Homepage/>
      )
    }
    else {
      return (
          <div className = "body">
            
            <div className = "navbar">
              <a href = "/"><img src = {logo} className = "logo2" id = "logo2" alt = "ticketcity logo"></img></a>
              <button className = "profile" onClick = {profileGo}>Profile</button>
              <button className = "browse" onClick = {browseGo}>Browse</button>
              <button className = "create" onClick = {createGo}>Create</button>
            </div>

            <div className = "profilebox">
                <div className = "header2">
                    <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                    <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img><h7>Tickets</h7>
                    <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                    <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                </div>

                <div id='info_box2'></div>
                <BuyTickets />
            </div>

            <h3>Connected: {account}</h3>

            <img src = {city} className = "city" id = "city" alt = "background of city"></img>
          </div>
        );
    }
}

export default Buy;