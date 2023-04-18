import './css/Browse.css';
import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';
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

function Browse() {

    const [account, setAccount] = useState('');
    const navigate = useNavigate();

    async function requestAccount() {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(account[0]);
    }

    function profileGo() {
      navigate("/userhome");
    }

    function createGo() {
      navigate("/create");
    }

    const viewAllEvents = async() => {
        let all_events = await TicketCityContractInstance.methods.viewAllEvents().call()
        return all_events;
    };

    const renderEvents = () => {
        var info_box2 = document.getElementById("info_box2");
        if (info_box2 != null || undefined) {
            document.getElementById("info_box2").innerHTML = "";
        }
    }
      
    const renderList = () => {
        const info_box = document.getElementById('info_box');
        let events = "";
        const itemList = viewAllEvents().then((resolved) => {
            for (let i = 0; i < resolved.length; i++){
                let openiningDiv = "<div id = 'eventbox'>";
                let eventName = "<h5>"+"Event Name: " + resolved[i][0] + "</h5>";
                let price = "<h4>"+"Price: " + resolved[i][8] + "</h4>";
                let seller = "<h4>"+"Seller: " + resolved[i][1] + "</h4>";
                let availableTickets = "<h4>"+"Available Tickets: " + resolved[i][3] + "</h4>";
                let closingDiv = "</div>";
                let event = openiningDiv + eventName + seller + price + availableTickets + closingDiv;
                events += event;
            }
            console.log(events)
            info_box.innerHTML = events;
        }
        );
    };

    useEffect(() => {
        requestAccount();
    }, []);

    return (
        <div className = "body">
            
            <div className = "navbar">
                <a href = "/"><img src = {logo} className = "logo2" id = "logo2" alt = "ticketcity logo"></img></a>
                <button className = "profile" onClick = {profileGo}>Profile</button>
                <button className = "browseb" >Browse</button>
                <button className = "create" onClick = {createGo}>Create</button>
            </div>

            <div className = "profilebox">
                <div>
                    {renderEvents()}
                    {renderList()}
                </div>
            </div>

            <h3>Connected: {account}</h3>

            <img src = {city} className = "city" id = "city" alt = "background of city"></img>
        </div>
    );
}

export default Browse;