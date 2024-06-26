import 'dotenv/config';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Basic route for root URL
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const userMessage = message.toString();
    console.log('Received message:', userMessage);

    try {
      const geminiApiKey = process.env.GEMINI_API_KEY || ''; 
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContentStream([userMessage]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        ws.send(JSON.stringify({ title: 'AI', details: chunkText }));
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected: ${code} - ${reason}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
