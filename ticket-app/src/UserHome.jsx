import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import Tickets from './Tickets.jsx';
import Events from './Events.jsx';
import React from 'react';
import './css/App.css';
import './css/UserHome.css';
import Homepage from "./Homepage.jsx";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contract from './TicketSmartContract.json'

// Access our wallet inside of our dapp



function UserHome() {

    const [open, setOpen] = useState('0');
    const [account, setAccount] = useState('');
    const navigate = useNavigate();
    const [contractAddress, setContractAddress] = useState('');
    // This is our smart contract Instance
    const [TicketCityContractInstance, setTicketCityContractInstance] = useState('');

    // This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    const contractAbi = Contract.abi;
  
    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    async function getContractAddress() {
      const networkId = await web3.eth.net.getId();
      setContractAddress(Contract.networks[networkId].address);
      setTicketCityContractInstance(new web3.eth.Contract(contractAbi, Contract.networks[networkId].address));
    }

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
      getContractAddress();
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
              <button className = "profileb">Profile</button>
              <button className = "browse" onClick = {browseGo}>Browse</button>
              <button className = "create" onClick = {createGo}>Create</button>
            </div>

            <div className = "profilebox">
              <div className = "topbox">
                <button className =  {`mytickets${open == 0? 'active' : 'inactive'}`} onClick = {() => setOpen('0')}>My Tickets</button>
                <button className = {`myevents${open == 0? 'active' : 'inactive'}`} onClick = {() => {setOpen('1')}}>My Events</button>
              </div>
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
