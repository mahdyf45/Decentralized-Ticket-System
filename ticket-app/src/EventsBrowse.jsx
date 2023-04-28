import './css/Browse.css';
import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';
import Web3 from "web3";
import Contract from './TicketSmartContract.json';
// Access our wallet inside of our dapp


function EventsBrowse() {

    const [account, setAccount] = useState('');
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

    const viewAllEvents = async() => {
        const networkId = await web3.eth.net.getId();
        const smartContractAddress = Contract.networks[networkId].address;
        // This is our smart contract Instance
        const TicketCityContractInstance = new web3.eth.Contract(contractAbi, smartContractAddress);
        let all_events = await TicketCityContractInstance.methods.viewAllEvents().call()
        return all_events;
    };
      
    const renderList = () => {
        const info_box3 = document.getElementById('info_box3');
        let events = "";
        const itemList = viewAllEvents().then((resolved) => {
            console.log(resolved)
            for (let i = 0; i < resolved.length; i++){
                let rowDiv = "<div id = 'columntickets'>";
                let openiningDiv = "<div id = 'eventbox'>";
                let image = "<div id = 'row'>" + "<div id = 'eventImg'></div>";
                let eventName = "<h5>"+"Event Name: " + resolved[i][0] + "</h5></div>";
                let ticket_price_to_ether = web3.utils.fromWei(resolved[i][8], 'ether');
                console.log(ticket_price_to_ether)
                let price = "<h4>"+"Price: " + ticket_price_to_ether + " ether </h4>";
                let seller = "<h4>"+"Seller: " + resolved[i][1] + "</h4>";
                let closingDiv = "</div>";
                let cRowDiv = "</div>";
                let button = "<button id = 'sell' onClick = {location.href='/tickets/" + resolved[i][2] + "'}>Tickets</button>" ;
                let event = rowDiv + openiningDiv + image + eventName + seller + price + closingDiv + button + cRowDiv;
                events += event;
            }
            console.log(events)
            info_box3.innerHTML = events;
        }
        );
    };

    useEffect(() => {
        requestAccount();
    }, []);

    return (
        <div>
            {renderList()}
        </div>
    );
}

export default EventsBrowse;