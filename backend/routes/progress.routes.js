import express from 'express';
import {
  getUserProgress,
  submitExercise,
  submitTest
} from '../controller/progress.controller.js';

const router = express.Router();
router.get('/getProgress', getUserProgress);
router.post('/exercise', submitExercise);
router.post('/test', submitTest);

export default router;