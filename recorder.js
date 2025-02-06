let mediaRecorder;
let recordedChunks = [];

// 🎙 Start recording received WebRTC stream
function startRecordingStream(stream) {
    recordedChunks = [];

    // 🔹 Convert to WAV Instead of WebM
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = saveRecordingAsWav;
    mediaRecorder.start();
    console.log("🎙 Recording started... (Saving as WAV)");
}

// 🛑 Stop recording & save the file
function stopRecordingStream() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("🛑 Recording stopped.");
    }
}

// 💾 Convert WebM to WAV & Save
function saveRecordingAsWav() {
    const blob = new Blob(recordedChunks, { type: "audio/webm" });

    // Convert WebM Blob to WAV using Web Audio API
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(blob);

    fileReader.onloadend = () => {
        let audioContext = new AudioContext();
        audioContext.decodeAudioData(fileReader.result, buffer => {
            let wavBuffer = encodeWav(buffer);
            let wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

            // Create download link
            const url = URL.createObjectURL(wavBlob);
            const downloadLink = document.getElementById("downloadLink");

            downloadLink.href = url;
            downloadLink.download = "received_audio.wav";
            downloadLink.style.display = "block";
            downloadLink.textContent = "Download Recorded WAV";
        });
    };
}

// 🎙 WAV Encoding Function (Stereo Support)
function encodeWav(audioBuffer) {
    let numOfChannels = audioBuffer.numberOfChannels;
    let sampleRate = audioBuffer.sampleRate;
    let samples = audioBuffer.getChannelData(0);
    let buffer = new ArrayBuffer(44 + samples.length * 2);
    let view = new DataView(buffer);

    // WAV Header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * 2, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    // PCM Data
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
}

// 📝 Write ASCII Characters to WAV Header
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
