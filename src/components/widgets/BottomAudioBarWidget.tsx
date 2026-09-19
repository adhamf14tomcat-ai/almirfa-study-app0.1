import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Flame,
  Waves,
  Coffee,
  Radio,
  Music,
  ChevronUp,
  ChevronDown,
  Target,
} from 'lucide-react';
import { AMBIENT_SOUNDS } from '../../constants';
import { CustomSoundItem, DailyGoalStatus } from '../../types';
import { audioEngine } from '../../services/audio';

interface BottomAudioBarWidgetProps {
  ambientVolume: number;
  personalVolume: number;
  onUpdateVolume: (type: 'ambient' | 'personal', vol: number) => void;
  customSounds: CustomSoundItem[];
  dailyGoals: DailyGoalStatus;
  onOpenSoundLibrary: () => void;
}

export const BottomAudioBarWidget: React.FC<BottomAudioBarWidgetProps> = ({
  ambientVolume,
  personalVolume,
  onUpdateVolume,
  customSounds,
  dailyGoals,
  onOpenSoundLibrary,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Track 1: Ambient Sound
  const [selectedAmbient, setSelectedAmbient] = useState<string>('rain');
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);

  // Track 2: Personal Sound
  const [selectedPersonalId, setSelectedPersonalId] = useState<string>(
    customSounds[0]?.id || ''
  );
  const [isPersonalPlaying, setIsPersonalPlaying] = useState<boolean>(false);

  const toggleAmbient = () => {
    if (isAmbientPlaying) {
      audioEngine.stopAmbient();
      setIsAmbientPlaying(false);
    } else {
      audioEngine.playAmbient(selectedAmbient, ambientVolume);
      setIsAmbientPlaying(true);
    }
  };

  const handleAmbientChange = (type: string) => {
    setSelectedAmbient(type);
    if (isAmbientPlaying) {
      audioEngine.playAmbient(type, ambientVolume);
    }
  };

  const handleAmbientVolume = (vol: number) => {
    onUpdateVolume('ambient', vol);
    audioEngine.setAmbientVolume(vol);
  };

  const togglePersonal = () => {
    if (isPersonalPlaying) {
      audioEngine.stopPersonalAudio();
      setIsPersonalPlaying(false);
    } else {
      const sound = customSounds.find((s) => s.id === selectedPersonalId);
      if (sound && sound.base64Data) {
        audioEngine.playPersonalAudio(sound.base64Data, personalVolume);
        setIsPersonalPlaying(true);
      } else {
        onOpenSoundLibrary();
      }
    }
  };

  const handlePersonalChange = (id: string) => {
    setSelectedPersonalId(id);
    if (isPersonalPlaying) {
      const sound = customSounds.find((s) => s.id === id);
      if (sound && sound.base64Data) {
        audioEngine.playPersonalAudio(sound.base64Data, personalVolume);
      }
    }
  };

  const handlePersonalVolume = (vol: number) => {
    onUpdateVolume('personal', vol);
    audioEngine.setPersonalVolume(vol);
  };

  const target = Math.max(1, dailyGoals.targetMinutes);
  const completed = dailyGoals.completedMinutes;
  const percentage = Math.min(100, Math.round((completed / target) * 100));

  const getAmbientIcon = (id: string) => {
    switch (id) {
      case 'rain': return <CloudRain className="w-4 h-4" />;
      case 'fireplace': return <Flame className="w-4 h-4" />;
      case 'waves': return <Waves className="w-4 h-4" />;
      case 'cafe': return <Coffee className="w-4 h-4" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <div
      id="bottom-audio-bar-widget"
      className="w-full rounded-2xl border shadow-md transition-all duration-300 text-right overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Daily Progress strip at the very top of bar */}
      <div className="px-4 py-2 bg-slate-500/5 flex items-center justify-between border-b text-[11px]" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-sky-500" />
          <span className="font-semibold">
            هدف اليوم: {completed} / {target} دقيقة ({percentage}%)
          </span>
        </div>
        <div className="w-28 sm:w-44 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%`, backgroundColor: 'var(--primary-color)' }}
          />
        </div>
      </div>

      {/* Main Bar Controls */}
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Track 1: Ambient Track */}
        <div className="flex-1 flex items-center justify-between sm:justify-start gap-3">
          <button
            id="ambient-play-toggle"
            onClick={toggleAmbient}
            title={isAmbientPlaying ? 'إيقاف الصوت البيئي' : 'تشغيل الصوت البيئي'}
            aria-label="تبديل تشغيل الصوت البيئي"
            className="p-2.5 rounded-xl border transition cursor-pointer flex-shrink-0"
            style={{
              backgroundColor: isAmbientPlaying ? 'var(--primary-color)' : 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: isAmbientPlaying ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            {isAmbientPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <div className="flex-1 min-w-[120px] max-w-[200px]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold flex items-center gap-1">
                {getAmbientIcon(selectedAmbient)}
                <span>صوت بيئي</span>
              </span>
              <span className="opacity-70">{Math.round(ambientVolume * 100)}%</span>
            </div>
            <select
              value={selectedAmbient}
              onChange={(e) => handleAmbientChange(e.target.value)}
              className="w-full text-xs p-1 rounded-lg border bg-transparent font-medium cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              {AMBIENT_SOUNDS.map((s) => (
                <option key={s.id} value={s.id} style={{ backgroundColor: 'var(--bg-card)' }}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 min-w-[90px]">
            <Volume2 className="w-3.5 h-3.5 opacity-60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientVolume}
              onChange={(e) => handleAmbientVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 accent-blue-600 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Divider on desktop */}
        <div className="hidden md:block w-px h-8 bg-slate-300 dark:bg-slate-700" />

        {/* Track 2: Personal Upload Track */}
        <div className="flex-1 flex items-center justify-between sm:justify-start gap-3">
          <button
            id="personal-play-toggle"
            onClick={togglePersonal}
            title={isPersonalPlaying ? 'إيقاف الصوت الشخصي' : 'تشغيل الصوت الشخصي'}
            aria-label="تبديل تشغيل الصوت الشخصي"
            className="p-2.5 rounded-xl border transition cursor-pointer flex-shrink-0"
            style={{
              backgroundColor: isPersonalPlaying ? '#10b981' : 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: isPersonalPlaying ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            {isPersonalPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Music className="w-4 h-4" />}
          </button>

          <div className="flex-1 min-w-[120px] max-w-[200px]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold flex items-center gap-1">
                <span>صوت شخصي</span>
              </span>
              <span className="opacity-70">{Math.round(personalVolume * 100)}%</span>
            </div>

            {customSounds.length > 0 ? (
              <select
                value={selectedPersonalId}
                onChange={(e) => handlePersonalChange(e.target.value)}
                className="w-full text-xs p-1 rounded-lg border bg-transparent font-medium cursor-pointer truncate"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                {customSounds.map((s) => (
                  <option key={s.id} value={s.id} style={{ backgroundColor: 'var(--bg-card)' }}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={onOpenSoundLibrary}
                className="text-[11px] text-blue-600 dark:text-blue-400 underline font-medium cursor-pointer"
              >
                + رفع ملف MP3/WAV
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 min-w-[90px]">
            <Volume2 className="w-3.5 h-3.5 opacity-60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={personalVolume}
              onChange={(e) => handlePersonalVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 accent-emerald-600 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
