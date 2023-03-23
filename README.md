# constance-ai
Constance: A French conversation practice chatbot

## Introduction
Meet Constance, your personal French-speaking chatbot, who's here to add a little "je ne sais quoi" to your language learning journey. With Constance, you can converse on a wide range of topics, from food to fashion, and she'll help you perfect your grammar like a true language expert. But unlike your traditional teacher, Constance won't make you feel like a fool for mispronouncing "croissant" (hey, we all have our struggles!). Whether you're a Francophile or just trying to impress your Tinder match who lives in France, Constance is the perfect companion to help you "parlez-vous français" with confidence and a little bit of "joie de vivre". So, let's get chatting with Constance!

## Development process

I used GPT-4 to write the boilerplate code for the chatbot. Then, I ran into an issue where the audio data passed from client to server was not in the correct format. Even when passing my errors back to GPT-4 , the helpfulness was limited. Eventually, by reading through Google Cloud Speech to Text docs and StackOverflow I was able to solve the issue. As I continue this project, I plan to use a mix of GPT-4 and manual code writing to add more features to the chatbot and make it more robust.

## How to run locally
1. Clone this repo locally
2. Create a google cloud project account (if you don't have one already)
3. Set up Google speech-to-text credentials https://cloud.google.com/speech-to-text/docs/before-you-begin
4. Set up Google text-to-speech credentials by enabling the text-to-speech API from your project created above
5. Save the [JSON service key](https://cloud.google.com/speech-to-text/docs/before-you-begin#create_a_json_key_for_your_service_account) to a file
6. Rename the file as gcp_keys.json and move to your cloned constance-ai repo under the constance folder
7. Create an [OpenAI API key](https://beta.openai.com/docs/api-keys)
8. Add a next.config.ts file to your project in the constance folder with the following contents:
```
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY:<your API key>
    GOOGLE_APPLICATION_CREDENTIALS: 'gcp_keys.json',
  },
}

module.exports = nextConfig;
```
9. Ensure you have node and typescript installed 
10. Install node modules
```
npm install
```
11. Run the following command to start the server:
```
npm run dev
```
12. Open your browser to http://localhost:3000


## TODOs

There are some major outstanding todos on the project.

Fixes + Maintenance:
- [ ] Better error handling if empty audio is passed to the google cloud speech to text api
- [ ] Handle case where "start recording" is pressed before page load
- [ ] Add tests
- [ ] Add ability to record multiple rounds of audio

New Features:
- [ ] Add better correction of grammar errors
- [ ] Add a fancier UI with text-message style conversation bubbles
- [ ] Add the ability to customize Constance's personality and background (e.g. pick a random country in the Francophonie)
