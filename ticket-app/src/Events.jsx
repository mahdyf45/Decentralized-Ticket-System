import './css/Event.css';
import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';
import Web3 from "web3";
import contract from './TicketSmartContract.json';
// Access our wallet inside of our dapp

// This is FOR TESTING ON GANACHE ONLY - THIS WILL HAVE TO CHANGE WHEN DEPLOYING
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const smartContractAddress = "0xC9f4732a4F394514Cd0c4593E1E876BFC0817e7e"
const contractAbi = contract.abi
// This is our smart contract Instance
const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);

function Events() {

    const [account, setAccount] = useState('');
    var store = document.querySelector(':root');

    function getz() {
        var value = getComputedStyle(store);
    }

    function setz() {
        store.style.setProperty('--z-index', '6');
        store.style.setProperty('--z-index2', '5');
    }

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    useEffect(() => {
      requestAccount();
    }, []);

    const  viewMyEvents = async() => {
        let all_events = await TicketCityContractInstance.methods.viewMyEvents(account).call()
        return all_events;
    };

    const renderEvents = () => {
        var info_box2 = document.getElementById("info_box2");
        getz()
        setz()
        if (info_box2 != null || undefined) {
            document.getElementById("info_box2").innerHTML = "";
        }
    }
      
    const renderList = () => {
        const info_box = document.getElementById('info_box');
        let events = "";
        const itemList =  viewMyEvents().then((resolved) => {
            for (let i = 0; i < resolved.length; i++){
                let openiningDiv = "<div id = 'eventbox'>";
                let image = "<div id = 'row'>" + "<div id = 'eventImg'></div>";
                let eventName = "<h5>"+"Event Name: " + resolved[i][0] + "</h5>" + "</div>";
                let price = "<h4>"+"Ticket Price: " + resolved[i][8] + " ether</h4>";
                let availableTickets = "<h4>"+"Available Tickets: " + resolved[i][3] + "</h4>";
                let closingDiv = "</div>";
                let event = openiningDiv + image + eventName + price + availableTickets + closingDiv;
                events += event;
            }
            console.log(events)
            info_box.innerHTML = events;
        }
        );
    };

    return (
    <div>
        {renderEvents()}
        {renderList()}
    </div>
    );
}

export default Events;