import Firebase from "firebase";

let PC = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

class RTCClient {
    constructor() {
        this.id;              // Our unique this.id
        this.sharedKey;       // Unique identifier for two clients to find each other
        this.remote;          // this.id of the this.remote peer -- set once they send an offer
        this.peerConnection;  // This is our WebRTC connection
        this.dataChannel;     // This is our outgoing data channel within WebRTC
        this.running = false; // Keep track of our connection state

        // Use Google's public this.servers for STUN
        // STUN is a component of the actual WebRTC connection
        this.servers = {
          iceServers: [ {
            url : 'stun:stun.l.google.com:19302'
          } ]
        };

        // Generate this browser a unique this.id
        // On Firebase peers use this unique this.id to address messages to each other
        // after they have found each other in the announcement channel
        this.id = Math.random().toString().replace('.', '');

        // Unique identifier for two clients to use
        // They MUST share this to find each other
        // Each peer waits in the announcement channel to find its matching identifier
        // When it finds its matching identifier, it initiates a WebRTC offer with
        // that client. This unique identifier can be pretty much anything in practice.
        // Configure, connect, and set up Firebase
        this.sharedKey = prompt("Please enter a shared identifier");

        // You probably want to replace the text below with your own Firebase URL
        this.firebaseUrl = 'https://amber-fire-244.firebaseio.com/';
        this.database = new Firebase(this.firebaseUrl);
        this.announceChannel = this.database.child('announce');
        this.signalChannel = this.database.child('messages').child(this.id);
        this.signalChannel.on('child_added', this.handleSignalChannelMessage.bind(this));
        this.announceChannel.on('child_added', this.handleAnnounceChannelMessage.bind(this));

        // Send a message to the announcement channel
        // If our partner is already waiting, they will send us a WebRTC offer
        // over our Firebase signalling channel and we can begin delegating WebRTC
        this.sendAnnounceChannelMessage();
    }

    /* WebRTC Demo
     * Allows two clients to connect via WebRTC with Data Channels
     * Uses Firebase as a signalling server
     * http://fosterelli.co/getting-started-with-webrtc-data-channels.html
     */

    /* == Announcement Channel Functions ==
     * The 'announcement channel' allows clients to find each other on Firebase
     * These functions are for communicating through the announcement channel
     * This is part of the signalling server mechanism
     *
     * After two clients find each other on the announcement channel, they
     * can directly send messages to each other to negotiate a WebRTC connection
     */

    // Announce our arrival to the announcement channel
    sendAnnounceChannelMessage() {
      let sk = this.sharedKey;
      let tid = this.id;
      let aChannel = this.announceChannel;
      this.announceChannel.remove(function() {
        aChannel.push({
          sharedKey : sk,
          id : tid
        });
        console.log('Announced our this.sharedKey is ' + this.sharedKey);
        console.log('Announced our this.id is ' + this.id);
      }.bind(this));
    };

    // Handle an incoming message on the announcement channel
    handleAnnounceChannelMessage(snapshot) {
      var message = snapshot.val();
      if (message.id != this.id && message.sharedKey == this.sharedKey) {
        console.log('Discovered matching announcement from ' + message.id);
        this.remote = message.id;
        this.initiateWebRTCState();
        this.connect();
      }
    };

    /* == Signal Channel Functions ==
     * The signal channels are used to delegate the WebRTC connection between
     * two peers once they have found each other via the announcement channel.
     *
     * This is done on Firebase as well. Once the two peers communicate the
     * necessary information to 'find' each other via WebRTC, the signalling
     * channel is no longer used and the connection becomes peer-to-peer.
     */

    // Send a message to the this.remote client via Firebase
    sendSignalChannelMessage(message) {
      message.sender = this.id;
      this.database.child('messages').child(this.remote).push(message);
    };

    // Handle a WebRTC offer request from a this.remote client
    handleOfferSignal(message) {
      this.running = true;
      this.remote = message.sender;
      this.initiateWebRTCState();
      this.startSendingCandidates();
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
      this.peerConnection.createAnswer(function(sessionDescription) {
        console.log('Sending answer to ' + message.sender);
        this.peerConnection.setLocalDescription(sessionDescription);
        this.sendSignalChannelMessage(sessionDescription);
      }.bind(this));
    };

