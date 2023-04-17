import './css/Ticket.css';
import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';

function Tickets() {

    return (
        <div className = "body">
           <div className = "ticketbox">
            <h5>Ticket name</h5>
            <h4>View Details: </h4>
            <h4>Sell: </h4>
           </div>
        </div>
    );
}


export default Tickets;