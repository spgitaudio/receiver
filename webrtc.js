let peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

peerConnection.onicecandidate = event => {
    if (event.candidate) {
        console.log("📡 ICE Candidate:", event.candidate.candidate);
    }
};

// 📡 Modify SDP to Force Opus & Stereo Decoding
function forceOpusSDP(sdp) {
    console.log("🔧 Modifying SDP for Opus Stereo Decoding...");
    return sdp
        .replace(/a=rtpmap:\d+ opus\/\d+/g, "a=rtpmap:111 opus/48000") // Force Opus codec with stereo
        .replace(/a=fmtp:\d+ /g, "a=fmtp:111 stereo=1; sprop-stereo=1; ") // Ensure stereo Opus
        .replace(/a=recvonly/g, "a=recvonly"); // Receiver only receives media
}

// 📡 Accept SDP Offer from Caller
async function setOffer() {
    let offer = JSON.parse(document.getElementById("offer").value);
    offer.sdp = forceOpusSDP(offer.sdp); // Modify SDP before setting
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("📡 SDP Offer Set! Now click 'Create Answer'.");
}

// 📡 Create & Send SDP Answer (Called Separately)
async function createAnswer() {
    console.log("📡 Creating SDP Answer...");
    let answer = await peerConnection.createAnswer();
    answer.sdp = forceOpusSDP(answer.sdp); // Modify SDP for Opus stereo
    await peerConnection.setLocalDescription(answer);
    document.getElementById("answer").value = JSON.stringify(answer);
    console.log("📡 SDP Answer Created:", JSON.stringify(answer));
}

// ✅ Detect When Streaming Starts
peerConnection.ontrack = event => {
    console.log("🎙 Received WebRTC Stereo Opus Stream!");
    playReceivedAudio(event.streams[0]); // Calls function in receiver.js
};
//peerConnection.ontrack = event => {
//    console.log("🎙 Received WebRTC Stereo Opus Stream!");
//
//    // Store the incoming stream
//    receivedStream = event.streams[0];
//
//    // Automatically start recording
//    console.log("🎙 Auto-starting recording...");
//    startRecordingStream(receivedStream); // Calls function in recorder.js for receiver
//};

// 🔄 Detect When ICE Connection Is Established
peerConnection.oniceconnectionstatechange = () => {
    console.log("🔄 ICE Connection State:", peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState === "connected") {
        console.log("✅ Streaming has started! WebRTC connection established.");
    }
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

function checkConnectionStatus() {
    if (!peerConnection) {
        console.log("❌ WebRTC connection is not initialized.");
        return;
    }

    console.log("🔄 Checking WebRTC Connection Status...");
    console.log("🔄 ICE Connection State:", peerConnection.iceConnectionState);
    console.log("🔄 Signaling State:", peerConnection.signalingState);
    console.log("🔄 Connection State:", peerConnection.connectionState);
}