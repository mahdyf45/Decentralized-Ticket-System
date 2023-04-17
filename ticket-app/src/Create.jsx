import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';
import './css/App.css';
import './css/Create.css';
import Web3 from "web3";
import contract from './TicketSmartContract.json';

// Access our wallet inside of our dapp

// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
const smartContractAddress = "0x9D1442b3150bF6AbA6d9802760Fa5f798bA58649"
const contractAbi = contract.abi
// This is our smart contract Instance
const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);

function Create() {

    const [account, setAccount] = useState('');

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    const createEvent = async() => {
      TicketCityContractInstance.methods.createEvent("hi", 0, 0, 2, 5).send({from: "0x2dEbC47198890E65b2478f295D8b68a0d0bE2A2f", gas: 100000, value: 40 });
      //console.log("all Events: ", all_events)
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
              <button className = "profile">Profile</button>
              <button className = "browse">Browse</button>
              <button className = "createb">Create</button>
            </div>

            <div className = "profilebox">
              <div className = "formdiv">
              <h7>Create an Event Below!</h7>
              <form onClick = {createEvent}>

                  <div className = "row">
                    <div className = "col-25">
                      <label htmlFor = "text">Event Name:</label>
                    </div>
                    <div className = "col-75">
                      <input type="text" placeholder="Event name.."></input>
                    </div>
                  </div>

                  <div className = "row">
                    <div className = "col-25">
                      <label htmlFor = "tname">Amount of Tickets:</label>
                    </div>
                    <div className = "col-75">
                      <input type="number" placeholder="Amount of Tickets.."></input>
                    </div>
                  </div>
                    
                  <div className = "row">
                    <div className = "col-25">
                      <label htmlFor = "tname">Price of Tickets:</label>
                    </div>
                    <div className = "col-75">
                      <input type = "number" placeholder="Price of Tickets.."></input>
                    </div>
                  </div>
                
                  <input type = "submit" value = "Submit"></input>
                 
              </form>
              </div>
            </div>

            <h3>Connected: {account}</h3>

            <img src = {city} className = "city" id = "city" alt = "background of city"></img>
          </div>
        );
    }
}
export default Create;