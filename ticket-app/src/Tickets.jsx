import './css/Ticket.css';
import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';
import Web3 from "web3";
import Contract from './TicketSmartContract.json';
import { useNavigate } from "react-router-dom";
// Access our wallet inside of our dapp

function Tickets() {

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
    
    var store = document.querySelector(':root');

    function getz() {
        var value = getComputedStyle(store);
    }

    function setz() {
        store.style.setProperty('--z-index', '5');
        store.style.setProperty('--z-index2', '6');
    }

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    useEffect(() => {
      requestAccount();
    }, []);

    const renderTickets = () => {
        var info_box = document.getElementById("info_box");
        getz()
        setz()
        if (info_box != null || undefined) {
            document.getElementById("info_box").innerHTML = "";
        }
    }

    const getAllUserTickets = async() => {
        const networkId = await web3.eth.net.getId();
        const smartContractAddress = Contract.networks[networkId].address;
        // This is our smart contract Instance
        const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);
        let all_tickets = await TicketCityContractInstance.methods.getAllUserTickets(account).call()
        return all_tickets;
    };
      
    const renderList = () => {
        const info_box2 = document.getElementById('info_box2');
        let events = "";
        const itemList = getAllUserTickets().then((resolved) => {
            for (let i = 0; i < resolved.length; i++){
                let rowDiv = "<div id = 'columntickets'>";
                let openiningDiv = "<div id = 'eventbox'>";
                let image = "<div id = 'row'>" + "<div id = 'ticketImg'></div>";
                let eventName = "<h5>"+"Event Name: " + resolved[i][0] + "</h5>" + "</div>";
                let ticketNum = "<h4>"+"Ticket ID: " + resolved[i][1] + "</h4>";
                let price = "<h4>"+"Ticket Price: " + resolved[i][2] + " ether</h4>";
                let owner = "<h4>"+"Seller: " + resolved[i][3] + "</h4>";
                let closingDiv = "</div>";
                let cRowDiv = "</div>";

                // Already for sale so gray out button
                if (resolved[i][4] == true) {
                    var button = "<button id = 'nosell'>Selling</button>" ;
                }
                else {
                    var button = "<button id = 'sell' onClick = {location.href='/sell/" + resolved[i][1] + "'}>Sell</button>" ;
                }
                let event = rowDiv + openiningDiv + image + eventName + ticketNum + price + owner + closingDiv + button + cRowDiv;
                events += event;
            }
            console.log(events)
            info_box2.innerHTML = events;
        }
        );
    };

    return (
    <div>
        {renderList()}
        {renderTickets()}
    </div>
    );
}


export default Tickets;