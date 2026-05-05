import supabase from '../supabase.js';

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
console.log(userId)
    // 1. summary
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      return res.status(500).json({ error: progressError.message });
    }

    // 2. recent tests (last 5)
    const { data: tests, error: testError } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (testError) {
      return res.status(500).json({ error: testError.message });
    }

    // 3. recent questions (last 10)
    const { data: history, error: historyError } = await supabase
      .from('exercise_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) {
      return res.status(500).json({ error: historyError.message });
    }

    return res.json({
      progress: progress || {
        total_attempts: 0,
        correct_answers: 0,
        current_streak: 0,
        best_streak: 0
      },
      testHistory: tests,
      exerciseHistory: history
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/progress/exercise
export const submitExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problem_id, was_correct, similarity_score, code, language } = req.body;

    // 1. insert attempt
    await supabase.from('exercise_attempts').insert({
      user_id: userId,
      problem_id,
      was_correct,
      similarity_score,
      code,
      language
    });

    // 2. get current progress
    let { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    const today = new Date().toISOString().split('T')[0];

    if (!progress) {
      progress = {
        total_attempts: 0,
        correct_answers: 0,
        current_streak: 0,
        best_streak: 0,
        last_practice_date: null
      };
    }

    // 3. update streak logic
    let currentStreak = progress.current_streak || 0;

    if (progress.last_practice_date) {
      const lastDate = new Date(progress.last_practice_date);
      const diff = Math.floor(
  (new Date(today) - new Date(progress.last_practice_date)) / (1000 * 60 * 60 * 24)
);

      if (diff === 1) currentStreak += 1;
      else if (diff > 1) currentStreak = 1;
    } else {
      currentStreak = 1;
    }

    const bestStreak = Math.max(currentStreak, progress.best_streak || 0);

    // 4. update summary
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        total_attempts: (progress.total_attempts || 0) + 1,
        correct_answers: (progress.correct_answers || 0) + (was_correct ? 1 : 0),
        current_streak: currentStreak,
        best_streak: bestStreak,
        last_practice_date: today,
        updated_at: new Date()
      });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Exercise recorded' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/progress/test
export const submitTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { test_id, score, correct_answers, total_questions, duration } = req.body;

    // 1. store test
    const { error } = await supabase.from('test_attempts').insert({
      user_id: userId,
      test_id,
      score,
      correct_answers,
      total_questions,
      duration
    });

    if (error) return res.status(500).json({ error: error.message });

    // 2. update summary
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    await supabase.from('user_progress').upsert({
      user_id: userId,
      total_attempts: (progress?.total_attempts || 0) + total_questions,
      correct_answers: (progress?.correct_answers || 0) + correct_answers,
      updated_at: new Date()
    });

    res.json({ message: 'Test recorded' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // delete exercise attempts
    await supabase
      .from('exercise_attempts')
      .delete()
      .eq('user_id', userId);

    // delete test attempts
    await supabase
      .from('test_attempts')
      .delete()
      .eq('user_id', userId);

    // reset summary
    await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        total_attempts: 0,
        correct_answers: 0,
        current_streak: 0,
        best_streak: 0,
        last_practice_date: null
      });

    res.json({ message: "Progress reset successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};