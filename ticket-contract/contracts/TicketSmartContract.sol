// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;
/**
 * @title TicketSmartContract
 * @dev  Implements ticketing system along with its various functions
 */
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TicketSmartContract is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _lunarCoinIdCounter;
    constructor() ERC721("LunarCoins", "LNC") {}

    // State variable to keep track of how many events were created
    uint256 private eventsCreated = 0;
    // This mapping will be (tokenID => TicketInfo) The TicketInfo is mapped to each tokenID. The token ID is the NFT
    mapping(uint256 => TicketInfo) private ticketNFTS;
    // Defining a map to hold all of the tickets mapped to a user (address => list of TICKET ID's that maps to the NFT)
    mapping(address => uint256[]) private userTickets;
    // Defining a map to hold all of the registered events and to who created them
    mapping(address => EventInfo[]) private userEvents;
    // Defining a map to hold all of the events that were registered on the smart contract (eventID => Event struct)
    mapping(uint256 => EventInfo) private allEvents;
    // Defining a map to hold all ticktes being sold for a specifc event (eventID => uint256[]))
    mapping(uint256 => uint256[]) private eventTickets;
    // Defining an array to hold all of the events
    EventInfo[] allEventsArray;

    // A structure that will contain all of the Ticket Information: The ticket IS the NFT
    struct TicketInfo {
        // Which event the Ticket belongs to
        uint256 eventID;
        // TOKEN ID
        uint256 tokenID;
        // The price of the ticket
        uint256 ticketPrice;
        // The owner of the ticket
        address owner;
        // Is the ticket for sale?
        bool isForSale;
        // Token URI
        string tokenURI;
    }

    // A structure that will contain all of the Event/Organizers information:
    struct EventInfo {
        // Event name
        string eventName;
        // Event creator
        address eventCreatorAddress;
        // Event ID - This will be dependent on 'eventsCreated' state variable 
        uint256 eventID;
        // Number of tickets that are set to be available to buy [IF the number is set to -1 then that mean "UNLIMITED tickets]
        uint256 availableTickets;
        // Number of tickets sold already
        uint256 soldTickets;
        // Max ticket price
        uint256 maxTicketPrice;
        // Min ticket price
        uint256 minTicketPrice;
        // Is the event still available?
        bool isEventActive;
        // The price of the ticket
        uint256 ticketPrice;
    }

    // Events
    event ticketForSale(address seller, uint256 amount);
    event ticketSold(address buyer, uint256 amountSold);
    event eventCreated(string eventName, address eventOrganizer);

    // This function will mint tickets based off of how many available tickets there are. It returns a list of tokenID's that will represent the NFTS being put up for 'sale'
    function mintTicket(address to, string memory tokenURI, uint256 eventID, uint256 availableTickets, uint256 ticketPrice, address owner) private onlyEventOrganzier(eventID){
        // All of this will be wrapped in a for loop
        for (uint256 counter = 0; counter < availableTickets; counter++) {
            _lunarCoinIdCounter.increment();
            uint256 newlunarCoinId = _lunarCoinIdCounter.current();
            require(!_exists(newlunarCoinId), "Token has already been minted!");
            _safeMint(to, newlunarCoinId);
            _setTokenURI(newlunarCoinId, tokenURI);
            // Each ticketID will have the ticket information mapped to it (ticketID => TicketInfo)
            TicketInfo memory newTicket = TicketInfo(eventID, newlunarCoinId, ticketPrice, owner, true, tokenURI);
            ticketNFTS[newlunarCoinId] = newTicket;
            // We push the tickets to 'eventTickets', (eventID => uint256[] List of tokenIDs for sale) 
            eventTickets[eventsCreated].push(newlunarCoinId);
            userTickets[to].push(newlunarCoinId);
        }
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/QmWsGNpfuvG3gh4TbAW4ToP9RiMvwKf9NmbiUKLHV9zikY";
    }

    // Modifer to make sure ONLY the organizer can execute a specific function
    modifier onlyEventOrganzier(uint256 eventID) {
        address eventCreatorAddress = getEventCreatorAddress(eventID);
        require(msg.sender == eventCreatorAddress, "Only the creator of this event can execute this");
        _;
    }
    // Modifier to make sure that only the owner of the ticket can sell
    modifier onlyTicketOwner(uint256 tokenID) {
        address ticketOwner = ticketNFTS[tokenID].owner;
        require(msg.sender == ticketOwner, "Only the ticket owner can execute this");
        _;
    }

    /** @dev anyone can Create an Event */
    function createEvent(string memory eventName, uint256 availableTickets, uint256 maxTicketPrice, uint256 minTicketPrice, uint256 ticketPrice) public payable {
        // We increment the number of events that were created
        eventsCreated++;
        // Now we create the Event and add the appropriate info to all of the mappings/structs
        EventInfo memory eventDetails = EventInfo(eventName, msg.sender, eventsCreated, availableTickets, 0, maxTicketPrice, minTicketPrice, true, ticketPrice);
        allEvents[eventsCreated] = eventDetails;
        allEventsArray.push(eventDetails);
        userEvents[msg.sender].push(eventDetails);
        // We create the tickets to be put up for sale, we mint each ticket
        // address to, string memory tokenURI, uint256 eventID, uint256 availableTickets, uint256 ticketPrice, address payable owner
        mintTicket(msg.sender, 
        "ipfs://QmW6zxjpjqM4t1TiGaEsrN38aN7Uu4oXoNabQroANEQQJy", 
        eventsCreated, availableTickets, ticketPrice, msg.sender);
        // Emit event creation
        emit eventCreated(eventName, msg.sender);

    }

    /** @dev when buying a ticket, you must provide the tokenID and the eventID */ 
    function buyTicket(uint256 tokenID) public payable {
        // Get all ticket information from the one selling it
        require(_exists(tokenID), "Sorry but it seems like this ticket doesn't even exist. Please Contact Us so we can get this sorted out.");
        TicketInfo memory ticket = ticketNFTS[tokenID];
        require(ticket.isForSale, "This ticket is not for sale");
        require(msg.value == ticket.ticketPrice, "You must pay the amount that the ticket owner is selling this ticket for.");
        require(msg.sender != ticket.owner);
        address ticketOwner = ownerOf(tokenID);
        address payable sellerToPay = payable(ticketOwner);
        // Transfer the ticket from the previous owner to the new owner
        ticketTransfer(ticketOwner, msg.sender, tokenID);
        sellerToPay.transfer(msg.value);
        // Modify 'ticketNFT' to set 'isForSale' to False and 'owner' to msg.sender
        ticketNFTS[tokenID].isForSale = false;
        ticketNFTS[tokenID].owner = msg.sender;
        // Update 'userTickets' so that it gets added to the new owner and removed from old owner
        // (address => list of TICKET ID's that maps to the NFT)
        // Removing from old owner
        for (uint256 index = 0; index < userTickets[ticketOwner].length; index++){
            if (userTickets[ticketOwner][index] == tokenID){
                removeTicketFromSellList(ticketOwner, index);
                break;
            }
        }
        // Adding to new owner
        userTickets[msg.sender].push(tokenID);
        // Remove the ticketID from 'eventTickets' (eventID => uint256[])
        for (uint256 index = 0; index < eventTickets[ticket.eventID].length; index++){
            if (eventTickets[ticket.eventID][index] == tokenID){
                removeEventTicket(ticket.eventID, index);
                break;
            }
        }
        // Update EventInfo if we buy from organizer
        if (ticketOwner == allEvents[ticket.eventID].eventCreatorAddress){
            allEvents[ticket.eventID].availableTickets--;
            allEvents[ticket.eventID].soldTickets++;
        }
        // Emit ticket being sold
        emit ticketSold(msg.sender, ticket.ticketPrice);

    }

    function sellTicket(uint256 sellingAmount, uint256 tokenID) onlyTicketOwner(tokenID) public payable {
        // Get all ticket information from the one selling it
        require(_exists(tokenID), "Sorry but it seems like this ticket doesn't even exist. Please Contact Us so we can get this sorted out.");
        TicketInfo memory ticket = ticketNFTS[tokenID];
        address ticketOwner = ownerOf(tokenID);
        require(ticket.isForSale == false, "This ticket is already up for sale.");
        require(ticketOwner == msg.sender);
        // We modify ticketsNFT to match new price and set 'isForSale' to True.
        ticketNFTS[tokenID].isForSale = true;
        ticketNFTS[tokenID].ticketPrice = sellingAmount;
        // Add it to Event Tickets
        eventTickets[ticket.eventID].push(tokenID);
        // Emit event
        emit ticketForSale(ticketOwner, sellingAmount);
        

    }

    // This is the function to see all of the tickets being sold for a specific event
    function viewAllEventTickets(uint256 eventID) public view returns(TicketInfo[] memory) {  
        require(eventID <= eventsCreated, "This event does not exist");  
        uint256[] memory retrievedTicketsForSale = eventTickets[eventID];
        TicketInfo[] memory dataToReturn = new TicketInfo[](retrievedTicketsForSale.length);
        for (uint256 counter = 0; counter < retrievedTicketsForSale.length; counter++){
            uint256 currentTokenID = retrievedTicketsForSale[counter];
            TicketInfo memory currTicketInfo = ticketNFTS[currentTokenID];
            dataToReturn[counter] = currTicketInfo;
        }
        return(dataToReturn);
    }

    // This is the function that will be called when a user wants to view their ticket information
    function viewTicketInfo(uint tokenID) public view returns(TicketInfo memory) {
        require(_exists(tokenID), "Sorry but it seems like this ticket doesn't even exist. Please Contact Us so we can get this sorted out.");
        // The returned value will be an instance of the TicketInfo, it has the following information:
        //  - Which event the Ticket belongs to: uint256 eventID;
        //  - The token ID: uint256 tokenID;
        //  - The price of the ticket: uint256 ticketPrice;
        //  - The owner of the ticket: address payable owner;
        //  - Is the ticket for sale: bool isForSale;
        return ticketNFTS[tokenID];
    }

    function getEventDetails(uint256 eventID) public view returns(string memory, address, uint256, uint256, uint256,
                                                                    uint256, uint256, bool, uint256) {
        require(eventID <= eventsCreated, "This event does not exist");                                                     
        EventInfo memory eventInformation = allEvents[eventID];
        return (eventInformation.eventName, eventInformation.eventCreatorAddress, eventInformation.eventID,
                eventInformation.availableTickets, eventInformation.soldTickets,
                eventInformation.maxTicketPrice, eventInformation.minTicketPrice, eventInformation.isEventActive, eventInformation.ticketPrice);
    }
    
    // This function will return all of the tickets that belong to a user
    function getAllUserTickets(address from) public view returns(TicketInfo[] memory) {
        // 'userTickets' is a map to hold all of the tickets mapped to a user (address => list of TICKET ID's that maps to the NFT)
        uint256[] memory userTokens = userTickets[from];
        TicketInfo[] memory dataToReturn = new TicketInfo[](userTokens.length);
        // We go through each ticketID that belongs to them
        for (uint256 counter = 0; counter < userTokens.length; counter++) {
            uint256 currTokenID = userTokens[counter];
            // Then we get the sepcifc TicketInfo using currTokenID
            dataToReturn[counter] = ticketNFTS[currTokenID];
        }
        return (dataToReturn);
    }

    /** @dev This function will return all of the events that were created */
    function viewAllEvents() public view returns(EventInfo[] memory){
        return(allEventsArray);
    }

    function viewMyEvents(address from) public view returns(EventInfo[] memory){
        return(userEvents[from]);
    }

    function getEventCreatorAddress(uint256 eventID) private view returns(address){
         return allEvents[eventID].eventCreatorAddress;
    } 

    function removeTicketFromSellList(address ticketOwner, uint256 index) private {
        for (uint256 newIndex = index; newIndex < userTickets[ticketOwner].length - 1; newIndex++) {
            userTickets[ticketOwner][newIndex] = userTickets[ticketOwner][newIndex + 1];
        }   
        userTickets[ticketOwner].pop();
    }

    function removeEventTicket(uint256 eventID, uint256 index) private {
        for (uint256 newIndex = index; newIndex < eventTickets[eventID].length - 1; newIndex++) {
            eventTickets[eventID][newIndex] = eventTickets[eventID][newIndex + 1];
        }   
        eventTickets[eventID].pop();
    }

    /**
     * @dev See {IERC721-transferFrom}.
     * References: 
     *  - https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721-setApprovalForAll-address-bool-
     *  - https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
     */
    function ticketTransfer(address from, address to, uint256 tokenId) private  {
        //solhint-disable-next-line max-line-length
        require(ownerOf(tokenId) == from, "Token not owned by sender");
        require(to != address(0), "Invalid recipient address");
        require(from != address(0), "Invalid sender address");
        _transfer(from, to, tokenId);
    }


}