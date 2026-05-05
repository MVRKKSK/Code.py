import supabase from '../supabase.js';
import crypto from 'crypto';
import { generateStructuredQuestions } from '../utils/gemini.js';

const normalizeVariables = (vars) => {
  const result = {};

  for (const key in vars) {
    const value = vars[key];

    // convert numeric strings to numbers
    if (!isNaN(value) && value !== "") {
      result[key] = Number(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

export const generateTest = async (req, res) => {
  try {
    const { prompt, language = 'Python', difficulty = 'easy', count = 5 } = req.body;
    const userId = req.user?.id;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }
    const raw = await generateStructuredQuestions({
      prompt,
      language,
      difficulty,
      count
    });
    let questions;
    try {
      questions = JSON.parse(raw);
    } catch (err) {
      console.error("❌ RAW LLM OUTPUT:", raw);
      return res.status(400).json({
        error: "Invalid JSON from LLM",
        raw
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "No valid questions generated" });
    }

    // 🔥 3. Create test
    const testId = `test-${Date.now()}`;

    const { error: testError } = await supabase
      .from('practice_tests')
      .insert({
        id: testId,
        title: `${language} ${difficulty} test - ${prompt.slice(0, 30)}`,
        language,
        difficulty,
        tags: [],
        total_questions: questions.length,
        // optional if you added column:
        // created_by: userId
      });

    if (testError) {
      console.error(testError);
      return res.status(500).json({ error: testError.message });
    }

    // 🔥 4. Insert problems + mapping
    for (let i = 0; i < questions.length; i++) {
  const q = questions[i];

  console.log(`👉 Inserting question ${i}`);

  const problemId = crypto.randomUUID();

  const { error: problemError } = await supabase
    .from('practice_problems')
    .insert({
      id: problemId,
      language: q.language || language,
      difficulty: q.difficulty || difficulty,
      code: q.code,
      expected_output: q.expected_output,
      explanation: q.explanation,
      tags: q.tags || [],
      execution_trace: q.execution_trace
    });

  if (problemError) {
    console.error("❌ Problem insert failed:", problemError);
    throw problemError; // 🔥 STOP EVERYTHING
  }

  const { error: mapError } = await supabase
    .from('practice_test_questions')
    .insert({
      test_id: testId,
      question_id: problemId,
      order_index: i
    });

  if (mapError) {
    console.error("❌ Mapping insert failed:", mapError);
    throw mapError; // 🔥 STOP EVERYTHING
  }

  console.log(`✅ Inserted question ${i}`);
}

    // ✅ Success
    console.log("🔥 Creating test:", testId);
    return res.json({ test_id: testId });

  } catch (err) {
    console.error("🔥 generateTest error:", err);
    return res.status(500).json({ error: err.message });
  }
};