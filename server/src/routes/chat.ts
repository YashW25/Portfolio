import { Router } from 'express';
import { chatService } from '../services/ChatService';

const router = Router();

router.post('/', async (req, res) => {
  const { sessionId, message, history } = req.body;
  
  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required' });
  }

  // Set up Server-Sent Events (SSE)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  try {
    await chatService.handleChat(sessionId, message, history || [], (chunk) => {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    });
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error("Chat Route Error:", error);
    res.write(`data: ${JSON.stringify({ error: 'Internal Server Error' })}\n\n`);
    res.end();
  }
});

export default router;
