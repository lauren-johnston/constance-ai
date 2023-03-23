import { useRef, useState } from 'react';
import { getWaveBlob } from "webm-to-wav-converter";

const Chatbot = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }
  
    // Request user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
  
    const audioChunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
  
    mediaRecorder.onstop = async () => {
      // Combine audio chunks into a single Blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const wavBlob = await getWaveBlob(audioBlob,false);
      setAudioBlob(wavBlob);
    };
  
    // Start recording
    mediaRecorder.start();
    setIsRecording(true);
  };
  
  const sendAudioToChatbot = async (audioBlob: Blob) => {
    if (!audioBlob) {
      console.error('No audio to send');
      return;
    }
    console.log('Sending audio to chatbot...');
  
    // Create a FormData instance
    const formData = new FormData();
    const file = new File([audioBlob], "audio.wav", {lastModified: Date.now()});

    formData.append('audio', file);

    try {
      const response = await fetch('/api/interact', {
        method: 'POST',
        body: formData, // Send the FormData instance as the request body
      });

      if (response.ok) {
        const audioOutput = await response.blob();
        // Play the chatbot's audio response
        const audioUrl = URL.createObjectURL(audioOutput);
        const audioElement = new Audio(audioUrl);
        audioElement.play();
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {/* Record button */}
      <button onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {/* Send audio to chatbot button */}
      {audioBlob && (
        <button onClick={() => sendAudioToChatbot(audioBlob)}>
          Send Audio to Chatbot
        </button>
      )}
    </div>
  );
};

export default Chatbot;