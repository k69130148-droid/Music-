import React, { useState } from 'react';
import { SimCard, USSDCode } from '../types/phone';
import { 
  Cpu, 
  Wifi, 
  Zap, 
  Smartphone, 
  ShieldCheck, 
  CreditCard, 
  PhoneCall, 
  Search, 
  Sliders, 
  Edit2, 
  Check, 
  Globe, 
  Send
} from 'lucide-react';

interface SimManagementTabProps {
  simCards: SimCard[];
  ussdCodes: USSDCode[];
  onUpdateSim: (sim: SimCard) => void;
  onExecuteUSSD: (code: string, simId: 'sim1' | 'sim2') => void;
}

export const SimManagementTab: React.FC<SimManagementTabProps> = ({
  simCards,
  ussdCodes,
  onUpdateSim,
  onExecuteUSSD,
}) => {
  const [activeCarrierFilter, setActiveCarrierFilter] = useState<string>('all');
  const [searchUssd, setSearchUssd] = useState<string>('');
  const [customUssdInput, setCustomUssdInput] = useState<string>('');
  const [selectedSimSlot, setSelectedSimSlot] = useState<'sim1' | 'sim2'>('sim1');
  const [editingSim, setEditingSim] = useState<SimCard | null>(null);

  const [editCarrierName, setEditCarrierName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editBalance, setEditBalance] = useState<string>('');
  const [editPlan, setEditPlan] = useState<string>('');

  const sim1 = simCards.find(s => s.id === 'sim1') || simCards[0];
  const sim2 = simCards.find(s => s.id === 'sim2') || simCards[1] || simCards[0];

  const handleEditClick = (sim: SimCard) => {
    setEditingSim(sim);
    setEditCarrierName(sim.carrierName);
    setEditPhone(sim.phoneNumber);
    setEditBalance(sim.balance);
    setEditPlan(sim.planData);
  };

  const handleSaveSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSim) return;
    const updated: SimCard = {
      ...editingSim,
      carrierName: editCarrierName.trim() || editingSim.carrierName,
      phoneNumber: editPhone.trim() || editingSim.phoneNumber,
      balance: editBalance.trim() || editingSim.balance,
      planData: editPlan.trim() || editingSim.planData,
    };
    onUpdateSim(updated);
    setEditingSim(null);
  };

  const handleSetDefaultSim = (simId: 'sim1' | 'sim2') => {
    simCards.forEach((s) => {
      onUpdateSim({
        ...s,
        isDefault: s.id === simId,
      });
    });
  };

  const filteredUSSD = ussdCodes.filter((u) => {
    if (activeCarrierFilter !== 'all') {
      if (activeCarrierFilter === 'jawwal' && !u.carrier.includes('جوال')) return false;
      if (activeCarrierFilter === 'ooredoo' && !u.carrier.includes('أوريدو')) return false;
      if (activeCarrierFilter === 'device' && u.category !== 'device') return false;
    }
    if (searchUssd.trim()) {
      const q = searchUssd.toLowerCase();
      return u.label.toLowerCase().includes(q) || u.code.includes(q) || u.carrier.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full px-4 pb-6 max-w-lg mx-auto w-full select-none overflow-y-auto">
      {/* Header */}
      <div className="pt-2 mb-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>إدارة شرائح الاتصال SIM والشبكة</span>
          <Cpu className="w-5 h-5 text-indigo-500" />
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          التحكم بالشريحة المزدوجة، باقات البيانات، وأكواد خدمات USSD السريعة
        </p>
      </div>

      {/* Dual SIM Cards Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* SIM 1 Card */}
        <div
          className={`relative rounded-3xl p-4 border transition-all ${
            sim1.isDefault
              ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-900/50 border-indigo-500/60 shadow-lg text-white'
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-bold text-sm">{sim1.carrierName}</h2>
            </div>
            <button
              onClick={() => handleEditClick(sim1)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              title="تعديل بيانات الشريحة"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-mono tabular-nums opacity-80 dir-ltr text-right mb-3">
            {sim1.phoneNumber}
          </p>

          <div className="space-y-1.5 text-xs mb-3">
            <div className="flex items-center justify-between">
              <span className="opacity-70">الرصيد المتاح:</span>
              <span className="font-bold font-mono text-emerald-400">{sim1.balance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">باقة البيانات:</span>
              <span className="font-mono text-indigo-300">{sim1.planData}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">نوع الشبكة:</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {sim1.networkType}
              </span>
            </div>
          </div>

          {/* Set Default */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] opacity-75">المكالمات الافتراضية</span>
            <button
              onClick={() => handleSetDefaultSim('sim1')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                sim1.isDefault
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {sim1.isDefault ? 'مفعلة كافتراضية' : 'تعيين كافتراضية'}
            </button>
          </div>
        </div>

        {/* SIM 2 Card */}
        <div
          className={`relative rounded-3xl p-4 border transition-all ${
            sim2.isDefault
              ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-900/50 border-emerald-500/60 shadow-lg text-white'
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-bold text-sm">{sim2.carrierName}</h2>
            </div>
            <button
              onClick={() => handleEditClick(sim2)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              title="تعديل بيانات الشريحة"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-mono tabular-nums opacity-80 dir-ltr text-right mb-3">
            {sim2.phoneNumber}
          </p>

          <div className="space-y-1.5 text-xs mb-3">
            <div className="flex items-center justify-between">
              <span className="opacity-70">الرصيد المتاح:</span>
              <span className="font-bold font-mono text-emerald-400">{sim2.balance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">باقة البيانات:</span>
              <span className="font-mono text-emerald-300">{sim2.planData}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-70">نوع الشبكة:</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {sim2.networkType}
              </span>
            </div>
          </div>

          {/* Set Default */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] opacity-75">المكالمات الافتراضية</span>
            <button
              onClick={() => handleSetDefaultSim('sim2')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                sim2.isDefault
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {sim2.isDefault ? 'مفعلة كافتراضية' : 'تعيين كافتراضية'}
            </button>
          </div>
        </div>
      </div>

      {/* Manual USSD Code Runner */}
      <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 mb-6">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>تشغيل كود USSD مخصص للشريحة</span>
        </h3>

        <div className="flex items-center gap-2">
          {/* SIM Select */}
          <select
            value={selectedSimSlot}
            onChange={(e) => setSelectedSimSlot(e.target.value as 'sim1' | 'sim2')}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-medium text-slate-900 dark:text-white"
          >
            <option value="sim1">شريحة 1 ({sim1.carrierName})</option>
            <option value="sim2">شريحة 2 ({sim2.carrierName})</option>
          </select>

          {/* Code input */}
          <input
            type="text"
            placeholder="مثال: *166# أو *#06#"
            value={customUssdInput}
            onChange={(e) => setCustomUssdInput(e.target.value)}
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dir-ltr text-right"
          />

          <button
            onClick={() => {
              if (customUssdInput.trim()) {
                onExecuteUSSD(customUssdInput.trim(), selectedSimSlot);
              }
            }}
            disabled={!customUssdInput.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
          >
            <span>طلب</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick USSD Codes Directory */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            دليل أكواد خدمات الشبكة السريعة
          </h3>

          {/* Carrier Pills */}
          <div className="flex items-center gap-1 text-[11px]">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'jawwal', label: 'جوال' },
              { id: 'ooredoo', label: 'أوريدو' },
              { id: 'device', label: 'الجهاز' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveCarrierFilter(f.id)}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  activeCarrierFilter === f.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن كود الخدمة أو الرصيد..."
            value={searchUssd}
            onChange={(e) => setSearchUssd(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* List of USSD Codes */}
        <div className="space-y-2">
          {filteredUSSD.map((u) => (
            <div
              key={u.id}
              className="bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-3 shadow-xs flex items-center justify-between hover:border-indigo-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded dir-ltr">
                    {u.code}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {u.carrier}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {u.label}
                </p>
              </div>

              {/* Instant Execution Buttons (SIM 1 or SIM 2) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onExecuteUSSD(u.code, 'sim1')}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-bold transition-colors"
                  title="تشغيل عبر شريحة 1"
                >
                  شريحة 1
                </button>
                <button
                  onClick={() => onExecuteUSSD(u.code, 'sim2')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-[11px] font-bold transition-colors"
                  title="تشغيل عبر شريحة 2"
                >
                  شريحة 2
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit SIM Modal */}
      {editingSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              تعديل بيانات {editingSim.carrierName} ({editingSim.id === 'sim1' ? 'شريحة 1' : 'شريحة 2'})
            </h3>

            <form onSubmit={handleSaveSim} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  اسم مزود الخدمة (Carrier)
                </label>
                <input
                  type="text"
                  value={editCarrierName}
                  onChange={(e) => setEditCarrierName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الشريحة
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  الرصيد
                </label>
                <input
                  type="text"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  حزمة البيانات والإنترنت
                </label>
                <input
                  type="text"
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSim(null)}
                  className="px-4 py-2 text-xs text-slate-500"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
