import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not defined');
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIResponse(message) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hello, I have 2 dogs in my house.' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Great to meet you. What would you like to know?' }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}

export const getResponse = async (req, res) => {
  const userMessage = req.body.message;
  try {
    const aiResponse = await getAIResponse(userMessage);
    res.json({ response: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
