let receivedAudio = document.getElementById("receivedAudio");
let receivedStream;

// 🎧 Play received WebRTC stream
function playReceivedAudio(stream) {
    receivedAudio.srcObject = stream;
    receivedStream = stream;
    console.log("🎙 Receiving & Playing WebRTC Audio...");
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
