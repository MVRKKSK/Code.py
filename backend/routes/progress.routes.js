import express from 'express';
import {
  getUserProgress,
  resetProgress,
  submitExercise,
  submitTest
} from '../controller/progress.controller.js';

const router = express.Router();
router.get('/getProgress', getUserProgress);
router.post('/exercise', submitExercise);
router.delete('/reset', resetProgress);
router.post('/test', submitTest);

export default router;