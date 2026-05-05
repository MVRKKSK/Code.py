import express from 'express';
import { generateTest } from '../controller/gemini.controller.js';

const router = express.Router();

router.post('/generate', generateTest);

export default router;