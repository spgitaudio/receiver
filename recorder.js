let mediaRecorder;
let recordedChunks = [];

// 🎙 Start recording received WebRTC stream
//function startRecordingStream(stream) {
//    recordedChunks = [];
//
//    // 🔹 Convert to WAV Instead of WebM
//    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
//
//    mediaRecorder.ondataavailable = event => {
//        if (event.data.size > 0) {
//            recordedChunks.push(event.data);
//        }
//    };
//
//    mediaRecorder.onstop = saveRecordingAsWav;
//    mediaRecorder.start();
//    console.log("🎙 Recording started... (Saving as WAV)");
//}

//function startRecordingStream(stream) {
//    if (!stream || stream.getAudioTracks().length === 0) {
//        console.error("❌ No valid audio stream available for recording!");
//        return;
//    }
//
//    let audioTrack = stream.getAudioTracks()[0];
//
//    console.log(`🎤 Checking received audio: ID=${audioTrack.id}, Enabled=${audioTrack.enabled}, Muted=${audioTrack.muted}`);
//
//    // ✅ Wait until actual audio samples arrive before starting recording
//    let checkAudioInterval = setInterval(() => {
//        if (!audioTrack.muted) { // ✅ Only start if audio is NOT muted
//            console.log("📡 ✅ Audio samples detected! Starting recording...");
//            clearInterval(checkAudioInterval); // ✅ Stop checking once recording starts
//
//            // 🔹 Start recording only after real audio is detected
//            recordedChunks = [];
//            mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
//
//            mediaRecorder.ondataavailable = event => {
//                if (event.data.size > 0) {
//                    recordedChunks.push(event.data);
//                    console.log(`🎧 Recorded data chunk: ${event.data.size} bytes`);
//                } else {
//                    console.warn("⚠ Received empty data chunk!");
//                }
//            };
//
//            mediaRecorder.onstop = saveRecordingAsWav;
//            mediaRecorder.start();
//            console.log("🎙 Recording started... (Saving as WAV)");
//        } else {
//            console.warn("⚠ Waiting for actual audio samples...");
//        }
//    }, 1000); // Retry every 1 second
//}

function startRecordingStream(stream) {
    if (!stream || stream.getAudioTracks().length === 0) {
        console.error("❌ No valid audio stream available for recording!");
        return;
    }

    let audioTrack = stream.getAudioTracks()[0];

    console.log(`🎤 Checking received audio: ID=${audioTrack.id}, Enabled=${audioTrack.enabled}, Muted=${audioTrack.muted}`);

    // ✅ Wait until actual audio samples arrive before starting recording
    let checkAudioInterval = setInterval(() => {
        if (!audioTrack.muted) { // ✅ Only start if audio is NOT muted
            console.log("📡 ✅ Audio samples detected! Starting recording...");
            clearInterval(checkAudioInterval); // ✅ Stop checking once recording starts

            // 🔹 Start recording only after real audio is detected
            recordedChunks = [];
            mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                    console.log(`🎧 Recorded data chunk: ${event.data.size} bytes`);
                } else {
                    console.warn("⚠ Received empty data chunk!");
                }
            };

            mediaRecorder.onstop = () => {
                console.log("🛑 Recording stopped. Total chunks recorded:", recordedChunks.length);
                saveRecordingAsWav();
            };

            mediaRecorder.start();
            console.log("🎙 Recording started... (Saving as WAV)");
        } else {
            console.warn("⚠ Waiting for actual audio samples...");
        }
    }, 1000); // Retry every 1 second
}

// 🛑 Stop recording & save the file
function stopRecordingStream() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("🛑 Recording stopped.");
    }
}

