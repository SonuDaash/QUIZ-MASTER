import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { Query, DocumentData } from 'firebase-admin/firestore';

// Create a new quiz session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      studentId: providedStudentId,
      sessionType = 'practice',
      subjectId,
      topicId,
      difficultyFilter,
      questionCount = 20,
      timeLimit,
    } = body;

    let studentId = providedStudentId;

    // If studentId wasn't provided directly, look it up by userId
    if (!studentId && userId && adminDb) {
      try {
        const studentSnap = await adminDb
          .collection('students')
          .where('user_id', '==', userId)
          .limit(1)
          .get();

        if (!studentSnap.empty) {
          studentId = studentSnap.docs[0].id;
        } else {
          studentId = userId;
        }
      } catch (e) {
        studentId = userId;
      }
    }

    if (!studentId) {
      studentId = 'demo_student';
    }

    let questions: any[] = [];

    // Query questions from Firestore if available
    if (adminDb) {
      try {
        let questionQuery: Query<DocumentData> = adminDb.collection('questions');

        if (subjectId) {
          questionQuery = questionQuery.where('subject_id', '==', subjectId);
        }
        if (topicId) {
          questionQuery = questionQuery.where('topic_id', '==', topicId);
        }
        if (difficultyFilter) {
          questionQuery = questionQuery.where('difficulty', '==', difficultyFilter);
        }

        const questionSnapshot = await questionQuery.limit(questionCount * 2).get();
        questions = questionSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (dbErr) {
        console.warn('Firestore query fallback to demo questions:', dbErr);
      }
    }

    // Fallback sample questions if none in Firestore yet
    if (questions.length === 0) {
      questions = [
        {
          id: 'q1',
          question_text: 'What is the capital city of Nepal?',
          question_type: 'mcq',
          difficulty: 'easy',
          time_limit: 30,
          explanation: 'Kathmandu is the capital and largest city of Nepal.',
          marks: 1,
          negative_marks: 0,
          question_options: [
            { id: 'opt1', option_text: 'Pokhara', option_label: 'A', is_correct: false, display_order: 1 },
            { id: 'opt2', option_text: 'Kathmandu', option_label: 'B', is_correct: true, display_order: 2 },
            { id: 'opt3', option_text: 'Lalitpur', option_label: 'C', is_correct: false, display_order: 3 },
            { id: 'opt4', option_text: 'Biratnagar', option_label: 'D', is_correct: false, display_order: 4 },
          ],
        },
        {
          id: 'q2',
          question_text: 'What is the chemical symbol for Gold?',
          question_type: 'mcq',
          difficulty: 'easy',
          time_limit: 30,
          explanation: 'Au comes from the Latin word aurum, meaning shining dawn.',
          marks: 1,
          negative_marks: 0,
          question_options: [
            { id: 'opt5', option_text: 'Ag', option_label: 'A', is_correct: false, display_order: 1 },
            { id: 'opt6', option_text: 'Au', option_label: 'B', is_correct: true, display_order: 2 },
            { id: 'opt7', option_text: 'Fe', option_label: 'C', is_correct: false, display_order: 3 },
            { id: 'opt8', option_text: 'Cu', option_label: 'D', is_correct: false, display_order: 4 },
          ],
        },
      ];
    }

    // Shuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, questionCount);

    const sessionData = {
      student_id: studentId,
      session_type: sessionType,
      subject_id: subjectId || null,
      topic_id: topicId || null,
      difficulty_filter: difficultyFilter || null,
      total_questions: shuffled.length,
      time_limit: timeLimit || null,
      status: 'in_progress',
      max_score: shuffled.reduce((sum, q) => sum + (q.marks || 1), 0),
      created_at: new Date().toISOString(),
    };

    let sessionId = `sess_${Date.now()}`;
    if (adminDb) {
      try {
        const sessionRef = await adminDb.collection('quiz_sessions').add(sessionData);
        sessionId = sessionRef.id;
      } catch (e) {
        console.warn('Firestore session insert fallback to memory session id');
      }
    }

    // Format client questions without leaking is_correct
    const clientQuestions = shuffled.map(q => ({
      ...q,
      question_options: q.question_options?.map(({ id, option_text, option_label, display_order }: any) => ({
        id,
        option_text,
        option_label,
        display_order,
      })) || [],
    }));

    return NextResponse.json({
      session: {
        id: sessionId,
        ...sessionData,
      },
      questions: clientQuestions,
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
