import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    let questions: any[] = [];
    let subjects: any[] = [];
    let topics: any[] = [];

    if (adminDb) {
      try {
        const [questionsSnap, subjectsSnap, topicsSnap] = await Promise.all([
          adminDb.collection('questions').limit(50).get(),
          adminDb.collection('subjects').limit(20).get(),
          adminDb.collection('topics').limit(20).get(),
        ]);

        questions = questionsSnap.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() }))
          .filter((q: any) => q.question_text?.toLowerCase().includes(query))
          .slice(0, 10);

        subjects = subjectsSnap.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() }))
          .filter((s: any) => s.name?.toLowerCase().includes(query))
          .slice(0, 5);

        topics = topicsSnap.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() }))
          .filter((t: any) => t.name?.toLowerCase().includes(query))
          .slice(0, 5);
      } catch (e) {
        console.warn('Firestore search query fallback:', e);
      }
    }

    // Default sample fallback if no db connection
    if (questions.length === 0 && subjects.length === 0 && topics.length === 0) {
      const demoSubjects = [
        { id: 'subj_geo', name: 'Geography', description: 'World & Nepal Geography' },
        { id: 'subj_sci', name: 'General Science', description: 'Physics, Chemistry, Biology' },
        { id: 'subj_comp', name: 'Computer & ICT', description: 'IT and Digital literacy' },
      ];
      subjects = demoSubjects.filter(s => s.name.toLowerCase().includes(query));
    }

    return NextResponse.json({
      results: {
        questions,
        subjects,
        topics,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
