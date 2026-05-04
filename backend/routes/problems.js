// routes/practice.routes.js
import express from 'express';
import { getPracticeProblems, getTestById, getTests } from '../controller/tests.controller.js';

const router = express.Router();

router.get('/practice', getTests);
router.get('/tests/:id', getTestById);

export default router;  