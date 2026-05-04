import supabase from '../supabase.js';
export const getTests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('practice_tests')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('practice_tests')
      .select(`
        id, title, language, difficulty, tags, total_questions,
        practice_test_questions (
          order_index,
          practice_problems (
            id,
            language,
            difficulty,
            code,
            expected_output,
            explanation,
            tags,
            execution_trace
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    const questions = data.practice_test_questions
      .sort((a, b) => a.order_index - b.order_index)
      .map(q => q.practice_problems);

    res.json({
      ...data,
      questions
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getPracticeProblems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};