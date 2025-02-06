let mediaRecorder;
let recordedChunks = [];

// 🎙 Start recording received WebRTC stream
function startRecordingStream(stream) {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = saveRecording;
    mediaRecorder.start();
    console.log("🎙 Recording started...");
}

// 🛑 Stop recording & save the file
function stopRecordingStream() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("🛑 Recording stopped.");
    }
}

// 💾 Save recorded file
function saveRecording() {
    const blob = new Blob(recordedChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById("downloadLink");

    downloadLink.href = url;
    downloadLink.download = "received_audio.webm";
    downloadLink.style.display = "block";
    downloadLink.textContent = "Download Recorded Audio";
}
