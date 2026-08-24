import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, answer, sessionId } = body;

    if (!questionId || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the question from Firestore if available
    let question: any = null;
    if (adminDb) {
      try {
        const qDoc = await adminDb.collection('questions').doc(questionId).get();
        if (qDoc.exists) {
          question = { id: qDoc.id, ...qDoc.data() };
        }
      } catch (e) {
        console.warn('Firestore question lookup error, checking fallback', e);
      }
    }

    // Fallback default verification for demo questions
    if (!question) {
      const fallbackQuestions: Record<string, any> = {
        q1: {
          marks: 1,
          negative_marks: 0,
          explanation: 'Kathmandu is the capital and largest city of Nepal.',
          question_type: 'mcq',
          question_options: [
            { id: 'opt1', option_text: 'Pokhara', option_label: 'A', is_correct: false },
            { id: 'opt2', option_text: 'Kathmandu', option_label: 'B', is_correct: true },
            { id: 'opt3', option_text: 'Lalitpur', option_label: 'C', is_correct: false },
            { id: 'opt4', option_text: 'Biratnagar', option_label: 'D', is_correct: false },
          ]
        },
        q2: {
          marks: 1,
          negative_marks: 0,
          explanation: 'Au comes from the Latin word aurum, meaning shining dawn.',
          question_type: 'mcq',
          question_options: [
            { id: 'opt5', option_text: 'Ag', option_label: 'A', is_correct: false },
            { id: 'opt6', option_text: 'Au', option_label: 'B', is_correct: true },
            { id: 'opt7', option_text: 'Fe', option_label: 'C', is_correct: false },
            { id: 'opt8', option_text: 'Cu', option_label: 'D', is_correct: false },
          ]
        }
      };
      question = fallbackQuestions[questionId];
    }

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    let isCorrect = false;
    let correctAnswer = '';

    // Check answer based on question type
    if (['mcq', 'true_false', 'rapid_fire', 'buzzer'].includes(question.question_type || 'mcq')) {
      const options = question.question_options || question.options || [];
      const correctOption = options.find((o: any) => o.is_correct);
      correctAnswer = correctOption?.option_text || '';

      isCorrect = options.some(
        (o: any) =>
          o.is_correct &&
          (o.id === answer || o.option_label === answer || o.option_text === answer)
      );
    } else {
      const answers = question.question_answers || question.answers || [];
      if (answers.length > 0) {
        const primaryAnswer = answers[0];
        correctAnswer = typeof primaryAnswer === 'string' ? primaryAnswer : primaryAnswer.answer_text;

        const normalizedAnswer = (answer || '').trim().toLowerCase();
        const accepted = [
          correctAnswer.toLowerCase(),
          ...(primaryAnswer.accepted_alternatives || []).map((a: string) => a.toLowerCase()),
        ];
        isCorrect = accepted.includes(normalizedAnswer);
      }
    }

    const marksAwarded = isCorrect ? (question.marks || 1) : -(question.negative_marks || 0);

    return NextResponse.json({
      isCorrect,
      correctAnswer,
      explanation: question.explanation || '',
      marksAwarded,
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
