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

// Realtime subscription helpers
export function subscribeClients(
  onUpdate: (clients: Client[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, COLLECTIONS.CLIENTS);

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
      } else {
        const data = snapshot.docs.map((d) => d.data() as Client);
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
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
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
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
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
