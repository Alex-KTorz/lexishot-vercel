// api/chat.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  // Vérifier que la méthode est bien POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu es Lexi, une intelligence artificielle créative qui accompagne Alex dans ses projets." },
        { role: "user", content: message }
      ],
    });

    res.status(200).json({ 
      reply: response.data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}
