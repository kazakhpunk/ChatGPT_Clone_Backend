import { Router } from 'express';
import { getResponse } from './gemini-controller';

const geminiRouter = Router();

geminiRouter.post('/get-response', getResponse);

export default geminiRouter;
