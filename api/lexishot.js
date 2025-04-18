export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let input = null;

  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const body = JSON.parse(Buffer.concat(buffers).toString());
    input = body.input;

    if (!input) {
      return res.status(400).json({ error: 'Missing input' });
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON or missing input' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: "Tu es Lexi DéCode. Traduis les phrases RH en vérité brute en une seule ligne. Style direct, ironique, punchy.",
          },
          {
            role: 'user',
            content: input,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.status(200).json({ output: data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
