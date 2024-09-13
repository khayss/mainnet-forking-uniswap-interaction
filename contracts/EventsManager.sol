// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Event} from "./Event.sol";

contract EventsManager {
    address[] public events;

    constructor() {}

    function createEventNft(
        string memory _name,
        string memory _symbol,
        address _event,
        uint256 _maxAttendees
    ) public {
        Event newEvent = new Event(_name, _symbol, _event, _maxAttendees);
        events.push(address(newEvent));
    }
}
