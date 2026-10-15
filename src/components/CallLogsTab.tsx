import React, { useState, useMemo } from 'react';
import { CallLog, SimCard, Contact } from '../types/phone';
import { 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  PhoneOff, 
  Phone, 
  PhoneCall,
  Trash2, 
  Search, 
  Play, 
  Pause, 
  MessageSquare,
  Clock,
  CircleDot
} from 'lucide-react';

interface CallLogsTabProps {
  logs: CallLog[];
  simCards: SimCard[];
  contacts: Contact[];
  onStartCall: (number: string, simId: 'sim1' | 'sim2', contact?: Contact) => void;
  onDeleteLog: (id: string) => void;
  onClearAllLogs: () => void;
}

export const CallLogsTab: React.FC<CallLogsTabProps> = ({
  logs,
  simCards,
  contacts,
  onStartCall,
  onDeleteLog,
  onClearAllLogs,
}) => {
  const [filter, setFilter] = useState<'all' | 'missed' | 'sim1' | 'sim2' | 'recorded'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingLogId, setPlayingLogId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filter tab
      if (filter === 'missed' && log.type !== 'missed') return false;
      if (filter === 'sim1' && log.simId !== 'sim1') return false;
      if (filter === 'sim2' && log.simId !== 'sim2') return false;
      if (filter === 'recorded' && !log.recordedAudioUrl && log.durationSeconds < 60) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = log.name.toLowerCase().includes(query);
        const matchNumber = log.number.includes(query);
        return matchName || matchNumber;
      }
      return true;
    });
  }, [logs, filter, searchQuery]);

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return 'لم يتم الرد';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} ث`;
    return `${m} د ${s} ث`;
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const time = date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) return `اليوم، ${time}`;
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) + ` · ${time}`;
  };

  const getCallIcon = (type: CallLog['type']) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="w-4 h-4 text-emerald-500" />;
      case 'outgoing':
        return <PhoneOutgoing className="w-4 h-4 text-indigo-500" />;
      case 'missed':
        return <PhoneMissed className="w-4 h-4 text-rose-500" />;
      case 'rejected':
        return <PhoneOff className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pb-6 max-w-lg mx-auto w-full select-none">
      {/* Header & Search */}
      <div className="pt-2 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            سجل المكالمات
          </h1>
          {logs.length > 0 && (
            <button
              onClick={onClearAllLogs}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الرقم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'missed', label: 'الفائتة' },
            { id: 'sim1', label: 'شريحة 1' },
            { id: 'sim2', label: 'شريحة 2' },
            { id: 'recorded', label: 'المسجلة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`flex-1 min-w-[64px] py-1.5 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap text-center ${
                filter === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {filteredLogs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              لا توجد مكالمات في هذا القسم
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              ستظهر مكالماتك الصادرة والواردة والفائتة هنا
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const contact = contacts.find(c => c.id === log.contactId);
            return (
              <div
                key={log.id}
                className="group relative bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/50 rounded-2xl p-3 shadow-xs hover:border-indigo-400/50 transition-all flex items-center justify-between"
              >
                {/* Left/Right Click Area */}
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => onStartCall(log.number, log.simId, contact)}
                >
                  {/* Call Type Icon Container */}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0">
                    {getCallIcon(log.type)}
                  </div>

                  {/* Caller Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-semibold truncate ${
                        log.type === 'missed' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {log.name}
                      </h3>
                      {/* SIM Slot Badge */}
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        log.simId === 'sim1'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {log.simId === 'sim1' ? 'شريحة 1' : 'شريحة 2'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <span className="font-mono dir-ltr">{log.number}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </div>

                    {log.note && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 truncate">
                        {log.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Actions: Duration & Call Trigger */}
                <div className="flex items-center gap-2 shrink-0 pr-2">
                  <div className="text-right text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {formatDuration(log.durationSeconds)}
                    </span>
                  </div>

                  {/* Real SIM Native Call */}
                  <button
                    onClick={() => {
                      window.location.href = `tel:${log.number}`;
                    }}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                    title="اتصال فعلي عبر شريحة الهاتف (SIM Call)"
                  >
                    <PhoneCall className="w-3.5 h-3.5 fill-white" />
                  </button>

                  {/* Redial with Theme Screen */}
                  <button
                    onClick={() => onStartCall(log.number, log.simId, contact)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    title="فتح شاشة الاتصال بالخلفية"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete individual log */}
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
