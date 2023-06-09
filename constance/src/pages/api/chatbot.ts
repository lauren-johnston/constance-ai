import { SpeechClient } from '@google-cloud/speech';
import axios from 'axios';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const speechClient = new SpeechClient();
const gptApiKey = process.env.OPENAI_API_KEY;
const ttsClient = new TextToSpeechClient();

async function transcribe(audio: Buffer): Promise<string> {
  const request = {
    audio: {
      content: audio.toString('base64'),
    },
    config: {
      encoding: "LINEAR-16",
      sampleRateHertz: 48000,
      languageCode: 'fr-FR',
    },
  };

  const [response] = await speechClient.recognize(request);
  const transcription = response.results
      .map((result: { alternatives: { transcript: any; }[]; }) => result.alternatives[0].transcript)
      .join('\n');
  return transcription;
}

async function getGptResponse(inputText: string): Promise<string> {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      messages: [{"role": "user", "content": inputText}],
      max_tokens: 100,
      model: 'gpt-3.5-turbo',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptApiKey}`,
      },
    },
  );
  return response.data.choices[0]['message']['content'];
}

function suggestCorrections(userInput: string, gptOutput: string): string {
  // Here you can add custom logic to analyze and compare userInput and gptOutput
  return gptOutput;
}

async function synthesizeSpeech(text: string): Promise<Buffer> {
  const request = {
    input: { text },
    voice: { languageCode: 'fr-FR', ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  const audio = Buffer.from(response.audioContent, 'base64');
  return audio;
}

export async function interactWithUser(audioInput: Buffer): Promise<Buffer> {
  // Transcribe user's audio input into text
  const inputText = await transcribe(audioInput);
  console.log(`User input: ${inputText}`);

  // throw an error if the user input is empty
  if (!inputText) {
    throw new Error('User input is empty');
  }

  // Send text input to GPT API and get a response
  const gptResponse = await getGptResponse(inputText);
  console.log(`GPT response: ${gptResponse}`);

  // Analyze user input and GPT output, suggest corrections if needed
  const correctedText = suggestCorrections(inputText, gptResponse);
  console.log(`Corrected text: ${correctedText}`);

  // Convert chatbot's text response into audio
  const audioOutput = await synthesizeSpeech(correctedText);
  
  return audioOutput;
}