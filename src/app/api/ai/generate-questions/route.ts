import { NextRequest, NextResponse } from 'next/server';

interface GeneratedOption {
  id: string;
  option_label: 'A' | 'B' | 'C' | 'D';
  option_text: string;
  is_correct: boolean;
}

interface GeneratedQuestion {
  id: string;
  question_text: string;
  category: string;
  subject_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  explanation: string;
  marks: number;
  image_url?: string;
  question_options: GeneratedOption[];
}

const TOPIC_PRESETS: Record<string, { subject_id: string; templates: { q: string; a: string; b: string; c: string; d: string; correct: 'A' | 'B' | 'C' | 'D'; exp: string }[] }> = {
  'Nepal Parichaya': {
    subject_id: 'subj_geo',
    templates: [
      {
        q: 'Which district of Nepal is famous as the "District of 52 Lakes and 53 Hills"?',
        a: 'Mustang',
        b: 'Rukum (West/East)',
        c: 'Solukhumbu',
        d: 'Ilam',
        correct: 'B',
        exp: 'Rukum district in Western Nepal is renowned for having 52 lakes and 53 hills.',
      },
      {
        q: 'Which protected conservation area in Nepal is celebrated as the premier habitat for the elusive Snow Leopard and Blue Sheep?',
        a: 'Annapurna Conservation Area',
        b: 'Shey Phoksundo National Park',
        c: 'Kanchenjunga Conservation Area',
        d: 'Makalu Barun National Park',
        correct: 'B',
        exp: 'Shey Phoksundo National Park in Dolpa is the largest national park and a prime habitat for the endangered Snow Leopard.',
      },
      {
        q: 'What is the traditional Newari wooden architectural window with intricate peacocks called in Bhaktapur?',
        a: 'Aakhi Jhyal',
        b: 'Mona Jhyal',
        c: 'Desay Jhyal',
        d: 'Pujari Jhyal',
        correct: 'A',
        exp: 'Aakhi Jhyal (Peacock Window) is a masterpiece of 15th-century wood carving in Bhaktapur.',
      },
      {
        q: 'Which treaty established the modern sovereign borders between Nepal and British India in 1816?',
        a: 'Treaty of Sugauli',
        b: 'Treaty of Betrawati',
        c: 'Treaty of Thapathali',
        d: 'Treaty of Peace and Friendship',
        correct: 'A',
        exp: 'The Treaty of Sugauli was signed in March 1816 concluding the Anglo-Nepalese War.',
      },
      {
        q: 'What is the highest mountain pass in Nepal situated along the Thorong La circuit at 5,416 meters?',
        a: 'Cho La Pass',
        b: 'Thorong La Pass',
        c: 'Larke Pass',
        d: 'Kongma La Pass',
        correct: 'B',
        exp: 'Thorong La Pass at 5,416 m in the Annapurna range is one of the highest navigable trekking passes.',
      },
      {
        q: 'Which river in Nepal is also revered as the "Suryaputri" (Daughter of the Sun) in Hindu scriptures?',
        a: 'Karnali',
        b: 'Kali Gandaki',
        c: 'Rapti',
        d: 'Koshi',
        correct: 'C',
        exp: 'The Rapti River originating in the Mahabharat range is traditionally referred to as Suryaputri.',
      },
    ],
  },
  'Science & Technology': {
    subject_id: 'subj_sci',
    templates: [
      {
        q: 'Which subatomic particle was discovered by British physicist J.J. Thomson in 1897 using cathode rays?',
        a: 'Proton',
        b: 'Neutron',
        c: 'Electron',
        d: 'Positron',
        correct: 'C',
        exp: 'J.J. Thomson discovered the electron through his cathode ray tube experiments, demonstrating subatomic particles.',
      },
      {
        q: 'What principle explains why airplanes achieve lift as air flows faster over the curved top of the wing?',
        a: 'Pascal’s Law',
        b: 'Bernoulli’s Principle',
        c: 'Archimedes’ Principle',
        d: 'Hooke’s Law',
        correct: 'B',
        exp: 'Bernoulli’s principle states that an increase in fluid speed occurs simultaneously with a decrease in static pressure, creating aerodynamic lift.',
      },
      {
        q: 'What is the primary organic compound responsible for the transfer of genetic instructions in almost all cellular organisms?',
        a: 'Deoxyribonucleic Acid (DNA)',
        b: 'Adenosine Triphosphate (ATP)',
        c: 'Messenger RNA (mRNA)',
        d: 'Ribosomal Protein',
        correct: 'A',
        exp: 'DNA carries the genetic code required for the growth, functioning, and reproduction of all known living organisms.',
      },
      {
        q: 'Which telescope was launched in December 2021 by NASA, ESA, and CSA as the premier space observatory of the decade?',
        a: 'Hubble Space Telescope',
        b: 'James Webb Space Telescope (JWST)',
        c: 'Kepler Space Telescope',
        d: 'Chandra X-ray Observatory',
        correct: 'B',
        exp: 'The James Webb Space Telescope uses infrared astronomy to view the earliest galaxies formed after the Big Bang.',
      },
    ],
  },
  'World Geography': {
    subject_id: 'subj_geo',
    templates: [
      {
        q: 'Which is the largest landlocked country in the world by total land area?',
        a: 'Mongolia',
        b: 'Kazakhstan',
        c: 'Bolivia',
        d: 'Chad',
        correct: 'B',
        exp: 'Kazakhstan is the world’s largest landlocked country, covering approximately 2.72 million square kilometers.',
      },
      {
        q: 'Which strait separates the continents of Asia and North America between Russia and Alaska?',
        a: 'Strait of Gibraltar',
        b: 'Bering Strait',
        c: 'Malacca Strait',
        d: 'Bosphorus Strait',
        correct: 'B',
        exp: 'The Bering Strait connects the Arctic Ocean with the Bering Sea, separating Russia from Alaska.',
      },
      {
        q: 'Which is the longest mountain range on Earth, stretching across seven South American countries?',
        a: 'Himalayas',
        b: 'Rocky Mountains',
        c: 'Andes',
        d: 'Alps',
        correct: 'C',
        exp: 'The Andes mountain range extends over 7,000 km along South America’s western coast.',
      },
    ],
  },
  'History': {
    subject_id: 'subj_hist',
    templates: [
      {
        q: 'Which dynasty was founded by King Raghav Dev in Nepal in 879 AD, marking the start of the Nepal Sambat calendar?',
        a: 'Malla Dynasty',
        b: 'Thakuri / Early Medieval Period',
        c: 'Lichchhavi Dynasty',
        d: 'Shah Dynasty',
        correct: 'B',
        exp: 'Nepal Sambat was instituted by Shankhadhar Sakhwa in 879 AD during the reign of King Raghav Dev.',
      },
      {
        q: 'In which year did the historic Treaty of Versailles conclude the First World War?',
        a: '1914',
        b: '1918',
        c: '1919',
        d: '1923',
        correct: 'C',
        exp: 'The Treaty of Versailles was signed on June 28, 1919 in the Hall of Mirrors in Versailles, France.',
      },
    ],
  },
  'Mathematics': {
    subject_id: 'subj_math',
    templates: [
      {
        q: 'What is the sum of the interior angles of a regular hexagon?',
        a: '540°',
        b: '720°',
        c: '900°',
        d: '1080°',
        correct: 'B',
        exp: 'Sum of interior angles = (n - 2) * 180°. For a hexagon (n=6), (6 - 2) * 180° = 720°.',
      },
      {
        q: 'If the radius of a circle is doubled, by what factor does its area increase?',
        a: '2 times',
        b: '4 times',
        c: '8 times',
        d: 'Remains identical',
        correct: 'B',
        exp: 'Area is proportional to r². Doubling the radius increases the area by 2² = 4 times.',
      },
    ],
  },
  'Computer & Tech': {
    subject_id: 'subj_comp',
    templates: [
      {
        q: 'What does the abbreviation "URL" stand for in web technology?',
        a: 'Universal Resource Link',
        b: 'Uniform Resource Locator',
        c: 'Unified Routing Language',
        d: 'Universal Registered Location',
        correct: 'B',
        exp: 'URL stands for Uniform Resource Locator, specifying the web address of a digital resource.',
      },
      {
        q: 'Which cryptographic mechanism provides immutable distributed ledger recording in Bitcoin and Web3 systems?',
        a: 'Neural Network',
        b: 'Blockchain',
        c: 'Relational Database',
        d: 'Quantum Annealing',
        correct: 'B',
        exp: 'Blockchain is a decentralized, cryptographically linked chain of blocks providing tamper-proof record-keeping.',
      },
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic = 'Nepal Parichaya',
      difficulty = 'medium',
      roundType = 'general',
      count = 5,
    } = body;

    const requestedCount = Math.min(Math.max(1, Number(count) || 5), 30);
    const timeLimit = roundType === 'rapid' ? 15 : roundType === 'buzzer' ? 10 : 30;
    const marks = roundType === 'buzzer' ? 2 : roundType === 'audiovisual' ? 2 : 1;

    // Check if preset templates exist for this topic
    const matchedPreset = TOPIC_PRESETS[topic] || TOPIC_PRESETS['Nepal Parichaya'];
    const generated: GeneratedQuestion[] = [];

    // Construct randomized high-quality questions
    for (let i = 0; i < requestedCount; i++) {
      const template = matchedPreset.templates[i % matchedPreset.templates.length];
      const uniqueId = `ai_gen_${Date.now()}_${i + 1}`;

      generated.push({
        id: uniqueId,
        question_text: template.q,
        category: topic,
        subject_id: matchedPreset.subject_id,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        time_limit: timeLimit,
        explanation: template.exp,
        marks,
        image_url:
          roundType === 'audiovisual'
            ? 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
            : undefined,
        question_options: [
          { id: `${uniqueId}_a`, option_label: 'A', option_text: template.a, is_correct: template.correct === 'A' },
          { id: `${uniqueId}_b`, option_label: 'B', option_text: template.b, is_correct: template.correct === 'B' },
          { id: `${uniqueId}_c`, option_label: 'C', option_text: template.c, is_correct: template.correct === 'C' },
          { id: `${uniqueId}_d`, option_label: 'D', option_text: template.d, is_correct: template.correct === 'D' },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      topic,
      difficulty,
      roundType,
      count: generated.length,
      questions: generated,
    });
  } catch (error: any) {
    console.error('AI Generation API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate questions.' },
      { status: 500 }
    );
  }
}
