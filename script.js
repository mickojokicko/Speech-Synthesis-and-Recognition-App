"use strict";
const butttonPlay = document.getElementById("btnSpeech");
const btnRecord = document.getElementById("btnRecord");
let voiceSelect = document.getElementById("voiceSelect");

let speech = new SpeechSynthesisUtterance();
let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[0];

  voices.forEach(
    (voice, i) => (voiceSelect.options[i] = new Option(voice.name, i))
  );
};

voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

butttonPlay.addEventListener("click", () => {
  speech.text = document.querySelector("textarea").value;
  window.speechSynthesis.speak(speech);
});

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "en-GB";

  const button = document.getElementById("btnRecord");
  const transcriptArea = document.getElementById("transcript");
  let isRecording = false;

  button.addEventListener("click", () => {
    if (isRecording) {
      recognition.stop();

      button.textContent = "Start recording";
      transcriptArea.value = "";
    } else {
      recognition.start();
      button.textContent = "Stop Recording";
    }
    isRecording = !isRecording;
  });

  recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");

    transcriptArea.value = transcript;

    if (event.results[0].isFinal) {
      transcriptArea.value += "\n";
    }
  });

  recognition.addEventListener("end", () => {
    if (isRecording) {
      recognition.start(); // Restart recognition if still recording
    }
  });

  recognition.addEventListener("error", (event) => {
    console.error(event.error);
  });
} else {
  console.log("This broeser don't support  SpeechRecognition API.");
}
