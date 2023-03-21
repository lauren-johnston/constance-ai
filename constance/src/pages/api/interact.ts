// pages/api/interact.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { interactWithUser } from './chatbot';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // check for body = empty string
      if (!req.body) {
        res.status(400).json({ message: 'Body is empty' });
        return;
      }

      // Assuming that the frontend sends audio data as binary in the request body
      const audioInput = Buffer.from(req.body);
      const audioOutput = await interactWithUser(audioInput);

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
