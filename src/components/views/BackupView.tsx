import React, { useState, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  ShieldCheck,
} from 'lucide-react';
import { dbService } from '../../services/db';

interface BackupViewProps {
  onDataRestored: () => void;
  onResetAllData: () => void;
}

export const BackupView: React.FC<BackupViewProps> = ({
  onDataRestored,
  onResetAllData,
}) => {
  const [includeAudio, setIncludeAudio] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const jsonString = await dbService.exportBackupJSON(includeAudio);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `mirfa_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({
        text: 'تم تصدير وحفظ نسخة المرفأ الاحتياطية بنجاح على جهازك.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        text: 'حدث خطأ أثناء تصدير النسخة الاحتياطية.',
        type: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const text = reader.result as string;
        // Automatically save snapshot of current state before restoring
        await dbService.exportBackupJSON(true);

        const success = await dbService.importBackupJSON(text);
        if (success) {
          setStatusMessage({
            text: 'تم استعادة النسخة الاحتياطية بنجاح وتحديث كافة البيانات!',
            type: 'success',
          });
          onDataRestored();
        } else {
          setStatusMessage({
            text: 'الملف المحدد غير صالح أو تالف ولا يتوافق مع هيكلية المرفأ.',
            type: 'error',
          });
        }
      } catch (err) {
        console.error(err);
        setStatusMessage({
          text: 'تعذر استعادة الملف. تأكد من أنه ملف JSON سليم من تطبيق المرفأ.',
          type: 'error',
        });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 space-y-6 text-right">
      {/* Header */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
          <span>النسخ الاحتياطي واستعادة البيانات</span>
          <Database className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          بياناتك ملك لك بالكامل. يمكنك تنزيل ملف نسختك الاحتياطية واستعادته في أي وقت وعلى أي جهاز آخر
        </p>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Export Card */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-sky-600 dark:text-sky-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">تصدير نسخة احتياطية (JSON)</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              تجميع كل جلساتك، وموادك، وأوسمتك، ومقولاتك، وإعداداتك في ملف واحد
            </p>
          </div>
        </div>

        {/* Include Audio Toggle */}
        <label
          className="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
        >
          <div>
            <span className="text-xs font-bold block">تضمين المقاطع الصوتية المرفوعة داخل النسخة</span>
            <span className="text-[11px] text-slate-500">
              {includeAudio ? 'يزيد حجم الملف لتضمين الملفات الصوتية' : 'ملف نصي خفيف وسريع جدًا (يوصى به)'}
            </span>
          </div>
          <input
            type="checkbox"
            checked={includeAudio}
            onChange={(e) => setIncludeAudio(e.target.checked)}
            className="w-4 h-4 rounded-md accent-blue-600 cursor-pointer"
          />
        </label>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 rounded-2xl text-xs font-bold text-white shadow-md transition cursor-pointer hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'جارٍ التصدير...' : 'تحميل النسخة الاحتياطية الآن'}</span>
        </button>
      </div>

      {/* Import Card */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">استعادة من ملف نسخة احتياطية</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              استرجع بياناتك المحفوظة مسبقًا بدقة وأمان
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-500/5 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>يقوم المرفأ تلقائيًا بحفظ لقطة سريعة لبياناتك الحالية قبل الاستعادة لمنع أي فقدان للبيانات.</span>
        </div>

        <label
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-bold text-white shadow-md transition cursor-pointer hover:opacity-90"
          style={{ backgroundColor: '#10b981' }}
        >
          <Upload className="w-4 h-4" />
          <span>{isImporting ? 'جارٍ التحقق والاستعادة...' : 'اختيار ملف النسخة الاحتياطية (JSON)'}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </label>
      </div>

      {/* Danger Zone: Reset All Data */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-3"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.04)',
          borderColor: 'rgba(239, 68, 68, 0.25)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">منطقة الأمان وإعادة التعيين</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          إذا أردت مسح جميع الجلسات والمواد وإعادة التطبيق إلى حالته الابتدائية كما في اليوم الأول:
        </p>

        <button
          onClick={() => {
            if (confirm('تحذير: هل أنت متأكد تمامًا من رغبتك في مسح كافة الجلسات والبيانات وإعادة الضبط؟ لا يمكن التراجع بعد ذلك.')) {
              onResetAllData();
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-rose-600 text-white shadow-xs transition hover:bg-rose-700 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة ضبط المصنع ومسح جميع البيانات</span>
        </button>
      </div>
    </div>
  );
};
