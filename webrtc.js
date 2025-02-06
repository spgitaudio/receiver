let peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

peerConnection.onicecandidate = event => {
    if (event.candidate) {
        console.log("📡 ICE Candidate:", event.candidate.candidate);
    }
};

// 📥 Accepts the SDP Offer from the Caller
async function setOffer() {
    let offer = JSON.parse(document.getElementById("offer").value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("📡 SDP Offer Set! Creating Answer...");
}

// 📡 Creates SDP Answer & Displays It for the Caller
async function createAnswer() {
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    document.getElementById("answer").value = JSON.stringify(answer);
    console.log("📡 SDP Answer Created:", JSON.stringify(answer));
}

// 🎧 When Audio Stream is Received, Play It
peerConnection.ontrack = event => {
    console.log("🎙 Received Audio Stream!");
    playReceivedAudio(event.streams[0]);
};

// 📡 Handles ICE Candidate Exchange
peerConnection.onicecandidate = event => {
    if (event.candidate) {
        console.log("📡 ICE Candidate:", event.candidate.candidate);
    }
};

// 🎯 Accept Caller’s SDP Answer (Only if Reconnection is Needed)
async function setAnswer() {
    let answer = JSON.parse(document.getElementById("answer").value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("✅ SDP Answer Set! Connection Established.");
}

// 🔄 Detect When ICE Connection Is Established
peerConnection.oniceconnectionstatechange = () => {
    console.log("🔄 ICE Connection State:", peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState === "connected") {
        console.log("✅ Streaming has started! WebRTC connection established.");
    }
};