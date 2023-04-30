import city from './city.svg';
import logo from './logo.svg';
import ticket from './ticket.svg'
import event from './event.svg'
import { useEffect, useState } from 'react';
import React from 'react';
import './css/App.css';
import './css/Create.css';
import Homepage from "./Homepage.jsx";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contract from './TicketSmartContract.json'
import { doc, collection, addDoc, getDoc, getDocs } from "firebase/firestore";
import {db} from './firebase.js';
// Access our wallet inside of our dapp

function Create() {

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

    async function addToDatabase(account, event_image, nameVal, amountVal) {
      await addDoc(collection(db, "events"), {
        event_details: {
          Creator: account,
          event_image: event_image,
          event_name: nameVal,
          tickets_made: amountVal
        }
      });
    }

    function profileGo() {
      navigate("/userhome");
    }

    function browseGo() {
      navigate("/browse");
    }

    const createEvent = async() => {
      const networkId = await web3.eth.net.getId();
      const smartContractAddress = Contract.networks[networkId].address;
      // This is our smart contract Instance
      const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress); 

      if (document.getElementById("event_name").value == "") {
        toast.error("Please enter a name for your event.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      var nameVal = document.getElementById("event_name").value;

      if (document.getElementById("amount").value == "") {
        toast.error("Please enter the amount of tickets for your event.",  {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      var amountVal = document.getElementById("amount").value;

      if (document.getElementById("price").value == "") {
        toast.error("Please enter the ticket price for your event.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      var priceVal = document.getElementById("price").value;
      console.log(priceVal)
      const weiValue = web3.utils.toWei(priceVal, 'ether'); // Convert 0.0005 ether to wei   
      
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });

      TicketCityContractInstance.methods.createEvent(nameVal, parseInt(amountVal), 0, 0, weiValue).send({from: account, gas: 3000000})
      .once('receipt', (receipt) => {
        console.log(receipt)
        addToDatabase(account, "", nameVal, amountVal);
        navigate("/userhome");
        toast.success("Event created successfully!");
      })
      
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
              <button className = "createb">Create</button>
            </div>

            <div className = "profilebox">
              <div className = "formdiv">

              <div className = "header">
                <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img><h7>Let's Party!</h7>
                <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
              </div>
              <form>

                  <div className = "row">
                    <div className = "col-25">
                      <label htmlFor = "text">Event Name:</label>
                    </div>
                    <div className = "col-75">
                      <input id = "event_name" type="text" placeholder="Event name.."></input>
                    </div>
                  </div>

                  <div className = "row">
                    <div className = "col-25">
                      <label htmlFor = "tname">Amount of Tickets:</label>
                    </div>
                    <div className = "col-75">
                      <input id = "amount" type="number" placeholder="Amount of Tickets.."></input>
                    </div>
                  </div>
                    
                  <div className = "row">
                    <div className = "col-25">
                      <label htmlFor = "tname">Price of Tickets:</label>
                    </div>
                    <div className = "col-75">
                      <input id = "price" type = "number" placeholder="Price of Tickets in Ether.."></input>
                    </div>
                  </div>
                
                  <input id = "submit" value = "Submit" onClick = {createEvent}></input>
                  <ToastContainer />
                 
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