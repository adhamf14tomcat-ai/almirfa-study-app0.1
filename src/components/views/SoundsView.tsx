import React, { useState, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Upload,
  Trash2,
  Edit2,
  Check,
  CloudRain,
  Flame,
  Waves,
  Coffee,
  Radio,
  Music,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AMBIENT_SOUNDS } from '../../constants';
import { CustomSoundItem } from '../../types';
import { audioEngine } from '../../services/audio';

interface SoundsViewProps {
  customSounds: CustomSoundItem[];
  onAddCustomSound: (sound: { name: string; base64Data: string; sizeBytes: number }) => void;
  onUpdateCustomSoundName: (id: string, name: string) => void;
  onDeleteCustomSound: (id: string) => void;
}

export const SoundsView: React.FC<SoundsViewProps> = ({
  customSounds,
  onAddCustomSound,
  onUpdateCustomSoundName,
  onDeleteCustomSound,
}) => {
  const [playingAmbientId, setPlayingAmbientId] = useState<string | null>(null);
  const [playingPersonalId, setPlayingPersonalId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTestAmbient = (id: string) => {
    if (playingAmbientId === id) {
      audioEngine.stopAmbient();
      setPlayingAmbientId(null);
    } else {
      audioEngine.playAmbient(id, 0.7);
      setPlayingAmbientId(id);
    }
  };

  const toggleTestPersonal = (sound: CustomSoundItem) => {
    if (playingPersonalId === sound.id) {
      audioEngine.stopPersonalAudio();
      setPlayingPersonalId(null);
    } else if (sound.base64Data) {
      audioEngine.playPersonalAudio(sound.base64Data, 0.7);
      setPlayingPersonalId(sound.id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 30MB
    if (file.size > 30 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. يُفضل ألا يتجاوز الملف 30 ميجابايت لضمان سرعة التخزين المحلي.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      onAddCustomSound({
        name: cleanName,
        base64Data: base64,
        sizeBytes: file.size,
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const saveRename = (id: string) => {
    if (editName.trim()) {
      onUpdateCustomSoundName(id, editName.trim());
    }
    setEditingId(null);
  };

  const getAmbientIcon = (id: string) => {
    switch (id) {
      case 'rain': return <CloudRain className="w-5 h-5" />;
      case 'fireplace': return <Flame className="w-5 h-5" />;
      case 'waves': return <Waves className="w-5 h-5" />;
      case 'cafe': return <Coffee className="w-5 h-5" />;
      default: return <Radio className="w-5 h-5" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} كيلوبايت`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
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
          <span>مكتبة ومسارات الأصوات</span>
          <Volume2 className="w-6 h-6 text-sky-500" />
        </h2>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          إدارة المؤثرات الصوتية البيئية الطبيعية وملفاتك الصوتية الخاصة للعمل العميق
        </p>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-sky-600 dark:text-sky-400" />
        <span>
          <strong>خصوصية كاملة:</strong> جميع الملفات الصوتية التي ترفعها تُخزّن داخل قاعدة بيانات متصفحك (IndexedDB) محلياً فقط على هذا الجهاز، ولا تُرفع إطلاقاً لأي خوادم خارجية.
        </span>
      </div>

      {/* Track 1: Ambient Soundscapes (Synthesized Locally) */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <h3 className="text-base font-bold mb-1">الأصوات البيئية الطبيعية المدمجة</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          أصوات طبيعية تُولد بواسطة محرك صوتي داخلي بدون استهلاك للإنترنت
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {AMBIENT_SOUNDS.map((s) => {
            const isPlaying = playingAmbientId === s.id;

            return (
              <div
                key={s.id}
                className="p-4 rounded-2xl border flex items-center justify-between transition-all"
                style={{
                  backgroundColor: isPlaying ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-elevated)',
                  borderColor: isPlaying ? '#0284c7' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-sky-600 dark:text-sky-400">
                    {getAmbientIcon(s.id)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{s.name}</h4>
                    <span className="text-[10px] text-slate-500">توليد نغمي متصل</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleTestAmbient(s.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: isPlaying ? 'var(--primary-color)' : 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: isPlaying ? '#ffffff' : 'var(--text-primary)',
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>معاينة</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Track 2: Personal Upload Audio Tracks */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold">ملفاتك الصوتية الشخصية</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ارفع تلاوات، بودكاست، أو مقاطع تركيز خاصة بك (MP3 أو WAV)
            </p>
          </div>

          <label
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition cursor-pointer hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Upload className="w-4 h-4" />
            <span>رفع ملف صوتي</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mp3,audio/wav,audio/mpeg,audio/ogg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {customSounds.length > 0 ? (
          <div className="space-y-3">
            {customSounds.map((sound) => {
              const isPlaying = playingPersonalId === sound.id;
              const isRenaming = editingId === sound.id;

              return (
                <div
                  key={sound.id}
                  className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: isPlaying ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-elevated)',
                    borderColor: isPlaying ? '#10b981' : 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Music className="w-4 h-4" />
                    </div>

                    {isRenaming ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg border bg-transparent font-medium"
                          style={{ borderColor: 'var(--border-color)' }}
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(sound.id)}
                          className="p-1 rounded-md bg-emerald-600 text-white cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate">{sound.name}</h4>
                        <span className="text-[10px] text-slate-500">{formatSize(sound.sizeBytes || sound.size || 0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTestPersonal(sound)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: isPlaying ? '#10b981' : 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: isPlaying ? '#ffffff' : 'var(--text-primary)',
                      }}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-white" />
                          <span>إيقاف</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>تشغيل</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(sound.id);
                        setEditName(sound.name);
                      }}
                      className="p-1.5 rounded-xl border transition hover:opacity-80"
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                      title="إعادة تسمية"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`هل تريد حذف المقطع الصوتي «${sound.name}»؟`)) {
                          onDeleteCustomSound(sound.id);
                        }
                      }}
                      className="p-1.5 rounded-xl border text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      style={{ borderColor: 'var(--border-color)' }}
                      title="حذف المقطع"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="p-8 rounded-2xl border text-center space-y-2"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
          >
            <Music className="w-7 h-7 mx-auto opacity-30" />
            <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              لم تقم برفع أي ملفات صوتية بعد
            </p>
            <p className="text-[11px] text-slate-500">
              اضغط على زر «رفع ملف صوتي» بالأعلى لإضافة مقاطعك الخاصة لمرافقة جلساتك.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
