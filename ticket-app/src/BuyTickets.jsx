import './css/Ticket.css';
import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';
import Web3 from "web3";
import contract from './TicketSmartContract.json';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// Access our wallet inside of our dapp

// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const smartContractAddress = "0xC9f4732a4F394514Cd0c4593E1E876BFC0817e7e"
const contractAbi = contract.abi
// This is our smart contract Instance
const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);

function Tickets() {

    const [account, setAccount] = useState('');
    const navigate = useNavigate();
    var store = document.querySelector(':root');
    const { id } = useParams()

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

    const viewAllEventTickets = async() => {
        let all_tickets = await TicketCityContractInstance.methods.viewAllEventTickets(id).call()
        return all_tickets;
    };

    const renderList = () => {
        const info_box2 = document.getElementById('info_box2');
        let events = "";
        const itemList = viewAllEventTickets().then((resolved) => {
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
                
                if (resolved[i][4] == true) {
                    var button = "<button id = 'buy'>Buy</button>" ;
                }
                else {
                    var button = "<button id = 'nobuy' onClick = {location.href='/buy/" + resolved[i][1] + "'}>Sold</button>" ;
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