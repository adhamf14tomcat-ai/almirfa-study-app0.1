import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        id="pwa-install-btn"
        onClick={handleInstallClick}
        aria-label="تثبيت تطبيق المرفأ"
        className={`flex items-center gap-2 font-medium transition-all duration-200 cursor-pointer ${
          variant === 'header'
            ? 'px-3 py-1.5 text-xs rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-100 border border-slate-300/40 dark:border-slate-700/60'
            : variant === 'sidebar'
            ? 'w-full px-3.5 py-2.5 text-sm rounded-xl bg-sky-600/10 hover:bg-sky-600/20 text-sky-700 dark:text-sky-300 border border-sky-500/20 text-right'
            : 'px-4 py-2 text-sm rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
        }`}
      >
        <Download className="w-4 h-4 flex-shrink-0" />
        <span>تثبيت المرفأ (PWA)</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl transition-all duration-200 text-right"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">تثبيت المرفأ على جهازك</span>
                <span className="text-xl">⚓</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              تطبيق «المرفأ» يعمل محلياً دون إنترنت. لتثبيته كبرنامج مستقل على شاشتك الرئيسية:
            </p>

            <div className="mt-4 space-y-3 text-xs bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-semibold">1. اضغط على زر المشاركة (Share)</strong>
                  <span className="text-slate-500 dark:text-slate-400">في شريط متصفح Safari أو Chrome بالأسفل أو الأعلى.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-semibold">2. اختر «إضافة إلى الشاشة الرئيسية»</strong>
                  <span className="text-slate-500 dark:text-slate-400">Add to Home Screen لفتحه كنافذة مستقلة وسريعة.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition"
              style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      )}
    </>
  );
};
