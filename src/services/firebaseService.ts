import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Client, Exercise, WorkoutPlan } from '../types';
import { INITIAL_CLIENTS, INITIAL_EXERCISES, INITIAL_PLANS } from '../data/seedData';

const COLLECTIONS = {
  CLIENTS: 'clients',
  EXERCISES: 'exercises',
  PLANS: 'plans',
};

// Realtime subscription helpers with automatic seeding
export function subscribeClients(
  onUpdate: (clients: Client[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, COLLECTIONS.CLIENTS);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial clients if collection is completely empty
        try {
          const batch = writeBatch(db);
          INITIAL_CLIENTS.forEach((c) => {
            const docRef = doc(db, COLLECTIONS.CLIENTS, c.id);
            batch.set(docRef, c);
          });
          await batch.commit();
        } catch (e) {
          console.error('Error seeding clients into Firestore:', e);
        }
      } else {
        const data = snapshot.docs.map((d) => d.data() as Client);
        // Sort by createdAt or name
        data.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        onUpdate(data);
      }
    },
    (err) => {
      console.warn('Firestore clients listener error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeExercises(
  onUpdate: (exercises: Exercise[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, COLLECTIONS.EXERCISES);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial exercises if empty
        try {
          const batch = writeBatch(db);
          INITIAL_EXERCISES.forEach((ex) => {
            const docRef = doc(db, COLLECTIONS.EXERCISES, ex.id);
            batch.set(docRef, ex);
          });
          await batch.commit();
        } catch (e) {
          console.error('Error seeding exercises into Firestore:', e);
        }
      } else {
        const data = snapshot.docs.map((d) => d.data() as Exercise);
        data.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        onUpdate(data);
      }
    },
    (err) => {
      console.warn('Firestore exercises listener error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribePlans(
  onUpdate: (plans: WorkoutPlan[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, COLLECTIONS.PLANS);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial plans if empty
        try {
          const batch = writeBatch(db);
          INITIAL_PLANS.forEach((p) => {
            const docRef = doc(db, COLLECTIONS.PLANS, p.id);
            batch.set(docRef, p);
          });
          await batch.commit();
        } catch (e) {
          console.error('Error seeding plans into Firestore:', e);
        }
      } else {
        const data = snapshot.docs.map((d) => d.data() as WorkoutPlan);
        data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        onUpdate(data);
      }
    },
    (err) => {
      console.warn('Firestore plans listener error:', err);
      if (onError) onError(err);
    }
  );
}

// Client mutations
export async function saveClientDoc(client: Client): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CLIENTS, client.id);
  await setDoc(docRef, client, { merge: true });
}

export async function deleteClientDoc(clientId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CLIENTS, clientId);
  await deleteDoc(docRef);
}

// Exercise mutations
export async function saveExerciseDoc(exercise: Exercise): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EXERCISES, exercise.id);
  await setDoc(docRef, exercise, { merge: true });
}

export async function deleteExerciseDoc(exerciseId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EXERCISES, exerciseId);
  await deleteDoc(docRef);
}

// WorkoutPlan mutations
export async function savePlanDoc(plan: WorkoutPlan): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PLANS, plan.id);
  await setDoc(docRef, plan, { merge: true });
}

export async function deletePlanDoc(planId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PLANS, planId);
  await deleteDoc(docRef);
}