    // Handle a WebRTC answer response to our offer we gave the this.remote client
    handleAnswerSignal(message) {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    };

    // Handle an ICE candidate notification from the this.remote client
    handleCandidateSignal(message) {
      var candidate = new RTCIceCandidate(message);
      this.peerConnection.addIceCandidate(candidate);
    };

    // This is the general handler for a message from our this.remote client
    // Determine what type of message it is, and call the appropriate handler
    handleSignalChannelMessage(snapshot) {
      var message = snapshot.val();
      var sender = message.sender;
      var type = message.type;
      console.log('Recieved a \'' + type + '\' signal from ' + sender);
      if (type == 'offer') this.handleOfferSignal(message);
      else if (type == 'answer') this.handleAnswerSignal(message);
      else if (type == 'candidate' && this.running) this.handleCandidateSignal(message);
    };

    /* == ICE Candidate Functions ==
     * ICE candidates are what will connect the two peers
     * Both peers must find a list of suitable candidates and exchange their list
     * We exchange this list over the signalling channel (Firebase)
     */

    // Add listener functions to ICE Candidate events
    startSendingCandidates() {
      this.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChange.bind(this);
      this.peerConnection.onicecandidate = this.handleICECandidate.bind(this);
    };

    // This is how we determine when the WebRTC connection has ended
    // This is most likely because the other peer left the page
    handleICEConnectionStateChange() {
      if (this.peerConnection.iceConnectionState == 'disconnected') {
        console.log('Client disconnected!');
        this.sendAnnounceChannelMessage();
      }
    };

    // Handle ICE Candidate events by sending them to our this.remote
    // Send the ICE Candidates via the signal channel
    handleICECandidate(event) {
      var candidate = event.candidate;
      if (candidate) {
        candidate.type = 'candidate';
        console.log('Sending candidate to ' + this.remote);
        this.sendSignalChannelMessage(candidate);
      } else {
        console.log('All candidates sent');
      }
    };

    /* == Data Channel Functions ==
     * The WebRTC connection is established by the time these functions run
     * The hard part is over, and these are the functions we really want to use
     *
     * The functions below relate to sending and receiving WebRTC messages over
     * the peer-to-peer data channels
     */

    // This is our receiving data channel event
    // We receive this channel when our peer opens a sending channel
    // We will bind to trigger a handler when an incoming message happens
    handleDataChannel(event) {
      event.channel.onmessage = this.handleDataChannelMessage;
    };

    // This is called on an incoming message from our peer
    // You probably want to overwrite this to do something more useful!
    handleDataChannelMessage(event) {
      console.log('Recieved Message: ' + event.data);
      document.write(event.data);
    };

    // This is called when the WebRTC sending data channel is offically 'open'
    handleDataChannelOpen() {
      console.log('Data channel created!');
      this.dataChannel.send('Hello! I am an IP address ' + this.id);
    };

    // Called when the data channel has closed
    handleDataChannelClosed() {
      console.log('The data channel has been closed!');
    };

    // Function to offer to start a WebRTC connection with a peer
    connect() {
      this.running = true;
      this.startSendingCandidates();
      this.peerConnection.createOffer(function(sessionDescription) {
        console.log('Sending offer to ' + this.remote);
        this.peerConnection.setLocalDescription(sessionDescription);
        this.sendSignalChannelMessage(sessionDescription);
      }.bind(this));
    };

    // Function to initiate the WebRTC peerconnection and this.dataChannel
    initiateWebRTCState() {
      this.peerConnection = new webkitRTCPeerConnection(this.servers);
      this.peerConnection.ondatachannel = this.handleDataChannel;
      this.dataChannel = this.peerConnection.createDataChannel('myDataChannel');
      this.dataChannel.onmessage = this.handleDataChannelMessage;
      this.dataChannel.onopen = this.handleDataChannelOpen.bind(this);
    };

}

let client = new RTCClient();

export default client;

