import supabase from './supabase.js';

const mappingsData = [
  { test_id: 'test-1', count: 10 },
  { test_id: 'test-2', count: 10 },
  { test_id: 'test-3', count: 12 },
  { test_id: 'test-4', count: 12 },
  { test_id: 'test-5', count: 15 },
  { test_id: 'test-6', count: 15 }
];

const seedMappings = async () => {
  for (const test of mappingsData) {

    // 🧹 delete old mappings (safe reset)
    await supabase
      .from('practice_test_questions')
      .delete()
      .eq('test_id', test.test_id);

    // 🔗 create mappings
    const mappings = Array.from({ length: test.count }, (_, i) => ({
      test_id: test.test_id,
      question_id: String(i + 1), // MUST match practice_problems.id
      order_index: i + 1
    }));

    const { error } = await supabase
      .from('practice_test_questions')
      .insert(mappings);

    if (error) {
      console.log(`❌ Failed: ${test.test_id}`, error.message);
    } else {
      console.log(`✅ Mapped: ${test.test_id}`);
    }
  }

  console.log('🎯 All mappings inserted');
};

seedMappings();