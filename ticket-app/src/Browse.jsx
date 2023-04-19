import './css/Browse.css';
import city from './city.svg';
import logo from './logo.svg';
import ticket from './ticket.svg'
import event from './event.svg'
import { useEffect, useState } from 'react';
import React from 'react';
import Web3 from "web3";
import contract from './TicketSmartContract.json';
import Homepage from "./Homepage.jsx";
import EventsBrowse from './EventsBrowse';
import { useNavigate } from "react-router-dom";
// Access our wallet inside of our dapp

// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const smartContractAddress = "0xC9f4732a4F394514Cd0c4593E1E876BFC0817e7e"
const contractAbi = contract.abi
// This is our smart contract Instance
const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);

function Browse() {

    const [account, setAccount] = useState('');
    const navigate = useNavigate();

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    function profileGo() {
      navigate("/userhome");
    }

    function createGo() {
      navigate("/create");
    }

    useEffect(() => {
        requestAccount();
    }, []);

    if(account == "") {
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
                    <button className = "browseb" >Browse</button>
                    <button className = "create" onClick = {createGo}>Create</button>
                </div>

                <div className = "profilebox">
                    <div className = "header2">
                        <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                        <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img><h7>Events</h7>
                        <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                        <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                    </div>

                    <div>
                        <div id='info_box3'></div>
                        <EventsBrowse />
                    </div>
                </div>

                <h3>Connected: {account}</h3>

                <img src = {city} className = "city" id = "city" alt = "background of city"></img>
            </div>
        );
    }
}

export default Browse;