// 💾 Convert WebM to WAV & Save
//function saveRecordingAsWav() {
//    if (recordedChunks.length === 0) {
//        console.error("❌ No recorded data available! Cannot decode.");
//        return;
//    }
//
//    console.log("💾 Saving recorded WebRTC audio...");
//    const blob = new Blob(recordedChunks, { type: "audio/webm" });
//
//    // Convert WebM Blob to WAV using Web Audio API
//    let fileReader = new FileReader();
//    fileReader.readAsArrayBuffer(blob);
//
////    fileReader.onloadend = () => {
////        let audioContext = new AudioContext();
////        audioContext.decodeAudioData(fileReader.result, buffer => {
////            let wavBuffer = encodeWav(buffer);
////            let wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
////
////            // Create download link
////            const url = URL.createObjectURL(wavBlob);
////            const downloadLink = document.getElementById("downloadLink");
////
////            filename = "received_audio.wav"
////            downloadLink.href = url;
////            downloadLink.download = filename;
////            downloadLink.style.display = "block";
////            downloadLink.textContent = "Download Recorded WAV";
////            console.log(`✅ File ready: ${filename}`);
////        });
////    };
//
//    fileReader.onloadend = () => {
//        let audioContext = new AudioContext();
//
//        audioContext.decodeAudioData(fileReader.result)
//            .then(buffer => {
//                let wavBuffer = encodeWav(buffer);
//                let wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
//
//                filename = "received_audio.wav"
//                downloadLink.href = url;
//                downloadLink.download = filename;
//                downloadLink.style.display = "block";
//                downloadLink.textContent = "Download Recorded WAV";
//                console.log(`✅ File ready: ${filename}`);
//            })
//            .catch(error => {
//                console.error("❌ Error decoding WebM audio:", error);
//                console.error("⚠ Possible cause: Empty or corrupted recording.");
//            });
//    };
//
//}

function saveRecordingAsWav() {
    if (recordedChunks.length === 0) {
        console.error("❌ No recorded data available! Cannot decode.");
        return;
    }

    console.log(`💾 Saving ${recordedChunks.length} chunks of recorded WebRTC audio...`);
    const blob = new Blob(recordedChunks, { type: "audio/webm" });

    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(blob);

    fileReader.onloadend = () => {
        let audioContext = new AudioContext();

        audioContext.decodeAudioData(fileReader.result)
            .then(buffer => {
                let wavBuffer = encodeWav(buffer);
                let wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

                // ✅ Create a download link
                const url = URL.createObjectURL(wavBlob);
                const downloadLink = document.getElementById("downloadLink");

                filename = "received_audio.wav"
                downloadLink.href = url;
                downloadLink.download = filename;
                downloadLink.style.display = "block";
                downloadLink.textContent = "Download Recorded WAV";
                console.log(`✅ File ready: ${filename}`);
            })
            .catch(error => {
                console.error("❌ Error decoding WebM audio:", error);
                console.error("⚠ Possible cause: Empty or corrupted recording.");
            });
    };
}

// 🎙 WAV Encoding Function (Stereo Support)
function encodeWav(audioBuffer) {
    let numOfChannels = audioBuffer.numberOfChannels; // ✅ Detects number of channels
    let sampleRate = audioBuffer.sampleRate;

    let samplesL = audioBuffer.getChannelData(0); // Left Channel
    let samplesR = numOfChannels > 1 ? audioBuffer.getChannelData(1) : samplesL; // Right Channel (or duplicate Left if mono)

    console.log("🔍 Encoding WAV:");
    console.log("🎙 Number of Channels:", numOfChannels);
    console.log("🎚 Sample Rate:", sampleRate);
    console.log("🎧 Total Left Samples:", samplesL.length);
    console.log("🎤 Total Right Samples:", samplesR.length);

    let interleaved = new Float32Array(samplesL.length * 2);
    for (let i = 0; i < samplesL.length; i++) {
        interleaved[i * 2] = samplesL[i]; // Left
        interleaved[i * 2 + 1] = samplesR[i]; // Right
    }

    let buffer = new ArrayBuffer(44 + interleaved.length * 2);
    let view = new DataView(buffer);

    // Write WAV Header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true); // ✅ Ensure 2 channels
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2 * 2, true);
    view.setUint16(32, 2 * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, interleaved.length * 2, true);

    // Write PCM Data
    let offset = 44;
    for (let i = 0; i < interleaved.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, interleaved[i]));
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

