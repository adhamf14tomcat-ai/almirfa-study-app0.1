import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Sliders,
  ShieldAlert,
  Flame,
  Coffee,
  CheckCircle2,
  Bell,
  X,
  Sparkles,
} from 'lucide-react';
import { AppSettings, TimerMode, StudySession, SubjectItem } from '../../types';
import { STRICT_RETURN_MESSAGE } from '../../constants';
import { audioEngine } from '../../services/audio';

interface FocusTimerWidgetProps {
  settings: AppSettings;
  activeSubject: SubjectItem;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onSessionComplete: (sessionData: {
    durationMinutes: number;
    mode: TimerMode;
    interruptionsCount: number;
  }) => void;
}

type PomodoroPhase = 'focus' | 'short-break' | 'long-break';

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({
  settings,
  activeSubject,
  onUpdateSettings,
  onSessionComplete,
}) => {
  // Timer mode: 'pomodoro' | 'stopwatch'
  const mode = settings.timerMode;

  // Running status
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Pomodoro phase & cycle
  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [currentCycle, setCurrentCycle] = useState(1);

  // High precision timestamp tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pomodoroTargetSeconds, setPomodoroTargetSeconds] = useState(settings.focusMinutes * 60);

  // Strict mode & Interruption tracking
  const [interruptionsCount, setInterruptionsCount] = useState(0);
  const [strictNotice, setStrictNotice] = useState<string | null>(null);

  // Advanced settings modal state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [tempHours, setTempHours] = useState(Math.floor(settings.focusMinutes / 60));
  const [tempMinutes, setTempMinutes] = useState(settings.focusMinutes % 60);
  const [tempSeconds, setTempSeconds] = useState(0);
  const [tempShortBreak, setTempShortBreak] = useState(settings.shortBreakMinutes);
  const [tempLongBreak, setTempLongBreak] = useState(settings.longBreakMinutes);
  const [tempLoops, setTempLoops] = useState(settings.loops);
  const [tempStrictMode, setTempStrictMode] = useState(settings.strictMode);
  const [tempAutoStartBreak, setTempAutoStartBreak] = useState(settings.autoStartBreak);
  const [tempAutoStartFocus, setTempAutoStartFocus] = useState(settings.autoStartFocus);

  // References for drift-free timer
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Update target seconds when settings change if not running
  useEffect(() => {
    if (!isRunning && !isPaused) {
      if (phase === 'focus') {
        setPomodoroTargetSeconds(settings.focusMinutes * 60);
      } else if (phase === 'short-break') {
        setPomodoroTargetSeconds(settings.shortBreakMinutes * 60);
      } else {
        setPomodoroTargetSeconds(settings.longBreakMinutes * 60);
      }
    }
  }, [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes, phase, isRunning, isPaused]);

  // Strict Mode with Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isRunning && settings.strictMode && phase === 'focus') {
          // Pause timer, do not count away time, record interruption
          pauseTimer();
          setInterruptionsCount((prev) => prev + 1);
        }
      } else {
        // Returned to app
        if (settings.strictMode && interruptionsCount > 0) {
          setStrictNotice(STRICT_RETURN_MESSAGE);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, settings.strictMode, phase, interruptionsCount]);

  // Main high-precision animation timer loop
  useEffect(() => {
    if (isRunning) {
      const updateClock = () => {
        if (startTimeRef.current !== null) {
          const now = Date.now();
          const currentElapsed = Math.floor((now - startTimeRef.current + accumulatedTimeRef.current) / 1000);
          setElapsedSeconds(currentElapsed);

          // Check Pomodoro completion
          if (mode === 'pomodoro' && currentElapsed >= pomodoroTargetSeconds) {
            handlePhaseCompleted();
            return;
          }
        }
        animationFrameRef.current = requestAnimationFrame(updateClock);
      };

      animationFrameRef.current = requestAnimationFrame(updateClock);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, mode, pomodoroTargetSeconds]);

  // Phase completion handler for Pomodoro
  const handlePhaseCompleted = () => {
    setIsRunning(false);
    setIsPaused(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;

    if (settings.soundEnabled) {
      audioEngine.playCompletionChime();
    }

    if (phase === 'focus') {
      const completedMinutes = Math.max(1, Math.round(pomodoroTargetSeconds / 60));
      onSessionComplete({
        durationMinutes: completedMinutes,
        mode: 'pomodoro',
        interruptionsCount,
      });

      // Next phase determination
      if (currentCycle >= settings.loops) {
        setPhase('long-break');
        setPomodoroTargetSeconds(settings.longBreakMinutes * 60);
        setCurrentCycle(1);
      } else {
        setPhase('short-break');
        setPomodoroTargetSeconds(settings.shortBreakMinutes * 60);
        setCurrentCycle((c) => c + 1);
      }

      setElapsedSeconds(0);
      setInterruptionsCount(0);

      if (settings.autoStartBreak) {
        setTimeout(() => startTimer(), 600);
      }
    } else {
      // Break finished
      setPhase('focus');
      setPomodoroTargetSeconds(settings.focusMinutes * 60);
      setElapsedSeconds(0);

      if (settings.autoStartFocus) {
        setTimeout(() => startTimer(), 600);
      }
    }
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    if (startTimeRef.current !== null) {
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(true);
  };

  const resumeTimer = () => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    setElapsedSeconds(0);
    setInterruptionsCount(0);
    if (phase === 'focus') {
      setPomodoroTargetSeconds(settings.focusMinutes * 60);
    } else if (phase === 'short-break') {
      setPomodoroTargetSeconds(settings.shortBreakMinutes * 60);
    } else {
      setPomodoroTargetSeconds(settings.longBreakMinutes * 60);
    }
  };

  const endSessionEarly = () => {
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    setIsRunning(false);
    setIsPaused(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;

    if (elapsedSeconds >= 60) {
      onSessionComplete({
        durationMinutes: minutes,
        mode,
        interruptionsCount,
      });
    }

    setElapsedSeconds(0);
    setInterruptionsCount(0);
  };

  // Quick preset selection
  const handleQuickPreset = (minutes: number) => {
    if (isRunning || isPaused) return;
    onUpdateSettings({ focusMinutes: minutes });
    setPomodoroTargetSeconds(minutes * 60);
  };

  // Time formatting helpers
  const getDisplaySeconds = () => {
    if (mode === 'pomodoro') {
      const remaining = Math.max(0, pomodoroTargetSeconds - elapsedSeconds);
      return remaining;
    }
    return elapsedSeconds;
  };

  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Visual calming glow calculation:
  // Increases gradually with uninterrupted elapsed focus time
  const calculateGlowStrength = () => {
    if (!isRunning || phase !== 'focus') return 0.08;
    const focusRatio = Math.min(1, elapsedSeconds / (25 * 60)); // maxes out around 25 min of focus
    return 0.15 + focusRatio * 0.45; // 0.15 to 0.6
  };

  const glowStrength = calculateGlowStrength();

  // Progress percentage for circular ring
  const calculateProgress = () => {
    if (mode === 'pomodoro') {
      if (pomodoroTargetSeconds <= 0) return 0;
      return Math.min(1, elapsedSeconds / pomodoroTargetSeconds);
    }
    // For stopwatch, cycle every 60 minutes
    return (elapsedSeconds % 3600) / 3600;
  };

  const progress = calculateProgress();
  const radius = 125;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const saveAdvancedSettings = () => {
    const totalMinutes = tempHours * 60 + tempMinutes + (tempSeconds > 0 ? 1 : 0);
    const validMinutes = Math.max(1, totalMinutes);

    onUpdateSettings({
      focusMinutes: validMinutes,
      shortBreakMinutes: tempShortBreak,
      longBreakMinutes: tempLongBreak,
      loops: tempLoops,
      strictMode: tempStrictMode,
      autoStartBreak: tempAutoStartBreak,
      autoStartFocus: tempAutoStartFocus,
    });

    if (phase === 'focus') {
      setPomodoroTargetSeconds(validMinutes * 60);
    }
    setShowAdvancedSettings(false);
  };

  return (
    <div
      id="focus-timer-widget"
      className="w-full flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border shadow-xs transition-all duration-300 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Strict Mode Alert Banner */}
      {strictNotice && (
        <div className="w-full mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{strictNotice}</span>
          </div>
          <button
            onClick={() => setStrictNotice(null)}
            className="p-1 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-900/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mode Selector & Status Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Mode Toggle (Pomodoro vs Stopwatch) */}
        <div
          className="flex items-center p-1 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={() => {
              if (!isRunning) onUpdateSettings({ timerMode: 'pomodoro' });
            }}
            disabled={isRunning}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              mode === 'pomodoro'
                ? 'shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={
              mode === 'pomodoro'
                ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' }
                : { color: 'var(--text-secondary)' }
            }
          >
            مؤقت بومودورو
          </button>
          <button
            onClick={() => {
              if (!isRunning) onUpdateSettings({ timerMode: 'stopwatch' });
            }}
            disabled={isRunning}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              mode === 'stopwatch'
                ? 'shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={
              mode === 'stopwatch'
                ? { backgroundColor: 'var(--primary-color)', color: '#ffffff' }
                : { color: 'var(--text-secondary)' }
            }
          >
            عداد تصاعدي (Stopwatch)
          </button>
        </div>

        {/* Phase / Cycle Info & Strict mode indicator */}
        <div className="flex items-center gap-2 text-xs">
          {settings.strictMode && (
            <span
              title="الوضع الصارم مفعّل: إيقاف تلقائي عند مغادرة التبويب"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>الوضع الصارم</span>
            </span>
          )}

          {mode === 'pomodoro' && (
            <span
              className="px-2.5 py-1 rounded-xl font-medium border"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              الدورة {currentCycle} من {settings.loops}
            </span>
          )}

          <button
            onClick={() => setShowAdvancedSettings(true)}
            title="إعدادات المؤقت المتقدمة"
            className="p-1.5 rounded-xl border transition cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Circular Timer Display with Dynamic Calming Glow */}
      <div className="relative flex items-center justify-center my-4 select-none">
        {/* Calming glow ring that increases with uninterrupted focus */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000 pointer-events-none"
          style={{
            transform: 'scale(1.15)',
            boxShadow: `0 0 ${40 + glowStrength * 60}px ${10 + glowStrength * 30}px var(--glow-color)`,
            opacity: glowStrength,
          }}
        />

        {/* SVG Progress Circle */}
        <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform" viewBox="0 0 300 300">
          {/* Background circle track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="var(--border-color)"
            strokeWidth="10"
            strokeOpacity="0.4"
          />

          {/* Animated active stroke */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="var(--primary-color)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Center Text Block */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full mb-1 uppercase tracking-wider"
            style={{
              backgroundColor:
                phase === 'focus'
                  ? 'rgba(2, 132, 199, 0.12)'
                  : 'rgba(16, 185, 129, 0.12)',
              color: phase === 'focus' ? 'var(--primary-color)' : '#10b981',
            }}
          >
            {mode === 'stopwatch'
              ? 'جلسة حرة تصاعدية'
              : phase === 'focus'
              ? 'جلسة تركيز'
              : phase === 'short-break'
              ? 'استراحة قصيرة'
              : 'استراحة طويلة'}
          </span>

          {/* Time Digits */}
          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight font-mono py-1" style={{ color: 'var(--text-primary)' }}>
            {formatTime(getDisplaySeconds())}
          </div>

          {/* Subject tag under digits */}
          <div className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: activeSubject.color }}
            />
            <span className="font-medium">{activeSubject.name}</span>
          </div>

          {/* Interruptions indicator */}
          {interruptionsCount > 0 && (
            <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              {interruptionsCount} انقطاع مسجل
            </div>
          )}
        </div>
      </div>

      {/* Quick Pomodoro Presets (30m, 45m, 50m, 60m) */}
      {mode === 'pomodoro' && !isRunning && !isPaused && (
        <div className="flex items-center gap-2 my-2 select-none">
          {[30, 45, 50, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleQuickPreset(mins)}
              className={`px-3 py-1 text-xs rounded-xl border transition cursor-pointer font-medium ${
                settings.focusMinutes === mins
                  ? 'font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: settings.focusMinutes === mins ? 'var(--bg-elevated)' : 'transparent',
                borderColor: settings.focusMinutes === mins ? 'var(--primary-color)' : 'var(--border-color)',
                color: settings.focusMinutes === mins ? 'var(--primary-color)' : 'var(--text-secondary)',
              }}
            >
              {mins} د
            </button>
          ))}
        </div>
      )}

      {/* Action Control Buttons (Start, Pause, Resume, End, Reset) */}
      <div className="flex items-center gap-3 mt-4">
        {!isRunning && !isPaused && (
          <button
            id="timer-start-btn"
            onClick={startTimer}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl text-base font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Play className="w-5 h-5 fill-white" />
            <span>ابدأ الجلسة</span>
          </button>
        )}

        {isRunning && (
          <button
            id="timer-pause-btn"
            onClick={pauseTimer}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-base font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ backgroundColor: '#e11d48' }}
          >
            <Pause className="w-5 h-5 fill-white" />
            <span>إيقاف مؤقت</span>
          </button>
        )}

        {isPaused && (
          <button
            id="timer-resume-btn"
            onClick={resumeTimer}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-base font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Play className="w-5 h-5 fill-white" />
            <span>استئناف</span>
          </button>
        )}

        {/* End early / finish button */}
        {(isRunning || isPaused || elapsedSeconds > 0) && (
          <button
            id="timer-finish-btn"
            onClick={endSessionEarly}
            title="إنهاء وحفظ الجلسة الآن"
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border text-sm font-semibold transition cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <Square className="w-4 h-4" />
            <span>إنهاء الجلسة</span>
          </button>
        )}

        {/* Reset button */}
        {(isPaused || elapsedSeconds > 0) && (
          <button
            id="timer-reset-btn"
            onClick={resetTimer}
            title="إعادة ضبط المؤقت"
            className="p-3 rounded-2xl border transition cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Advanced Settings Modal */}
      {showAdvancedSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-3xl p-6 shadow-2xl border transition-all text-right max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => setShowAdvancedSettings(false)}
                className="p-1.5 rounded-lg border transition hover:opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-lg">إعدادات المؤقت المتقدمة</h3>
            </div>

            <div className="mt-5 space-y-5">
              {/* Duration: Hours, Minutes, Seconds */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  مدة جلسة التركيز (ساعات / دقائق / ثوانٍ)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">الساعات</span>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={tempHours}
                      onChange={(e) => setTempHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 rounded-xl border text-center font-mono font-bold"
                      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">الدقائق</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={tempMinutes}
                      onChange={(e) => setTempMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 rounded-xl border text-center font-mono font-bold"
                      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">الثواني</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={tempSeconds}
                      onChange={(e) => setTempSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2.5 rounded-xl border text-center font-mono font-bold"
                      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Short & Long Break Durations (5 to 15 min) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    الاستراحة القصيرة (5 إلى 15 دقيقة)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    value={tempShortBreak}
                    onChange={(e) => setTempShortBreak(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-xs font-bold block text-center mt-1">{tempShortBreak} دقائق</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    الاستراحة الطويلة (15 إلى 35 دقيقة)
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="35"
                    value={tempLongBreak}
                    onChange={(e) => setTempLongBreak(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-xs font-bold block text-center mt-1">{tempLongBreak} دقيقة</span>
                </div>
              </div>

              {/* Loop cycles */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  عدد دورات التركيز قبل الاستراحة الطويلة
                </label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTempLoops(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        tempLoops === num ? 'border-blue-600 bg-blue-500/10 text-blue-600' : ''
                      }`}
                      style={{ borderColor: tempLoops === num ? 'var(--primary-color)' : 'var(--border-color)' }}
                    >
                      {num} دورات
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles: Strict mode, Auto start break, Auto start focus */}
              <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-xs font-bold block">الوضع الصارم (Strict Mode)</span>
                      <span className="text-[10px] text-slate-500">إيقاف المؤقت فورًا وتسجيل انقطاع إذا غادرت التطبيق</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempStrictMode}
                    onChange={(e) => setTempStrictMode(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-blue-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-xs font-bold block">بدء الاستراحة تلقائيًا</span>
                      <span className="text-[10px] text-slate-500">الانتقال التلقائي للاستراحة عند اكتمال الجلسة</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempAutoStartBreak}
                    onChange={(e) => setTempAutoStartBreak(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-blue-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-xs font-bold block">بدء الجلسة التالية تلقائيًا</span>
                      <span className="text-[10px] text-slate-500">بدء جلسة التركيز الجديدة تلقائيًا فور انتهاء الاستراحة</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempAutoStartFocus}
                    onChange={(e) => setTempAutoStartFocus(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-blue-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowAdvancedSettings(false)}
                className="px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={saveAdvancedSettings}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
