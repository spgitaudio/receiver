let receivedAudio = document.getElementById("receivedAudio");
let receivedStream;

// 🎧 Play received WebRTC stream
//function playReceivedAudio(stream) {
//    receivedAudio.srcObject = stream;
//    receivedStream = stream;
//    console.log("🎙 Receiving & Playing WebRTC Audio...");
//}

function playReceivedAudio(stream) {
    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);

    console.log("🎙 WebRTC Received Stream:", stream);
    console.log("🎚 WebRTC Audio Tracks:", stream.getAudioTracks().length);
    console.log("🔍 Source Channel Count:", source.channelCount);

    // source.connect(audioContext.destination);
}

// 🎙 Start recording received audio
function startRecording() {
    if (!receivedStream) {
        console.warn("⚠ No incoming stream yet!");
        return;
    }
    startRecordingStream(receivedStream);
}

// 🛑 Stop recording
function stopRecording() {
    stopRecordingStream();
}
