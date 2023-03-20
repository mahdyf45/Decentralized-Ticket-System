import './Homepage.css';
import city from './city.svg';
import logo from './logo.svg';

function Homepage() {
  return (
    <div className = "body">
      <div className = "navbar">
        <img src = {logo} className = "logo" id = "logo" alt = "ticketcity logo"></img>
        <button className = "login">Sign in</button>
        <button className = "register">Register</button>
      </div>

      <div className = "textbox">
        <h1>Ticket</h1>
        <h2>City</h2>
        <p>Welcome to TicketCity! Ready to take control over how you sell and buy event tickets? 
           sign in or register to start buying tickets for a price that's just right for you!</p>
      </div>

      <img src = {city} className = "city" id = "city" alt = "background of city"></img>
    </div>
  );
}

export default Homepage;
