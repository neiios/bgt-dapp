// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity >=0.8.0;

contract OpenAuction {
    // parameters (time in unix epoch seconds)
    address payable public beneficiary;
    uint public auctionEndTime;

    // current state of auction
    address payable public highestBidder;
    uint public highestBid;

    mapping(address => uint) pendingReturns;
    bool ended = false;

    // events that will be emitted on changes.
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    // errors that describe failures
    // comments with 3 slashes are special dont change them
    /// The auction has already ended.
    error AuctionAlreadyEnded();
    /// There is already a higher or equal bid.
    error BidNotHighEnough(uint highestBid);
    /// The auction has not ended yet.
    error AuctionNotYetEnded();
    /// The function auctionEnd has already been called.
    error AuctionEndAlreadyCalled();

    /// Create a simple auction with `biddingTime`
    /// seconds bidding time on behalf of the
    /// beneficiary address `beneficiaryAddress`.
    constructor(
        uint biddingTime,
        address payable beneficiaryAddress
    ) {
        beneficiary = beneficiaryAddress;
        auctionEndTime = block.timestamp + biddingTime;
    }

    /// Bid on the auction with the value sent
    /// together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    function bid() external payable {
        // revert will revert all changes and send the money back
        if (block.timestamp > auctionEndTime)
            revert AuctionAlreadyEnded();
        if (msg.value <= highestBid)
            revert BidNotHighEnough(highestBid);

        // if the new bid is larger send previous highest bidder's money back
        if (highestBid != 0)
            highestBidder.transfer(highestBid);

        highestBidder = payable(msg.sender);
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// End the auction and send the highest bid
    /// to the beneficiary.
    function auctionEnd() external {
        if (block.timestamp < auctionEndTime)
            revert AuctionNotYetEnded();
        if (ended)
            revert AuctionEndAlreadyCalled();

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }
}
