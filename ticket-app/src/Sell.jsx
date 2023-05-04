import './css/Sell.css';
import city from './city.svg';
import logo from './logo.svg';
import ticket from './ticket.svg'
import event from './event.svg'
import { useEffect, useState } from 'react';
import React from 'react';
import Web3 from "web3";
import Contract from './TicketSmartContract.json';
import Homepage from "./Homepage.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
// Access our wallet inside of our dapp



function Browse() {

    const [account, setAccount] = useState('');
    const navigate = useNavigate();
    const { id } = useParams()// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
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

    //function sellTicket(uint256 sellingAmount, uint256 tokenID) onlyTicketOwner(tokenID) public payable 
    const sellTicket = async() => {

        const networkId = await web3.eth.net.getId();
        const smartContractAddress = Contract.networks[networkId].address;
        // This is our smart contract Instance
        const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);

        if (document.getElementById("new_price").value == "") {
            toast.error("Please enter the price.",  {
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

        var priceVal = document.getElementById("new_price").value;

        const weiValue = web3.utils.toWei(priceVal, 'ether')
        TicketCityContractInstance.methods.sellTicket(weiValue, id).send({from: account, gas: 3000000})
        .once('receipt', (receipt) => {

            navigate("/userhome");
            toast.success("Ticket put up for sale successfully!");
          })
    };

    function profileGo() {
      navigate("/userhome");
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
                    <button className = "browse" onClick = {browseGo}>Browse</button>
                    <button className = "create" onClick = {createGo}>Create</button>
                </div>

                <div className = "profilebox">
                    
                    <div className = "formdiv">

                    <div className = "header2">
                        <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                        <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img><h7>Sell</h7>
                        <img src = {event} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                        <img src = {ticket} className = "ticket-header" id = "ticket-header" alt = "ticket image"></img>
                    </div>

                    <form>

                    <div className = "row2">
                        <div className = "col-25">
                        <label htmlFor = "tname">Ticket Price:</label>
                        </div>
                        <div className = "col-75">
                        <input id = "new_price" type="number" placeholder="Ticket Price in Ether.."></input>
                        </div>
                    </div>

                    <input id = "submit" value = "Submit" onClick = {sellTicket}></input>

                    </form>
                    </div>
                </div>

                <h3>Connected: {account}</h3>
                <ToastContainer />

                <img src = {city} className = "city" id = "city" alt = "background of city"></img>
            </div>
        );
    }
}

export default Browse;