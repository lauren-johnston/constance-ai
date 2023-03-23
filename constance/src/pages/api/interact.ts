// pages/api/interact.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { interactWithUser } from './chatbot';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';

// Next js by default applies body parsing logic: this block of code enables
// parsing the form data properly by removing the default logic 
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const formData = await new Promise<{ [key: string]: File }>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, _fields, files) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(files);
        });
      });


      const audioFile = await formData.audio;
      if (!audioFile) {
        res.status(400).json({ message: 'No audio file found' });
        return;
      }

      const audioBuffer = await fs.readFile(audioFile.filepath);
      const audioOutput = await interactWithUser(audioBuffer);

      res.status(200).send(audioOutput);
    } catch (error) {
      console.error('Error during interaction:', error);
      res.status(500).json({ message: 'An error occurred during the interaction.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed. Use POST.' });
  }
};

export default handler;
