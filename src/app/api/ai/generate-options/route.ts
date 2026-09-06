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

// Domain-aware distractor generator for major quiz subjects
function generateDomainDistractors(questionText: string, correctAnswer: string, subject = 'General'): string[] {
  const qLower = questionText.toLowerCase();
  const aLower = correctAnswer.toLowerCase();

  // 1. Numerical / Measurements / Heights / Angles
  const numMatch = correctAnswer.match(/\d+(\.\d+)?/);
  if (numMatch) {
    const val = parseFloat(numMatch[0]);
    const unit = correctAnswer.replace(numMatch[0], '').trim();
    const d1 = `${(val * 0.9).toFixed(val % 1 !== 0 ? 2 : 0)}${unit ? ' ' + unit : ''}`.trim();
    const d2 = `${(val * 1.15).toFixed(val % 1 !== 0 ? 2 : 0)}${unit ? ' ' + unit : ''}`.trim();
    const d3 = `${(val * 0.75).toFixed(val % 1 !== 0 ? 2 : 0)}${unit ? ' ' + unit : ''}`.trim();
    return [d1, d2, d3];
  }

  // 2. Nepal National Parks / Geography
  if (qLower.includes('national park') || qLower.includes('conservation') || aLower.includes('park')) {
    const parks = ['Bardia National Park', 'Sagarmatha National Park', 'Langtang National Park', 'Rara National Park', 'Makalu Barun National Park', 'Khaptad National Park'];
    return parks.filter((p) => p.toLowerCase() !== aLower).slice(0, 3);
  }

  // 3. Nepal Lakes / Mountains / Rivers
  if (qLower.includes('lake') || aLower.includes('lake') || aLower.includes('tal')) {
    const lakes = ['Rara Lake', 'Shey Phoksundo Lake', 'Tilicho Lake', 'Gosainkunda Lake', 'Phewa Lake', 'Begnas Lake'];
    return lakes.filter((l) => l.toLowerCase() !== aLower).slice(0, 3);
  }

  if (qLower.includes('river') || aLower.includes('koshi') || aLower.includes('gandaki') || aLower.includes('karnali')) {
    const rivers = ['Sapta Koshi', 'Sapta Gandaki', 'Karnali River', 'Mahakali River', 'Trishuli River', 'Bheri River'];
    return rivers.filter((r) => r.toLowerCase() !== aLower).slice(0, 3);
  }

  // 4. Kings & Historical Leaders of Nepal
  if (qLower.includes('king') || qLower.includes('shah') || qLower.includes('prime minister') || qLower.includes('ruler')) {
    const leaders = ['Prithvi Narayan Shah', 'Tribhuvan Bir Bikram Shah', 'Mahendra Bir Bikram Shah', 'Birendra Bir Bikram Shah', 'Jung Bahadur Rana', 'B.P. Koirala'];
    return leaders.filter((l) => l.toLowerCase() !== aLower).slice(0, 3);
  }

  // 5. Treaties & Historic Events
  if (qLower.includes('treaty') || aLower.includes('treaty')) {
    const treaties = ['Treaty of Sugauli', 'Treaty of Betrawati', 'Treaty of Thapathali', 'Treaty of Peace and Friendship (1950)'];
    return treaties.filter((t) => t.toLowerCase() !== aLower).slice(0, 3);
  }

  // 6. Science - Biology / Organelles / Human Body
  if (qLower.includes('cell') || qLower.includes('organelle') || aLower.includes('mitochondria') || aLower.includes('ribosome')) {
    const organelles = ['Ribosome', 'Mitochondria', 'Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosome', 'Chloroplast'];
    return organelles.filter((o) => o.toLowerCase() !== aLower).slice(0, 3);
  }

  // 7. Science - Chemistry & Elements
  if (qLower.includes('element') || qLower.includes('metal') || qLower.includes('gas') || qLower.includes('periodic')) {
    const elements = ['Hydrogen', 'Helium', 'Oxygen', 'Nitrogen', 'Mercury', 'Silicon', 'Carbon', 'Iron'];
    return elements.filter((e) => e.toLowerCase() !== aLower).slice(0, 3);
  }

  // 8. Computer & Tech Acronyms / Concepts
  if (qLower.includes('protocol') || qLower.includes('internet') || qLower.includes('memory') || qLower.includes('computer')) {
    const tech = ['RAM (Random Access Memory)', 'ROM (Read Only Memory)', 'SSD (Solid State Drive)', 'HTTP (HyperText Transfer Protocol)', 'TCP/IP', 'DNS'];
    return tech.filter((t) => t.toLowerCase() !== aLower).slice(0, 3);
  }

  // 9. World Geography - Continents, Oceans, Deserts
  if (qLower.includes('desert') || aLower.includes('desert') || aLower.includes('sahara')) {
    const deserts = ['Sahara Desert', 'Gobi Desert', 'Kalahari Desert', 'Atacama Desert', 'Thar Desert'];
    return deserts.filter((d) => d.toLowerCase() !== aLower).slice(0, 3);
  }

  // 10. Fallback Smart Distractor Variations
  return [
    `Alternative ${correctAnswer} Factor`,
    `Comparative ${correctAnswer} Variant`,
    `Secondary ${correctAnswer} Metric`,
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
      return NextResponse.json({ success: false, error: 'No questions provided for option generation.' }, { status: 400 });
    }

    const results = items.map((item) => {
      const { id, question_text, correct_answer_text, subject = 'General' } = item;

      // Ensure we have a valid correct answer string
      const safeCorrectAnswer = (correct_answer_text || 'Correct Option').trim();

      // Generate 3 contextual distractors
      const distractors = generateDomainDistractors(question_text, safeCorrectAnswer, subject);

      // Construct options pool (1 correct + 3 wrong)
      const rawOptions = [
        { text: safeCorrectAnswer, is_correct: true },
        { text: distractors[0] || 'Alternative Option B', is_correct: false },
        { text: distractors[1] || 'Alternative Option C', is_correct: false },
        { text: distractors[2] || 'Alternative Option D', is_correct: false },
      ];

      // Shuffle options and assign labels A, B, C, D
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

    return NextResponse.json({
      success: true,
      count: results.length,
      questions: results,
    });
  } catch (error: any) {
    console.error('Option Generation API Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to generate options.' }, { status: 500 });
  }
}
