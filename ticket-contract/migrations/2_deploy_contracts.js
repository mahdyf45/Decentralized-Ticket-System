var TicketSmartContract = artifacts.require("TicketSmartContract");
module.exports = function(deployer) {
    deployer.deploy(TicketSmartContract);
};