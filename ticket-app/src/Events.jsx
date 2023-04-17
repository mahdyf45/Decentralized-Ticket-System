import './css/Ticket.css';
import city from './city.svg';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import React from 'react';

function Events() {

    return (
        <div className = "body">
           <div className = "eventbox">
            <h5>Event name</h5>
            <h4>Price: </h4>
            <h4>Seller: </h4>
           </div>
        </div>
    );
}


export default Events;