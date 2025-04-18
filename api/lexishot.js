export default async function handler(req, res) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Missing input' });
  }

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
}
