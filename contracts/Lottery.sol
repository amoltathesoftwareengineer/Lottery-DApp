// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Lottery {
    address public owner;
    address[] private participants;
    mapping(address => bool) public hasEntered;

    bool public lotteryOpen = true;
    address public winner;

    event LotteryEntered(address indexed participant);
    event WinnerSelected(address indexed winner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function enter() external payable {
        require(lotteryOpen, "Lottery is closed");
        require(msg.value > 0, "Send ETH to enter");
        require(!hasEntered[msg.sender], "Already entered");

        participants.push(msg.sender);
        hasEntered[msg.sender] = true;

        emit LotteryEntered(msg.sender);
    }

    function participantCount() external view returns (uint256) {
        return participants.length;
    }

    function closeLottery() external onlyOwner {
        require(lotteryOpen, "Already closed");
        require(participants.length > 0, "No participants");
        lotteryOpen = false;
    }

    function selectWinner(uint256 index) external onlyOwner {
        require(!lotteryOpen, "Close lottery first");
        require(winner == address(0), "Winner already selected");
        require(index < participants.length, "Invalid index");

        winner = participants[index];
        emit WinnerSelected(winner);
    }

    function claimPrize() external {
        require(msg.sender == winner, "Not the winner");

        address payable recipient = payable(winner);
        winner = address(0);

        (bool success, ) = recipient.call{
            value: address(this).balance
        }("");
        require(success, "Transfer failed");
    }
}
