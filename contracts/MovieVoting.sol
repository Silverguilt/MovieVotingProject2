// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract MovieVoting {
    struct Movie {
        string name;
        uint voteCount;
    }

    struct VotingSession {
        address creator;
        string[] movieNames;
        mapping(string => uint) votes;
        bool isVotingOpen;
        uint startTime;
        uint endTime;
        bool isSessionComplete;
    }

    // State variables
    VotingSession[] public votingSessions;
    mapping(uint => address) public sessionCreator;
    
    // Mapping to track if a user has voted in a specific session
    mapping(uint => mapping(address => bool)) public hasVoted;

    // Custom Errors
    error OnlySessionCreator(uint sessionId);
    error VotingNotOpen();
    error InvalidMovieName();
    error VotingAlreadyClosed();
    error VotingNotStarted();
    error VotingAlreadyEnded();
    error AlreadyVoted();

    // Constructor
    constructor() {
        // No specific initialization required for now
    }

    // Function to create a voting session
    function createVotingSession(string[] memory movieNames, uint durationInMinutes) public {
        if (movieNames.length == 0) revert InvalidMovieName(); // Check for empty movie list

        VotingSession storage newSession = votingSessions.push();
        newSession.creator = msg.sender;
        newSession.movieNames = movieNames;
        newSession.startTime = block.timestamp;
        newSession.endTime = block.timestamp + (durationInMinutes * 1 minutes);
        newSession.isVotingOpen = true;
        newSession.isSessionComplete = false;

        uint sessionId = votingSessions.length - 1;
        sessionCreator[sessionId] = msg.sender;

        emit VotingSessionCreated(sessionId, msg.sender, movieNames);
    }

    // Modifiers
    modifier onlySessionCreator(uint sessionId) {
        if (msg.sender != sessionCreator[sessionId]) revert OnlySessionCreator(sessionId);
        _;
    }

    modifier onlyDuringVotingPeriod(uint sessionId) {
        VotingSession storage session = votingSessions[sessionId];
        if (block.timestamp < session.startTime) revert VotingNotStarted();
        if (block.timestamp > session.endTime) revert VotingAlreadyEnded();
        _;
    }

    // Function to cast a vote (one vote per user per session)
    function vote(uint sessionId, string memory movieName) public onlyDuringVotingPeriod(sessionId) {
        VotingSession storage session = votingSessions[sessionId];

        if (!session.isVotingOpen) revert VotingNotOpen();
        if (hasVoted[sessionId][msg.sender]) revert AlreadyVoted(); // Check if user has already voted

        // Ensure that the movie is valid
        bool validMovie = false;
        for (uint i = 0; i < session.movieNames.length; i++) {
            if (keccak256(abi.encodePacked(session.movieNames[i])) == keccak256(abi.encodePacked(movieName))) {
                validMovie = true;
                break;
            }
        }

        if (!validMovie) revert InvalidMovieName();

        session.votes[movieName]++;
        hasVoted[sessionId][msg.sender] = true; // Mark user as having voted

        emit VoteCast(sessionId, msg.sender, movieName);
    }

    // Function to end the voting session
    function endVoting(uint sessionId) public onlySessionCreator(sessionId) {
        VotingSession storage session = votingSessions[sessionId];
        if (!session.isVotingOpen) revert VotingAlreadyClosed();
    
        session.isVotingOpen = false;
        session.isSessionComplete = true;
    
        // Calculate the winner
        string memory winningMovie;
        uint maxVotes = 0;

        // Optimized voting tallying loop
        for (uint i = 0; i < session.movieNames.length; i++) {
            string memory movieName = session.movieNames[i];
            uint votesForMovie = session.votes[movieName];
            if (votesForMovie > maxVotes) {
                maxVotes = votesForMovie;
                winningMovie = movieName;
            }
        }
    
        emit VotingEnded(sessionId, winningMovie);
    }

    // Fallback function
    fallback() external payable {
        revert("Direct transfers not supported.");
    }

    // Receive function
    receive() external payable {
        // Logic can be added here if the contract needs to accept Ether
    }

    // Events
    event VotingSessionCreated(uint indexed sessionId, address indexed creator, string[] movieNames);
    event VoteCast(uint indexed sessionId, address indexed voter, string movieName);
    event VotingEnded(uint indexed sessionId, string winningMovie);
}
