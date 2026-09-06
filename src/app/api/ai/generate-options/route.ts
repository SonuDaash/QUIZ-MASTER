import { NextRequest, NextResponse } from 'next/server';

interface QuestionOptionInput {
  id: string;
  question_text: string;
  correct_answer_text: string;
  subject?: string;
  category?: string;
}

interface GeneratedOptionOutput {
  id: string;
  option_label: 'A' | 'B' | 'C' | 'D';
  option_text: string;
  is_correct: boolean;
}

const NVIDIA_INVOKE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY =
  process.env.NVIDIA_API_KEY ||
  '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';

// Call NVIDIA NIM Vision / LLM to generate 3 high-quality, contextual distractors
async function fetchAIDistractors(
  questionText: string,
  correctAnswer: string,
  category: string
): Promise<string[]> {
  try {
    const prompt = `You are an expert quizmaster and educator.
Given this quiz question and its 100% correct answer, generate 3 plausible, realistic, and highly competitive multiple-choice distractors (incorrect options) that belong to the exact same subject/category (${category}).

Question: "${questionText}"
Correct Answer: "${correctAnswer}"

Rules:
1. Distractors must be realistic, distinct, and directly related to the question topic.
2. None of the distractors can be synonymous with or identical to the correct answer.
3. Return ONLY a valid JSON array of 3 string items.
Example output format:
["Distractor Option 1", "Distractor Option 2", "Distractor Option 3"]`;

    const payload = {
      model: 'meta/llama-3.2-11b-vision-instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.4,
    };

    const res = await fetch(NVIDIA_INVOKE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || '';

      // Extract JSON array from LLM response
      const startIdx = content.indexOf('[');
      const endIdx = content.lastIndexOf(']');
      if (startIdx !== -1 && endIdx > startIdx) {
        const jsonStr = content.substring(startIdx, endIdx + 1);
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.slice(0, 3).map((item) => String(item).trim());
        }
      }
    }
  } catch (err) {
    console.warn('NVIDIA NIM API call error, using domain fallback:', err);
  }

  // Smart Contextual Fallback if API is unreachable
  return generateDomainDistractors(questionText, correctAnswer, category);
}

