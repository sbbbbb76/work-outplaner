import React, { useState, useEffect } from 'react';
import { Client, Exercise, WorkoutPlan, ToastMessage, ConfirmModalState } from './types';
import { INITIAL_CLIENTS, INITIAL_EXERCISES, INITIAL_PLANS } from './data/seedData';
import { Navbar } from './components/Navbar';
import { ClientModal } from './components/ClientModal';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';
import { DashboardView } from './views/DashboardView';
import { LibraryView } from './views/LibraryView';
import { PlanEditorView } from './views/PlanEditorView';
import { PlanViewerView } from './views/PlanViewerView';
import {
  subscribeClients,
  subscribeExercises,
  subscribePlans,
  saveClientDoc,
  deleteClientDoc,
  saveExerciseDoc,
  deleteExerciseDoc,
  savePlanDoc,
  deletePlanDoc,
} from './services/firebaseService';

const LOCAL_STORAGE_KEYS = {
  CLIENTS: 'wtp_clients_v1',
  EXERCISES: 'wtp_exercises_v1',
  PLANS: 'wtp_plans_v1',
  EDIT_MODE: 'wtp_is_edit_mode_v1',
};

export default function App() {
  // Local-First State Initialization with Instant Storage Backup
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CLIENTS);
      return saved !== null ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch (e) {
      console.warn('Failed reading clients from localStorage', e);
      return INITIAL_CLIENTS;
    }
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EXERCISES);
      return saved !== null ? JSON.parse(saved) : INITIAL_EXERCISES;
    } catch (e) {
      console.warn('Failed reading exercises from localStorage', e);
      return INITIAL_EXERCISES;
    }
  });

  const [plans, setPlans] = useState<WorkoutPlan[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PLANS);
      return saved !== null ? JSON.parse(saved) : INITIAL_PLANS;
    } catch (e) {
      console.warn('Failed reading plans from localStorage', e);
      return INITIAL_PLANS;
    }
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EDIT_MODE);
      return saved ? JSON.parse(saved) === true : false;
    } catch (e) {
      return false;
    }
  });

  const [heroBannerUrl, setHeroBannerUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('wtp_hero_banner_v1');
      return saved || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80';
    } catch (e) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80';
    }
  });

  // UI States
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'library' | 'editor' | 'viewer'>('dashboard');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isStandaloneHashView, setIsStandaloneHashView] = useState(false);
  const [isFirebaseSynced, setIsFirebaseSynced] = useState(false);

  // Toast & Custom Confirm Modal
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Subscribe to Firebase Firestore Realtime Sync
  useEffect(() => {
    const unsubscribeClients = subscribeClients(
      (data) => {
        if (data) {
          setClients(data);
          setIsFirebaseSynced(true);
        }
      },
      (err) => console.warn('Clients sync fallback:', err)
    );

    const unsubscribeExercises = subscribeExercises(
      (data) => {
        if (data) {
          setExercises(data);
          setIsFirebaseSynced(true);
        }
      },
      (err) => console.warn('Exercises sync fallback:', err)
    );

    const unsubscribePlans = subscribePlans(
      (data) => {
        if (data) {
          setPlans(data);
          setIsFirebaseSynced(true);
        }
      },
      (err) => console.warn('Plans sync fallback:', err)
    );

    return () => {
      unsubscribeClients();
      unsubscribeExercises();
      unsubscribePlans();
    };
  }, []);

  // Instant Save Handlers to LocalStorage as secondary offline backup
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error('Error saving clients', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (e) {
      console.error('Error saving exercises', e);
    }
  }, [exercises]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PLANS, JSON.stringify(plans));
    } catch (e) {
      console.error('Error saving plans', e);
    }
  }, [plans]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.EDIT_MODE, JSON.stringify(isEditMode));
    } catch (e) {
      console.error('Error saving edit mode', e);
    }
  }, [isEditMode]);

  useEffect(() => {
    try {
      localStorage.setItem('wtp_hero_banner_v1', heroBannerUrl);
    } catch (e) {
      console.error('Error saving hero banner', e);
    }
  }, [heroBannerUrl]);

  // Hash-based Routing Parser
  const parseHash = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#/view/')) {
      const planId = hash.replace('#/view/', '').trim();
      setActivePlanId(planId);
      setCurrentTab('viewer');
      setIsStandaloneHashView(true);
    } else if (hash.startsWith('#/edit/')) {
      const planId = hash.replace('#/edit/', '').trim();
      setActivePlanId(planId);
      setCurrentTab('editor');
      setIsStandaloneHashView(false);
    } else if (hash === '#/library') {
      setCurrentTab('library');
      setIsStandaloneHashView(false);
    } else {
      setCurrentTab('dashboard');
      setIsStandaloneHashView(false);
    }
  };

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Navigation router helpers
  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  // Client Operations
  const handleAddClient = (newClientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...newClientData,
      id: 'client-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [...prev, newClient]);
    saveClientDoc(newClient).catch((err) => console.error('Firestore error saving client:', err));
    showToast(`已新增學員《${newClient.name}》`, 'success');
  };

  const handleDeleteClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setConfirmModal({
      isOpen: true,
      title: '確認刪除學員',
      message: `您確定要刪除學員《${client?.name || ''}》嗎？此操作無法復原。`,
      confirmText: '確認刪除',
      onConfirm: () => {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
        deleteClientDoc(clientId).catch((err) => console.error('Firestore error deleting client:', err));
        showToast('已刪除學員資料', 'info');
      },
    });
  };

  // Exercise Library Operations
  const handleAddExercise = (newExData: Omit<Exercise, 'id' | 'createdAt'>) => {
    const newEx: Exercise = {
      ...newExData,
      id: 'ex-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setExercises((prev) => [...prev, newEx]);
    saveExerciseDoc(newEx).catch((err) => console.error('Firestore error saving exercise:', err));
  };

  const handleUpdateExercise = (updatedEx: Exercise) => {
    setExercises((prev) => prev.map((ex) => (ex.id === updatedEx.id ? updatedEx : ex)));
    saveExerciseDoc(updatedEx).catch((err) => console.error('Firestore error updating exercise:', err));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const ex = exercises.find((item) => item.id === exerciseId);
    setConfirmModal({
      isOpen: true,
      title: '確認刪除動作範本',
      message: `您確定要從動作庫刪除《${ex?.name || ''}》嗎？已存在的計畫不受影響。`,
      confirmText: '確認刪除',
      onConfirm: () => {
        setExercises((prev) => prev.filter((item) => item.id !== exerciseId));
        deleteExerciseDoc(exerciseId).catch((err) => console.error('Firestore error deleting exercise:', err));
        showToast('已刪除動作範本', 'info');
      },
    });
  };

  // Workout Plan Operations
  const handleCreateNewPlan = () => {
    const newPlan: WorkoutPlan = {
      id: 'plan-' + Date.now(),
      title: '全新自訂訓練菜單',
      description: '',
      difficulty: '初階',
      tags: ['健身', '肌力'],
      exercises: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setPlans((prev) => [newPlan, ...prev]);
    savePlanDoc(newPlan).catch((err) => console.error('Firestore error creating plan:', err));
    setActivePlanId(newPlan.id);
    navigateTo(`#/edit/${newPlan.id}`);
    showToast('已建立新訓練菜單，請開始編輯細節！', 'success');
  };

  const handleUpdatePlan = (updatedPlan: WorkoutPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    savePlanDoc(updatedPlan).catch((err) => console.error('Firestore error updating plan:', err));
  };

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    setConfirmModal({
      isOpen: true,
      title: '刪除訓練菜單',
      message: `您確定要刪除《${plan?.title || ''}》菜單嗎？此操作無法撤銷。`,
      confirmText: '確認刪除',
      onConfirm: () => {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
        deletePlanDoc(planId).catch((err) => console.error('Firestore error deleting plan:', err));
        showToast('已成功刪除該訓練菜單', 'info');
        if (activePlanId === planId) {
          navigateTo('#/dashboard');
        }
      },
    });
  };

  // Backup Data Import Handler
  const handleImportData = (data: { plans?: WorkoutPlan[]; exercises?: Exercise[]; clients?: Client[] }) => {
    if (data.plans) {
      setPlans(data.plans);
      data.plans.forEach((p) => savePlanDoc(p));
    }
    if (data.exercises) {
      setExercises(data.exercises);
      data.exercises.forEach((ex) => saveExerciseDoc(ex));
    }
    if (data.clients) {
      setClients(data.clients);
      data.clients.forEach((c) => saveClientDoc(c));
    }
  };

  // Direct Edit Plan Request (Auto-Enables Edit Mode)
  const handleEditPlanRequest = (planId: string) => {
    if (!isEditMode) {
      setIsEditMode(true);
      showToast('已為您開啟課表【編輯模式】', 'success');
    }
    setActivePlanId(planId);
    navigateTo(`#/edit/${planId}`);
  };

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];
  const activePlanClient = activePlan ? clients.find((c) => c.id === activePlan.clientId) : undefined;

  return (
    <div className="min-h-screen bg-[#fdf2f4] text-[#382328] flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Toast Overlay */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Custom Confirmation Modal */}
      <ConfirmModal state={confirmModal} onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))} />

      {/* Client Management Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        clients={clients}
        onAddClient={handleAddClient}
        onDeleteClient={handleDeleteClient}
      />

      {/* System Settings & Mode Switcher Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isEditMode={isEditMode}
        onToggleEditMode={() => {
          const nextMode = !isEditMode;
          setIsEditMode(nextMode);
          showToast(nextMode ? '已切換為【編輯模式】' : '已切換為【唯讀保護模式】', 'info');
        }}
        onOpenClientManager={() => setIsClientModalOpen(true)}
        plans={plans}
        exercises={exercises}
        clients={clients}
        onImportData={handleImportData}
        onShowToast={showToast}
      />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => navigateTo(`#/${tab}`)}
        onNewPlan={handleCreateNewPlan}
        isEditMode={isEditMode}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isHidden={isStandaloneHashView}
      />

      {/* Firebase Sync Indicator Header Bar */}
      {!isStandaloneHashView && (
        <div className="bg-[#f2e7d8]/80 border-b border-[#e2d5c5] px-4 py-1.5 text-center text-[11px] font-bold text-[#6e545a] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Firebase 雲端資料庫已連線，動作庫與課表即時跨裝置同步備份中</span>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            plans={plans}
            clients={clients}
            selectedClientId={selectedClientId}
            onSelectClientFilter={setSelectedClientId}
            onOpenClientManager={() => setIsClientModalOpen(true)}
            onViewPlan={(planId) => navigateTo(`#/view/${planId}`)}
            onEditPlan={handleEditPlanRequest}
            onDeletePlan={handleDeletePlan}
            onCreatePlan={handleCreateNewPlan}
            isEditMode={isEditMode}
            heroBannerUrl={heroBannerUrl}
            onUpdateHeroBanner={setHeroBannerUrl}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView
            exercises={exercises}
            onAddExercise={handleAddExercise}
            onUpdateExercise={handleUpdateExercise}
            onDeleteExercise={handleDeleteExercise}
            isEditMode={isEditMode}
            onBackToDashboard={() => navigateTo('#/dashboard')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'editor' && activePlan && (
          <PlanEditorView
            plan={activePlan}
            exerciseLibrary={exercises}
            clients={clients}
            onUpdatePlan={handleUpdatePlan}
            onBackToDashboard={() => navigateTo('#/dashboard')}
            onViewPlan={(planId) => navigateTo(`#/view/${planId}`)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'viewer' && activePlan && (
          <PlanViewerView
            plan={activePlan}
            client={activePlanClient}
            onUpdatePlanExercises={(updatedExs) => handleUpdatePlan({ ...activePlan, exercises: updatedExs })}
            isStandaloneHashView={isStandaloneHashView}
            isEditMode={isEditMode}
            onBackToDashboard={() => navigateTo('#/dashboard')}
            onEditPlan={handleEditPlanRequest}
            onShowToast={showToast}
          />
        )}
      </main>
    </div>
  );
}

