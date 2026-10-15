import React, { useState } from 'react';
import { 
  Plus, 
  UploadCloud, 
  FolderPlus, 
  Camera, 
  Image as ImageIcon, 
  Folder, 
  Star, 
  Clock, 
  Lock, 
  Trash2, 
  HardDrive, 
  Archive, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  ShieldCheck,
  FolderOpen,
  X
} from 'lucide-react';
import { DriveFolder, DriveNavTab, StorageStats, AccountProfile } from '../types/drive';
import { formatBytes } from '../utils/formatters';

interface DriveSidebarProps {
  currentTab: DriveNavTab;
  onSelectTab: (tab: DriveNavTab) => void;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  folders: DriveFolder[];
  storageStats: StorageStats;
  onOpenUpload: () => void;
  onOpenCamera: () => void;
  onOpenNewFolder: () => void;
  onOpenBackupModal: () => void;
  onOpenAccountSecurity: () => void;
  onOpenAccountRecovery: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  profile?: AccountProfile | null;
  onOpenGoogleSignIn?: () => void;
}

export const DriveSidebar: React.FC<DriveSidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedFolderId,
  onSelectFolder,
  folders,
  storageStats,
  onOpenUpload,
  onOpenCamera,
  onOpenNewFolder,
  onOpenBackupModal,
  onOpenAccountSecurity,
  onOpenAccountRecovery,
  isOpenMobile,
  onCloseMobile,
  profile,
  onOpenGoogleSignIn,
}) => {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [foldersExpanded, setFoldersExpanded] = useState(true);

  const navItems = [
    { id: 'all' as DriveNavTab, label: 'ملفاتي / كل الصور', icon: ImageIcon, count: storageStats.photoCount },
    { id: 'starred' as DriveNavTab, label: 'المميزة بنجمة', icon: Star },
    { id: 'recent' as DriveNavTab, label: 'الأحدث', icon: Clock },
    { id: 'vault' as DriveNavTab, label: 'خزنة الصور السرية', icon: Lock, isVault: true },
    { id: 'trash' as DriveNavTab, label: 'سلة المهملات', icon: Trash2, count: storageStats.trashCount },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[61px] bottom-0 right-0 z-40 w-72 md:w-64 h-full md:h-[calc(100vh-61px)] bg-slate-50/95 dark:bg-slate-900/95 md:bg-white md:dark:bg-slate-900/60 border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 overflow-y-auto ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Mobile Header Close */}
          <div className="flex md:hidden items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">القائمة السريعة</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Google Drive "+ New" Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowNewMenu(!showNewMenu)}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-md hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">جديد</span>
            </button>

            {/* "+ New" Dropdown Items */}
            {showNewMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowNewMenu(false)}
                />
                <div className="absolute top-full mt-2 right-0 left-0 z-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 overflow-hidden animate-fade-in">
                  <button
                    onClick={() => {
                      setShowNewMenu(false);
                      onOpenUpload();
                      onCloseMobile();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors text-right cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-blue-500" />
                    <span>رفع صور من الجهاز</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowNewMenu(false);
                      onOpenCamera();
                      onCloseMobile();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-600 transition-colors text-right cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-500" />
                    <span>التقاط صورة بالكاميرا</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      setShowNewMenu(false);
                      onOpenNewFolder();
                      onCloseMobile();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-900/40 hover:text-amber-600 transition-colors text-right cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4 text-amber-500" />
                    <span>إنشاء مجلد جديد</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id && selectedFolderId === null;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onSelectFolder(null);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-right cursor-pointer ${
                    isActive
                      ? 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Folders Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-500 dark:text-slate-400">
              <button
                onClick={() => setFoldersExpanded(!foldersExpanded)}
                className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {foldersExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>المجلدات ({folders.filter((f) => !f.isVault).length})</span>
              </button>
              <button
                onClick={onOpenNewFolder}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                title="إضافة مجلد جديد"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {foldersExpanded && (
              <div className="mt-1 space-y-0.5 pr-2">
                {folders
                  .filter((f) => !f.isVault)
                  .map((folder) => {
                    const isSelected = selectedFolderId === folder.id;
                    return (
                      <button
                        key={folder.id}
                        onClick={() => {
                          onSelectFolder(folder.id);
                          onSelectTab('folders');
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Folder
                            className="w-4 h-4 shrink-0"
                            style={{ color: folder.color || '#4285f4' }}
                            fill={isSelected ? folder.color : 'none'}
                          />
                          <span className="truncate">{folder.name}</span>
                        </div>
                        {folder.itemCount !== undefined && folder.itemCount > 0 && (
                          <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                            {folder.itemCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Storage Quota & Backup */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Google Account Profile / Sign In Card */}
          {onOpenGoogleSignIn && (
            profile?.isSignedInWithGoogle ? (
              <button
                type="button"
                onClick={() => {
                  onOpenGoogleSignIn();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition cursor-pointer text-right group"
                title="إدارة حساب Google والصور"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shrink-0 shadow-xs">
                    {(profile.email || profile.name).charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {profile.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {profile.email}
                    </div>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs shrink-0">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenGoogleSignIn();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>تسجيل الدخول بـ Google</span>
              </button>
            )
          )}

          {/* Storage Meter */}
          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                <span>مساحة التخزين</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {formatBytes(storageStats.usedBytes)}
              </span>
            </div>

            {/* Storage Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, Math.min(100, storageStats.usagePercent || 5))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{storageStats.photoCount} صورة مخزنة</span>
              <span>100% أوفلاين</span>
            </div>
          </div>

          {/* Backup / Export Button */}
          <button
            onClick={onOpenBackupModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5 text-amber-500" />
            <span>نسخ احتياطي واستعادة (ZIP)</span>
          </button>

          {/* Account Security & Phone Recovery */}
          <button
            onClick={() => {
              onOpenAccountSecurity();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer border border-blue-200/80 dark:border-blue-900/60"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>أمان الحساب ورقم الاسترداد</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>
      </aside>
    </>
  );
};
