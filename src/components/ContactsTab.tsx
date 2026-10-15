import React, { useState, useMemo } from 'react';
import { Contact, SimCard, CallWallpaper } from '../types/phone';
import { 
  UserPlus, 
  Search, 
  Star, 
  Phone, 
  PhoneCall,
  MessageSquare, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  Download,
  Upload,
  X,
  Check,
  Building
} from 'lucide-react';

interface ContactsTabProps {
  contacts: Contact[];
  simCards: SimCard[];
  wallpapers: CallWallpaper[];
  onStartCall: (number: string, simId: 'sim1' | 'sim2', contact?: Contact) => void;
  onSaveContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onExportVCF: () => void;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({
  contacts,
  simCards,
  wallpapers,
  onStartCall,
  onSaveContact,
  onDeleteContact,
  onExportVCF,
}) => {
  const [search, setSearch] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // Form state for creating / editing
  const [formName, setFormName] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formCompany, setFormCompany] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formWallpaperId, setFormWallpaperId] = useState<string>('');
  const [formPreferredSim, setFormPreferredSim] = useState<'sim1' | 'sim2'>('sim1');

  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => {
        if (onlyFavorites && !c.isFavorite) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchPhone = c.phone.includes(q);
          const matchCompany = c.company?.toLowerCase().includes(q);
          return matchName || matchPhone || matchCompany;
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [contacts, search, onlyFavorites]);

  const openEditModal = (c: Contact) => {
    setEditingContact(c);
    setFormName(c.name);
    setFormPhone(c.phone);
    setFormEmail(c.email || '');
    setFormCompany(c.company || '');
    setFormTitle(c.title || '');
    setFormWallpaperId(c.customWallpaperId || '');
    setFormPreferredSim(c.preferredSim || 'sim1');
    setIsNewModalOpen(true);
  };

  const openNewModal = (prefillPhone = '') => {
    setEditingContact(null);
    setFormName('');
    setFormPhone(prefillPhone);
    setFormEmail('');
    setFormCompany('');
    setFormTitle('');
    setFormWallpaperId('');
    setFormPreferredSim('sim1');
    setIsNewModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const contactToSave: Contact = {
      id: editingContact ? editingContact.id : 'c_' + Date.now(),
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || undefined,
      company: formCompany.trim() || undefined,
      title: formTitle.trim() || undefined,
      isFavorite: editingContact ? editingContact.isFavorite : false,
      customWallpaperId: formWallpaperId || undefined,
      preferredSim: formPreferredSim,
      lastCallTimestamp: editingContact?.lastCallTimestamp,
    };

    onSaveContact(contactToSave);
    setIsNewModalOpen(false);
  };

  const toggleFavorite = (c: Contact) => {
    onSaveContact({
      ...c,
      isFavorite: !c.isFavorite,
    });
  };

  const openWhatsApp = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('059') || clean.startsWith('056')) clean = '970' + clean.slice(1);
    else if (clean.startsWith('59') || clean.startsWith('56')) clean = '970' + clean;
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  const triggerNativeCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex flex-col h-full px-4 pb-6 max-w-lg mx-auto w-full select-none">
      {/* Header */}
      <div className="pt-2 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              جهات الاتصال
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">
              {contacts.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* VCF Export */}
            <button
              onClick={onExportVCF}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              title="تصدير بصيغة vCard VCF للهاتف"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير VCF</span>
            </button>

            {/* Add Contact Button */}
            <button
              onClick={() => openNewModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة جهة</span>
            </button>
          </div>
        </div>

        {/* Search & Favorites Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم أو الجهة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`p-2.5 rounded-xl border transition-all ${
              onlyFavorites
                ? 'bg-amber-500/15 border-amber-400 text-amber-500'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title="المفضلة فقط"
          >
            <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {filteredContacts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              لا توجد جهات اتصال تطابق بحثك
            </p>
            <button
              onClick={() => openNewModal(search)}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-medium"
            >
              إضافة جهة اتصال جديدة
            </button>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const customWp = wallpapers.find(w => w.id === contact.customWallpaperId);
            return (
              <div
                key={contact.id}
                className="bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-3 shadow-xs hover:border-indigo-400/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Contact Avatar & Name Area */}
                  <div
                    onClick={() => openEditModal(contact)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-base flex items-center justify-center border border-indigo-500/20">
                        {contact.name.slice(0, 2)}
                      </div>
                      {/* Custom Wallpaper Indicator */}
                      {customWp && (
                        <div
                          className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden shadow-xs"
                          title={`خلفية مخصصة: ${customWp.title}`}
                        >
                          {customWp.imageSrc ? (
                            <img src={customWp.imageSrc} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full" style={{ background: customWp.gradientCss }} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {contact.name}
                        </h3>
                        {contact.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono dir-ltr truncate text-right">
                        {contact.phone}
                      </p>

                      {contact.company && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          <Building className="w-3 h-3 shrink-0" />
                          <span className="truncate">{contact.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Jawwal Direct Call */}
                    <button
                      onClick={() => onStartCall(contact.phone, 'sim1', contact)}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                      title="اتصال عبر شريحة جوال (059)"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>

                    {/* Real Native Phone Call */}
                    <button
                      onClick={() => triggerNativeCall(contact.phone)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                      title="اتصال فعلي عبر شريحة الهاتف (Native SIM)"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => openWhatsApp(contact.phone)}
                      className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700/50 transition-colors"
                      title="محادثة أو اتصال واتساب"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* Favorite Star */}
                    <button
                      onClick={() => toggleFavorite(contact)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-400 transition-colors"
                      title="مفضلة"
                    >
                      <Star className={`w-3.5 h-3.5 ${contact.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / New Contact Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingContact ? 'تعديل جهة الاتصال' : 'إضافة جهة اتصال جديدة'}
              </h2>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: د. فيصل الحربي"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="مثال: 0501234567"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono dir-ltr text-right"
                />
              </div>

              {/* Company & Title */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    الشركة / الجهة
                  </label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="مستشفى الملك فهد"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="استشاري"
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="contact@domain.com"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono dir-ltr text-right"
                />
              </div>

              {/* Custom Call Wallpaper for this contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  خلفية الاتصال المخصصة لهذا الشخص
                </label>
                <div className="grid grid-cols-4 gap-2 pt-1 max-h-36 overflow-y-auto pr-1">
                  <div
                    onClick={() => setFormWallpaperId('')}
                    className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                      !formWallpaperId
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-center">الافتراضية</span>
                  </div>

                  {wallpapers.map((wp) => (
                    <div
                      key={wp.id}
                      onClick={() => setFormWallpaperId(wp.id)}
                      className={`relative h-16 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                        formWallpaperId === wp.id
                          ? 'border-indigo-600 ring-2 ring-indigo-500/40'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      {wp.imageSrc ? (
                        <img src={wp.imageSrc} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: wp.gradientCss }} />
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white p-0.5 truncate text-center">
                        {wp.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred SIM */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  الشريحة المفضلة للاتصال به
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormPreferredSim('sim1')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formPreferredSim === 'sim1'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>شريحة 1 (جوال 059)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPreferredSim('sim2')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formPreferredSim === 'sim2'
                        ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>شريحة 2 (أوريدو 056)</span>
                  </button>
                </div>
              </div>

              {/* Submit & Delete */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                {editingContact ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteContact(editingContact.id);
                      setIsNewModalOpen(false);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف جهة الاتصال</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs"
                  >
                    حفظ جهة الاتصال
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
