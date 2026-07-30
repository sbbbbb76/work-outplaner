export interface Client {
  id: string;
  name: string;
  avatarColor: string;
  goal?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
}

export type MuscleCategory = '胸部' | '背部' | '腿部' | '肩膀' | '手臂' | '核心' | '全身/有氧';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleCategory;
  videoUrl: string;
  instructions: string;
  targetMuscles?: string;
  tags?: string[];
  createdAt: string;
}

export interface PlanExercise {
  instanceId: string; // Unique instance ID in this plan
  exerciseId?: string; // Reference to original library ID if applicable
  name: string;
  category: MuscleCategory;
  videoUrl: string;
  instructions: string;
  sets: number;
  reps: string; // e.g. "8-12 次" or "45 秒"
  weight: string; // e.g. "60 kg" or "自重"
  restSeconds: string; // e.g. "90 秒"
  notes?: string;
  completedSets?: boolean[]; // Tracker for viewer mode
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  clientId?: string; // Optional assigned client
  difficulty: '初階' | '中階' | '高階' | '選手極限';
  tags: string[];
  exercises: PlanExercise[];
  updatedAt: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}
