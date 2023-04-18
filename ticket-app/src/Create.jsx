import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';
import './css/App.css';
import './css/Create.css';
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

function Create() {

    const [account, setAccount] = useState('');
    const navigate = useNavigate();

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    function profileGo() {
      navigate("/userhome");
    }

    const createEvent = async() => {
      const weiValue = web3.utils.toWei('0.000005', 'ether'); // Convert 0.0005 ether to wei      
      
      TicketCityContractInstance.methods.createEvent("hi", 2, 0, 0, 5).send({from: account, gas: 3000000})
      .once('receipt', (receipt) => {
        console.log(receipt)
      })

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
              <button className = "profile" onClick = {profileGo}>Profile</button>
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