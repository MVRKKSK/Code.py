import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// 🔥 fallback questions (never break UX)
const fallbackQuestions = [
  {
    "code": "x = 10\ny = 5\nprint(x - y)",
    "expected_output": "5",
    "explanation": "Subtracts y from x and prints the result.",
    "execution_trace": [
      { "line": 1, "variables": { "x": 10 }, "description": "Initialize x" },
      { "line": 2, "variables": { "x": 10, "y": 5 }, "description": "Initialize y" },
      { "line": 3, "variables": { "x": 10, "y": 5 }, "output": "5", "description": "Print x - y" }
    ],
    "language": "Python",
    "difficulty": "easy",
    "tags": ["arithmetic"]
  },
  {
    "code": "let a = 3;\nlet b = 4;\nconsole.log(a * b);",
    "expected_output": "12",
    "explanation": "Multiplies two numbers and logs the result.",
    "execution_trace": [
      { "line": 1, "variables": { "a": 3 }, "description": "Initialize a" },
      { "line": 2, "variables": { "a": 3, "b": 4 }, "description": "Initialize b" },
      { "line": 3, "variables": { "a": 3, "b": 4 }, "output": "12", "description": "Print product" }
    ],
    "language": "JavaScript",
    "difficulty": "easy",
    "tags": ["arithmetic"]
  },
  {
    "code": "for i in range(3):\n    print(i)",
    "expected_output": "0\n1\n2",
    "explanation": "Loops from 0 to 2 and prints each number.",
    "execution_trace": [
      { "line": 1, "variables": { "i": 0 }, "description": "First iteration" },
      { "line": 2, "variables": { "i": 0 }, "output": "0", "description": "Print 0" },
      { "line": 1, "variables": { "i": 1 }, "description": "Second iteration" },
      { "line": 2, "variables": { "i": 1 }, "output": "1", "description": "Print 1" },
      { "line": 1, "variables": { "i": 2 }, "description": "Third iteration" },
      { "line": 2, "variables": { "i": 2 }, "output": "2", "description": "Print 2" }
    ],
    "language": "Python",
    "difficulty": "easy",
    "tags": ["loops"]
  },
  {
    "code": "let str = \"Hi\";\nlet name = \"AI\";\nconsole.log(str + \" \" + name);",
    "expected_output": "Hi AI",
    "explanation": "Concatenates two strings with a space.",
    "execution_trace": [
      { "line": 1, "variables": { "str": "Hi" }, "description": "Initialize str" },
      { "line": 2, "variables": { "str": "Hi", "name": "AI" }, "description": "Initialize name" },
      { "line": 3, "variables": { "str": "Hi", "name": "AI" }, "output": "Hi AI", "description": "Concatenate and print" }
    ],
    "language": "JavaScript",
    "difficulty": "easy",
    "tags": ["strings"]
  },
  {
    "code": "nums = [1, 2, 3]\nprint(sum(nums))",
    "expected_output": "6",
    "explanation": "Calculates the sum of all elements in the list.",
    "execution_trace": [
      { "line": 1, "variables": { "nums": [1, 2, 3] }, "description": "Initialize list" },
      { "line": 2, "variables": { "nums": [1, 2, 3] }, "output": "6", "description": "Print sum of list" }
    ],
    "language": "Python",
    "difficulty": "easy",
    "tags": ["arrays"]
  }];

const cleanJSON = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const generateStructuredQuestions = async ({
  prompt,
  language,
  difficulty,
  count
}) => {
  try {
    console.log("🚀 Trying AI once");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Generate ${count} coding questions in STRICT JSON format.

RULES:
- Return ONLY JSON
- NO markdown
- Must start with [ and end with ]
- Language: ${language}
- Difficulty: ${difficulty}

FORMAT:
[
  {
    "code": "string",
    "expected_output": "string",
    "explanation": "string",
    "execution_trace": [
      {
        "line": number,
        "variables": { "var": "value" },
        "output": "optional",
        "description": "string"
      }
    ],
    "language": "${language}",
    "difficulty": "${difficulty}",
    "tags": ["string"]
  }
]

Topic: ${prompt}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.warn("⚠️ AI failed → using fallback");
      return JSON.stringify(generateFallback(count, language, difficulty));
    }

    let text = data.candidates[0].content.parts[0].text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    JSON.parse(text); // validate

    console.log("✅ AI success");
    return text;

  } catch (err) {
    console.warn("⚠️ AI crashed → using fallback");
    return JSON.stringify(generateFallback(count, language, difficulty));
  }
};