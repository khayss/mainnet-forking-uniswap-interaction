// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {EventNft} from "./EventNft.sol";

contract Event {
    EventNft public eventNft;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxAttendees
    ) {
        eventNft = new EventNft(_name, _symbol, address(this), _maxAttendees);
    }

    function register(address to, uint256 tokenId) public {
        require(eventNft.balanceOf(to) == 0, "Already registered");
        eventNft.safeMint(to, tokenId);
    }

    function verifyAttender(address attendee) public view returns (bool) {
        return eventNft.balanceOf(attendee) != 0;
    }
}
