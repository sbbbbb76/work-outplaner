import React, { useState } from 'react';
import { Client } from '../types';
import { UserPlus, Users, Trash2, X, Target, FileText } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onAddClient: (newClient: Omit<Client, 'id' | 'createdAt'>) => void;
  onDeleteClient: (clientId: string) => void;
}

const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-purple-500',
];

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  clients,
  onAddClient,
  onDeleteClient,
}) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddClient({
      name: name.trim(),
      goal: goal.trim() || undefined,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      avatarColor: selectedColor,
    });

    setName('');
    setGoal('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-[9000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#fcf8f2] border border-rose-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-[#382328]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e8dfd5] bg-[#fcf8f2]/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#382328]">學員與使用者管理</h2>
              <p className="text-xs text-[#7c6368]">新增學員資料或維護學員菜單權限</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#f2e7d8] text-[#5c474b] hover:text-[#382328] hover:bg-[#ebdcc9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6">
          {/* Add Client Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5] space-y-4">
            <h3 className="text-xs font-bold uppercase text-rose-600 tracking-wider flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" /> 新增學員資料
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">學員姓名 / 稱呼 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 王大明 (David)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] placeholder-[#9c8489] focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6e545a] mb-1">聯絡電話 (選填)</label>
                <input
                  type="text"
                  placeholder="例如: 0912-345-678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] placeholder-[#9c8489] focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6e545a] mb-1">訓練目標 / 目標公斤數 (選填)</label>
              <input
                type="text"
                placeholder="例如: 增肌 3 公斤 / 深蹲破 120kg"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] placeholder-[#9c8489] focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6e545a] mb-1">教練備忘錄 / 特殊考量 (選填)</label>
              <input
                type="text"
                placeholder="例如: 左膝舊傷，避免衝擊性太高跳躍"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#e2d5c5] rounded-xl text-sm text-[#382328] placeholder-[#9c8489] focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6e545a] mb-1.5">代表顏色標籤</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full ${color} transition-transform ${
                      selectedColor === color ? 'ring-2 ring-rose-500 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-98"
            >
              儲存並建立學員
            </button>
          </form>

          {/* Existing Clients List */}
          <div>
            <h3 className="text-xs font-bold uppercase text-[#6e545a] tracking-wider mb-3">
              現有學員列表 ({clients.length})
            </h3>

            {clients.length === 0 ? (
              <p className="text-center py-6 text-sm text-[#7c6368] bg-[#f7f0e6] rounded-xl border border-[#e2d5c5]">
                目前尚無學員資料，請由上方新增。
              </p>
            ) : (
              <div className="space-y-2.5">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3.5 bg-[#f7f0e6] rounded-2xl border border-[#e2d5c5] hover:border-rose-300 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${client.avatarColor} text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-md`}
                      >
                        {client.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#382328] truncate">{client.name}</h4>
                        {client.goal && (
                          <p className="text-xs text-[#7c6368] truncate flex items-center gap-1 mt-0.5">
                            <Target className="w-3 h-3 text-rose-500 shrink-0" /> {client.goal}
                          </p>
                        )}
                        {client.notes && (
                          <p className="text-[11px] text-[#7c6368] truncate flex items-center gap-1 mt-0.5">
                            <FileText className="w-3 h-3 shrink-0" /> {client.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteClient(client.id)}
                      className="p-2 rounded-xl text-[#7c6368] hover:text-rose-600 hover:bg-rose-100 transition-colors"
                      title="刪除學員"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
