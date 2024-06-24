import { Router } from 'express';
import geminiRouter from './gemini/gemini-router';

const globalRouter = Router();

// Use the geminiRouter for handling requests
globalRouter.use(geminiRouter);

export default globalRouter;