// Domain-aware fallback distractor generator
function generateDomainDistractors(
  questionText: string,
  correctAnswer: string,
  subject = 'General'
): string[] {
  const qLower = questionText.toLowerCase();
  const aLower = correctAnswer.toLowerCase();

  // Numerical / Measurements
  const numMatch = correctAnswer.match(/\d+(\.\d+)?/);
  if (numMatch) {
    const val = parseFloat(numMatch[0]);
    const unit = correctAnswer.replace(numMatch[0], '').trim();
    const d1 = `${(val * 0.88).toFixed(val % 1 !== 0 ? 2 : 0)}${unit ? ' ' + unit : ''}`.trim();
    const d2 = `${(val * 1.12).toFixed(val % 1 !== 0 ? 2 : 0)}${unit ? ' ' + unit : ''}`.trim();
    const d3 = `${(val * 0.72).toFixed(val % 1 !== 0 ? 2 : 0)}${unit ? ' ' + unit : ''}`.trim();
    return [d1, d2, d3];
  }

  // Nepal Geography & National Parks
  if (qLower.includes('park') || qLower.includes('conservation') || aLower.includes('park')) {
    const parks = ['Bardia National Park', 'Sagarmatha National Park', 'Langtang National Park', 'Rara National Park', 'Makalu Barun National Park', 'Khaptad National Park'];
    return parks.filter((p) => p.toLowerCase() !== aLower).slice(0, 3);
  }

  // Lakes & Water bodies
  if (qLower.includes('lake') || aLower.includes('lake') || aLower.includes('tal')) {
    const lakes = ['Rara Lake', 'Shey Phoksundo Lake', 'Tilicho Lake', 'Gosainkunda Lake', 'Phewa Lake', 'Begnas Lake'];
    return lakes.filter((l) => l.toLowerCase() !== aLower).slice(0, 3);
  }

  // Rivers
  if (qLower.includes('river') || aLower.includes('koshi') || aLower.includes('gandaki') || aLower.includes('karnali')) {
    const rivers = ['Sapta Koshi', 'Sapta Gandaki', 'Karnali River', 'Mahakali River', 'Trishuli River', 'Bheri River'];
    return rivers.filter((r) => r.toLowerCase() !== aLower).slice(0, 3);
  }

  // Kings & Historical Personalities
  if (qLower.includes('king') || qLower.includes('shah') || qLower.includes('prime minister') || qLower.includes('ruler')) {
    const leaders = ['Prithvi Narayan Shah', 'Tribhuvan Bir Bikram Shah', 'Mahendra Bir Bikram Shah', 'Birendra Bir Bikram Shah', 'Jung Bahadur Rana', 'B.P. Koirala'];
    return leaders.filter((l) => l.toLowerCase() !== aLower).slice(0, 3);
  }

  // Science - Biology
  if (qLower.includes('cell') || qLower.includes('organelle') || aLower.includes('mitochondria') || aLower.includes('ribosome')) {
    const organelles = ['Ribosome', 'Mitochondria', 'Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosome', 'Chloroplast'];
    return organelles.filter((o) => o.toLowerCase() !== aLower).slice(0, 3);
  }

  // Science - Elements & Metals
  if (qLower.includes('element') || qLower.includes('metal') || qLower.includes('gas') || qLower.includes('periodic')) {
    const elements = ['Hydrogen', 'Helium', 'Oxygen', 'Nitrogen', 'Mercury', 'Silicon', 'Carbon', 'Iron'];
    return elements.filter((e) => e.toLowerCase() !== aLower).slice(0, 3);
  }

  // Computer & Tech
  if (qLower.includes('protocol') || qLower.includes('internet') || qLower.includes('memory') || qLower.includes('computer')) {
    const tech = ['RAM (Random Access Memory)', 'ROM (Read Only Memory)', 'SSD (Solid State Drive)', 'HTTP (HyperText Transfer Protocol)', 'TCP/IP', 'DNS'];
    return tech.filter((t) => t.toLowerCase() !== aLower).slice(0, 3);
  }

  // World Geography
  if (qLower.includes('desert') || aLower.includes('desert') || aLower.includes('sahara')) {
    const deserts = ['Sahara Desert', 'Gobi Desert', 'Kalahari Desert', 'Atacama Desert', 'Thar Desert'];
    return deserts.filter((d) => d.toLowerCase() !== aLower).slice(0, 3);
  }

  return [
    `Alternative ${correctAnswer} Option`,
    `Secondary ${correctAnswer} Variant`,
    `Comparative ${correctAnswer} Factor`,
  ];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items = [] } = body as { items: QuestionOptionInput[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No questions provided for option generation.' },
        { status: 400 }
      );
    }

    // Process questions concurrently in batches of 4 to stay within rate limits and be fast
    const batchSize = 4;
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const chunk = items.slice(i, i + batchSize);
      const chunkPromises = chunk.map(async (item) => {
        const { id, question_text, correct_answer_text, category = 'General' } = item;
        const safeCorrectAnswer = (correct_answer_text || 'Correct Answer').trim();

        // Call AI model to generate 3 realistic, distinct distractors
        const distractors = await fetchAIDistractors(question_text, safeCorrectAnswer, category);

        // Combine safe correct answer + 3 AI distractors
        const rawOptions = [
          { text: safeCorrectAnswer, is_correct: true },
          { text: distractors[0] || 'Option B', is_correct: false },
          { text: distractors[1] || 'Option C', is_correct: false },
          { text: distractors[2] || 'Option D', is_correct: false },
        ];

        // Shuffle options and assign A, B, C, D labels
        const shuffledOptions = shuffle(rawOptions);
        const labels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

        const finalOptions: GeneratedOptionOutput[] = shuffledOptions.map((opt, idx) => ({
          id: `opt_${id}_${labels[idx]}`,
          option_label: labels[idx],
          option_text: opt.text,
          is_correct: opt.is_correct,
        }));

        return {
          id,
          question_text,
          correct_answer_text: safeCorrectAnswer,
          options: finalOptions,
        };
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      questions: results,
    });
  } catch (error: any) {
    console.error('Option Generation API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate options.' },
      { status: 500 }
    );
  }
}
