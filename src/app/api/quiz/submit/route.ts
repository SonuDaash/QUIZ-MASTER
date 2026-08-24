import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// Submit quiz results and complete session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, responses } = body;

    if (!sessionId || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert responses into Firestore batch if db is configured
    if (adminDb) {
      try {
        const batch = adminDb.batch();
        const responsesCol = adminDb.collection('quiz_responses');

        responses.forEach((r: {
          questionId: string;
          selectedAnswer: string | null;
          isCorrect: boolean;
          isSkipped: boolean;
          responseTimeMs: number;
          marksAwarded: number;
          questionOrder: number;
        }) => {
          const docRef = responsesCol.doc();
          batch.set(docRef, {
            session_id: sessionId,
            question_id: r.questionId,
            student_answer: r.selectedAnswer,
            is_correct: r.isCorrect,
            is_skipped: r.isSkipped,
            response_time_ms: r.responseTimeMs,
            marks_awarded: r.marksAwarded || 0,
            question_order: r.questionOrder,
            created_at: new Date().toISOString(),
          });
        });

        // Update session document in Firestore
        const sessionRef = adminDb.collection('quiz_sessions').doc(sessionId);
        const totalScore = responses.reduce((sum: number, r: { marksAwarded: number }) => sum + (r.marksAwarded || 0), 0);
        const totalCorrect = responses.filter((r: { isCorrect: boolean }) => r.isCorrect).length;
        const accuracy = responses.length > 0 ? (totalCorrect / responses.length) * 100 : 0;

        batch.set(sessionRef, {
          status: 'completed',
          score: totalScore,
          accuracy: Math.round(accuracy * 10) / 10,
          completed_at: new Date().toISOString(),
        }, { merge: true });

        await batch.commit();
      } catch (e) {
        console.warn('Firestore response recording fallback:', e);
      }
    }

    // Calculate session totals
    const totalCorrect = responses.filter((r: { isCorrect: boolean }) => r.isCorrect).length;
    const totalScore = responses.reduce((sum: number, r: { marksAwarded: number }) => sum + (r.marksAwarded || 0), 0);
    const accuracy = responses.length > 0 ? (totalCorrect / responses.length) * 100 : 0;

    return NextResponse.json({
      success: true,
      score: totalScore,
      accuracy: Math.round(accuracy * 10) / 10,
      correct: totalCorrect,
      total: responses.length,
    });
  } catch (error) {
    console.error('Score submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
