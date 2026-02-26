import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

export interface PlacementResult {
  id?: string;
  type: 'technical' | 'soft_skills';
  email: string | null;
  phone?: string | null;
  name: string | null;
  score: number;
  totalQuestions: number;
  belt?: string;
  track?: string;
  evaluation?: any;
  detailedEvaluation?: any;
  timestamp: Date | Timestamp | string;
  guestDetails?: any;
}

/**
 * Saves a placement test result to Firebase Firestore.
 * Handles both technical and soft skills tests.
 */
export async function savePlacementResultToFirebase(data: any) {
  try {
    const resultsCollection = collection(db, 'placement_results');

    const resultToSave: Omit<PlacementResult, 'id'> = {
      type: data.testType || (data.belt ? 'technical' : 'soft_skills'),
      email: data.email || data.guestDetails?.email || null,
      phone: data.phone || data.guestDetails?.phone || null,
      name: data.name || data.guestDetails?.name || null,
      score: data.score || data.scorePercent || 0,
      totalQuestions: data.totalQuestions || 0,
      belt: data.belt?.belt || data.resultBeltName || null,
      track: data.track || data.trackName || null,
      evaluation: data.detailedEvaluation || data.evaluation || null,
      timestamp: Timestamp.now(),
      guestDetails: data.guestDetails || null,
    };
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firebase operation timed out')), 5000);
    });

    // Race the addDoc against the timeout
    const docRef = (await Promise.race([
      addDoc(resultsCollection, resultToSave),
      timeoutPromise
    ])) as { id: string };

    console.log('✅ Result saved to Firebase with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error saving result to Firebase:', error);
    return { success: false, error };
  }
}

/**
 * Fetches all placement test results from Firebase Firestore, ordered by timestamp.
 */
export async function getPlacementResultsFromFirebase(): Promise<PlacementResult[]> {
  try {
    const resultsCollection = collection(db, 'placement_results');
    const q = query(resultsCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : data.timestamp,
      } as PlacementResult;
    });
  } catch (error) {
    console.error('❌ Error fetching results from Firebase:', error);
    throw error;
  }
}
