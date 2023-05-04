import './css/Homepage.css';
import './css/App.css';
import city from './city.svg';
import logo from './logo.svg';
import { useState } from 'react';
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contract from './TicketSmartContract.json'

function Homepage() {

    return (
      <div className = "body">
        <div className = "navbar">
          <a href = "/"><img src = {logo} className = "logo" id = "logo" alt = "ticketcity logo"></img></a>
          <button className = "login" onClick = {metaMask}>Start</button>
        </div>

        <div className = "textbox">
          <h1>Ticket</h1>
          <h2>City</h2>
          <p>Welcome to TicketCity! Ready to take control over how you sell and buy event tickets? 
            Sign in or register to start buying tickets for a price that's just right for you!</p>
        </div>

        <img src = {city} className = "city" id = "city" alt = "background of city"></img>
      </div>
    );
}

function metaMask() {

  // Check if metamask exists
  if(window.ethereum){

    window.ethereum.request({method:'eth_requestAccounts'})
    .then(res=>{
      // Return the address of the wallet
      console.log(res) 
      window.location = "/userhome";
    })
  // Metamask does not exist
  }else{
    alert("Please install the MetaMask extension.")
  }

}

export default Homepage;
