import React, { useState, useMemo } from 'react';
import { Contact, SimCard } from '../types/phone';
import { audioToneService } from '../services/audioTones';
import { 
  Phone, 
  Delete, 
  UserPlus, 
  MessageSquare, 
  Send, 
  Star, 
  Voicemail as VoicemailIcon,
  Search,
  ExternalLink,
  ShieldCheck,
  Radio,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface KeypadTabProps {
  contacts: Contact[];
  simCards: SimCard[];
  onStartCall: (number: string, simId: 'sim1' | 'sim2', contact?: Contact, triggerNative?: boolean) => void;
  onExecuteUSSD: (code: string, simId: 'sim1' | 'sim2') => void;
  onAddContactClick: (phoneToPrefill: string) => void;
  onOpenVoicemail: () => void;
}

const KEYPAD_BUTTONS = [
  { digit: '1', sub: 'البريد الصوتي ➿', letters: '' },
  { digit: '2', sub: 'ABC', letters: 'أ ب ت ث' },
  { digit: '3', sub: 'DEF', letters: 'ج ح خ د' },
  { digit: '4', sub: 'GHI', letters: 'ذ ر ز س' },
  { digit: '5', sub: 'JKL', letters: 'ش ص ض ط' },
  { digit: '6', sub: 'MNO', letters: 'ظ ع غ ف' },
  { digit: '7', sub: 'PQRS', letters: 'ق ك ل م' },
  { digit: '8', sub: 'TUV', letters: 'ن هـ و ي' },
  { digit: '9', sub: 'WXYZ', letters: 'ء ة ى' },
  { digit: '*', sub: '', letters: 'نجمة' },
  { digit: '0', sub: '+', letters: '' },
  { digit: '#', sub: '', letters: 'مربع' },
];

export const KeypadTab: React.FC<KeypadTabProps> = ({
  contacts,
  simCards,
  onStartCall,
  onExecuteUSSD,
  onAddContactClick,
  onOpenVoicemail,
}) => {
  const [dialedNumber, setDialedNumber] = useState<string>('');
  const [callMode, setCallMode] = useState<'real_sim' | 'screen_theme'>('real_sim');

  const sim1 = simCards.find(s => s.id === 'sim1') || simCards[0];
  const sim2 = simCards.find(s => s.id === 'sim2') || simCards[1] || simCards[0];

  // Detect Palestinian Carrier or Emergency service
  const detectedNetwork = useMemo(() => {
    const clean = dialedNumber.trim().replace(/\s/g, '');
    if (!clean) return null;

    if (clean === '111') {
      return { name: 'خدمة مشتركي جوال فلسطين (111)', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/30' };
    }
    if (clean === '101') {
      return { name: 'طوارئ إسعاف الهلال الأحمر الفلسطيني (101)', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-500/30' };
    }
    if (clean === '100') {
      return { name: 'الشرطة الفلسطينية (100)', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-500/30' };
    }
    if (clean === '102') {
      return { name: 'الدفاع المدني الفلسطيني (102)', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-500/30' };
    }
    if (clean === '122') {
      return { name: 'خدمة مشتركي أوريدو فلسطين (122)', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-500/30' };
    }
    if (clean.startsWith('059') || clean.startsWith('+97059') || clean.startsWith('97059') || clean.startsWith('+97259')) {
      return { name: 'شبكة جوال الفلسطينية (Jawwal 059)', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/40' };
    }
    if (clean.startsWith('056') || clean.startsWith('+97056') || clean.startsWith('97056') || clean.startsWith('+97256')) {
      return { name: 'شبكة أوريدو فلسطين (Ooredoo 056)', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-500/40' };
    }
    return null;
  }, [dialedNumber]);

  // Detect USSD format (starts with * or # and ends with #)
  const isUSSD = useMemo(() => {
    const trimmed = dialedNumber.trim();
    return (trimmed.startsWith('*') || trimmed.startsWith('#')) && trimmed.endsWith('#');
  }, [dialedNumber]);

  // Live T9 & Number search matching
  const matchingContacts = useMemo(() => {
    if (!dialedNumber) return [];
    const clean = dialedNumber.replace(/\D/g, '');
    return contacts.filter(c => {
      const contactClean = c.phone.replace(/\D/g, '');
      const matchNumber = clean.length > 0 && contactClean.includes(clean);
      const matchName = c.name.toLowerCase().includes(dialedNumber.toLowerCase());
      return matchNumber || matchName;
    }).slice(0, 4);
  }, [contacts, dialedNumber]);

  const handleDigitPress = (digit: string) => {
    audioToneService.playDtmf(digit);
    setDialedNumber(prev => prev + digit);
  };

  const handleBackspace = () => {
    audioToneService.triggerHaptic(20);
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    audioToneService.triggerHaptic(50);
    setDialedNumber('');
  };

  // Direct real cellular SIM call via phone app (tel:)
  const triggerRealNativeSimCall = (num: string) => {
    audioToneService.triggerHaptic(60);
    const clean = num.trim();
    window.location.href = `tel:${clean}`;
  };

  // Real native SMS via phone app (sms:)
  const triggerRealNativeSms = (num: string) => {
    audioToneService.triggerHaptic(40);
    const clean = num.trim();
    window.location.href = `sms:${clean}`;
  };

  const handleDial = (simId: 'sim1' | 'sim2', triggerNativeSim = false) => {
    if (!dialedNumber.trim()) return;

    if (isUSSD) {
      onExecuteUSSD(dialedNumber.trim(), simId);
      return;
    }

    // Check if matched contact
    const matched = contacts.find(
      c => c.phone.replace(/\D/g, '') === dialedNumber.replace(/\D/g, '')
    );

    if (triggerNativeSim) {
      triggerRealNativeSimCall(dialedNumber.trim());
    }

    onStartCall(dialedNumber.trim(), simId, matched, triggerNativeSim);
  };

  const handleLongPress1 = () => {
    onOpenVoicemail();
  };

  // WhatsApp quick launcher formatted for Palestinian mobile networks
  const handleOpenWhatsApp = () => {
    if (!dialedNumber) return;
    let clean = dialedNumber.replace(/\D/g, '');
    // Convert 059... or 056... to 97059... or 97056...
    if (clean.startsWith('059') || clean.startsWith('056')) {
      clean = '970' + clean.slice(1);
    } else if (clean.startsWith('59') || clean.startsWith('56')) {
      clean = '970' + clean;
    }
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full justify-between pb-6 px-4 max-w-md mx-auto w-full select-none">
      {/* Top Display Area */}
      <div className="pt-2 flex flex-col items-center">
        {/* Palestinian Network Live Detection Badge */}
        {detectedNetwork && (
          <div className={`mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs animate-in fade-in duration-200 ${detectedNetwork.color}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{detectedNetwork.name}</span>
          </div>
        )}

        {/* T9 Matching Contacts Bar */}
        {matchingContacts.length > 0 && (
          <div className="w-full mb-2 bg-slate-100 dark:bg-slate-900/90 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 px-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-3 h-3" />
              <span>جهات اتصال مطابقة ({matchingContacts.length})</span>
            </div>
            <div className="space-y-1 mt-1">
              {matchingContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setDialedNumber(contact.phone);
                    handleDial(contact.preferredSim || 'sim1', false);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                      {contact.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {contact.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono dir-ltr">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerRealNativeSimCall(contact.phone);
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 flex items-center gap-1"
                      title="اتصال حقيقي فوري بالشريحة"
                    >
                      <Phone className="w-3 h-3" />
                      <span>اتصال حقيقي</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dialed Number Input / Display */}
        <div className="w-full flex flex-col items-center justify-center min-h-[58px] mb-2 px-2">
          <div className="relative w-full text-center">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-wider text-slate-900 dark:text-white dir-ltr inline-block max-w-full overflow-x-auto whitespace-nowrap">
              {dialedNumber || <span className="text-slate-400 dark:text-slate-600 select-none">أدخل الرقم</span>}
            </span>
          </div>

          {/* USSD hint */}
          {isUSSD && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              كود خدمة USSD لشبكة جوال
            </span>
          )}
        </div>

        {/* Action Row for Dialed Number (Real SIM / WhatsApp / Save Contact / SMS) */}
        {dialedNumber && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap justify-center">
            {/* Real Native Call Trigger */}
            <button
              onClick={() => triggerRealNativeSimCall(dialedNumber)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              title="إجراء اتصال هاتفي حقيقي عبر شريحة الهاتف الفعلية"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-white" />
              <span>اتصال هاتفي حقيقي (SIM)</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-colors"
              title="اتصال أو محادثة عبر واتساب لشبكة جوال"
            >
              <span>واتساب جوال</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* SMS */}
            <button
              onClick={() => triggerRealNativeSms(dialedNumber)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
              title="إرسال رسالة SMS عبر الشريحة"
            >
              <MessageSquare className="w-3 h-3" />
              <span>SMS</span>
            </button>

            {/* Save Contact */}
            <button
              onClick={() => onAddContactClick(dialedNumber)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              <span>حفظ</span>
            </button>
          </div>
        )}
      </div>

      {/* 3x4 Dialpad Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs mx-auto w-full my-auto">
        {KEYPAD_BUTTONS.map((item) => (
          <button
            key={item.digit}
            onClick={() => handleDigitPress(item.digit)}
            onContextMenu={(e) => {
              if (item.digit === '1') {
                e.preventDefault();
                handleLongPress1();
              }
            }}
            className="group relative h-16 sm:h-18 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 active:bg-emerald-50 dark:active:bg-emerald-950/40 flex flex-col items-center justify-center transition-all duration-100"
          >
            <span className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-none group-active:text-emerald-600 dark:group-active:text-emerald-400">
              {item.digit}
            </span>
            {(item.sub || item.letters) && (
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
                {item.sub || item.letters}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Bar: Call Mode Selector & Dual SIM Dial Buttons */}
      <div className="pt-2 max-w-xs mx-auto w-full">
        {/* Mode Selector: Real Phone Call vs Wallpaper Screen */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-2 border border-slate-200 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setCallMode('real_sim')}
            className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              callMode === 'real_sim'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>اتصال فعلي (SIM)</span>
          </button>

          <button
            type="button"
            onClick={() => setCallMode('screen_theme')}
            className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              callMode === 'screen_theme'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>شاشة الخلفيات</span>
          </button>
        </div>

        {/* Backspace row if number is typed */}
        <div className="h-6 flex items-center justify-between px-2 mb-2">
          <span className="text-[10px] text-slate-400">
            {callMode === 'real_sim' ? '📱 وضع الاتصال الفعلي عبر الشريحة مفعّل' : '🎨 وضع شاشة الاتصال بالخلفية مفعّل'}
          </span>
          {dialedNumber && (
            <button
              onClick={handleBackspace}
              onDoubleClick={handleClearAll}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="مسح رقم (انقر مرتين للمسح الكامل)"
              aria-label="مسح الرقم"
            >
              <Delete className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dual SIM Dial Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* SIM 1: Jawwal Palestine 059 */}
          <button
            onClick={() => handleDial('sim1', callMode === 'real_sim')}
            disabled={!dialedNumber}
            className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all px-3 border border-emerald-400/30"
            title="اتصال حقيقي عبر شريحة جوال الفلسطينية (059)"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 fill-white" />
            </div>
            <div className="text-right leading-tight overflow-hidden">
              <div className="text-xs font-bold truncate">
                {callMode === 'real_sim' ? 'اتصال حقيقي 059' : 'شريحة جوال'}
              </div>
              <div className="text-[10px] text-emerald-100 font-mono truncate">Jawwal 059</div>
            </div>
          </button>

          {/* SIM 2: Ooredoo Palestine 056 */}
          <button
            onClick={() => handleDial('sim2', callMode === 'real_sim')}
            disabled={!dialedNumber}
            className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all px-3 border border-rose-400/30"
            title="اتصال عبر شريحة أوريدو فلسطين (056)"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 fill-white" />
            </div>
            <div className="text-right leading-tight overflow-hidden">
              <div className="text-xs font-bold truncate">
                {callMode === 'real_sim' ? 'اتصال حقيقي 056' : 'شريحة أوريدو'}
              </div>
              <div className="text-[10px] text-rose-100 font-mono truncate">Ooredoo 056</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
