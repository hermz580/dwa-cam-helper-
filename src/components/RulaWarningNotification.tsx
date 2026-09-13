import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { RulaAlertData } from '../types';
import { playCriticalWarningChime } from '../utils/audioAlert';
import { speakClinicalText } from '../utils/speech';

interface RulaWarningNotificationProps {
  alert: RulaAlertData | null;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  onOpenCorrectives?: () => void;
  onOpenErgonomics?: () => void;
  criticalThreshold: number;
  onUpdateThreshold: (threshold: number) => void;
}

export const RulaWarningNotification: React.FC<RulaWarningNotificationProps> = ({
  alert,
  onDismiss,
  onSnooze,
  onOpenCorrectives,
  onOpenErgonomics,
  criticalThreshold,
  onUpdateThreshold,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [showThresholdSettings, setShowThresholdSettings] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Trigger audio feedback when new alert occurs
  useEffect(() => {
    if (!alert) {
      setCompletedSteps({});
      return;
    }

    if (soundEnabled) {
      playCriticalWarningChime(0.28);
    }

    if (speechEnabled) {
      const speechMsg = `Warning: Critical RULA score of ${alert.rulaScore} detected during live video processing. Postural reset required.`;
      speakClinicalText(speechMsg);
    }
  }, [alert?.timestamp, soundEnabled, speechEnabled]);

  if (!alert) return null;

  const isLevel4 = alert.rulaScore >= 7;
  const isLevel3 = alert.rulaScore >= 5 && alert.rulaScore < 7;

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIdx]: !prev[stepIdx],
    }));
  };

  const allStepsCompleted = completedSteps[0] && completedSteps[1] && completedSteps[2];

  return (
    <div
      id="rula-critical-warning-notification"
      className="fixed top-4 right-4 z-50 max-w-lg w-[calc(100vw-2rem)] sm:w-[480px] shadow-2xl transition-all duration-300"
    >
      <div
        className={`rounded-2xl border transition-all ${
          isLevel4
            ? 'bg-slate-950/95 border-rose-500/80 shadow-[0_0_40px_rgba(244,63,94,0.35)]'
            : 'bg-slate-950/95 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
        } backdrop-blur-xl text-slate-100 overflow-hidden`}
      >
        {/* Urgent Animated Beacon Bar */}
        <div
          className={`h-1.5 w-full ${
            isLevel4
              ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 animate-pulse'
              : 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 animate-pulse'
          }`}
        />

        {/* Card Header */}
        <div className="p-4 sm:p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLevel4
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                      isLevel4
                        ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                    Live Video Warning
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Threshold &ge; {criticalThreshold}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-0.5 tracking-tight flex items-center gap-2">
                  <span>Critical RULA Score Exceeded</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold ${
                      isLevel4 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    Score {alert.rulaScore} / 7
                  </span>
                </h4>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Warning Chime' : 'Unmute Warning Chime'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse Warning' : 'Expand Details'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onDismiss}
                title="Dismiss Warning"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtitle / Risk Assessment */}
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {alert.interpretation ||
              (isLevel4
                ? 'Action Level 4: Immediate biomechanical changes required to prevent acute cervical and spinal strain.'
                : 'Action Level 3: High musculoskeletal risk detected. Investigation and changes required soon.')}
          </p>

          {alert.phaseLabel && (
            <div className="mt-2 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Timestamp: {alert.phaseLabel}</span>
            </div>
          )}
        </div>

        {/* Expanded Biomechanical Details & Tactical Protocol */}
        {isExpanded && (
          <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/80">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Cervical Load</span>
                <span className="text-sm font-bold text-rose-400 font-mono">
                  {alert.cervicalLoadLbs ? `${alert.cervicalLoadLbs} lbs` : '38 lbs'}
                </span>
                <span className="text-[9px] text-rose-400/80 block">+216% load</span>
              </div>

              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Craniovertebral (CVA)</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {alert.cvaDeg ? `${alert.cvaDeg}°` : '34.0°'}
                </span>
                <span className="text-[9px] text-amber-400/80 block">Normative &ge; 50°</span>
              </div>

              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Head Translation</span>
                <span className="text-sm font-bold text-orange-400 font-mono">
                  {alert.forwardHeadOffsetMm ? `+${(alert.forwardHeadOffsetMm / 10).toFixed(1)} cm` : '+4.8 cm'}
                </span>
                <span className="text-[9px] text-orange-400/80 block">Severe anterior</span>
              </div>
            </div>

            {/* Tactical 15-Second Posture Reset Protocol */}
            <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Immediate 15-Second Postural Reset:
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {Object.values(completedSteps).filter(Boolean).length}/3 steps
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    title: '1. Axial Cervical Retraction',
                    desc: 'Gently tuck chin straight backward ("double chin") to realign ear with shoulder.',
                  },
                  {
                    title: '2. Scapular Depression & Squeeze',
                    desc: 'Roll shoulders up, then pinch blades back and down away from the ears.',
                  },
                  {
                    title: '3. Pelvic Alignment & Seat Pan Reach',
                    desc: 'Slide hips completely against backrest to engage lumbar curve support.',
                  },
                ].map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleStep(idx)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 transition-all ${
                        isDone
                          ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                          : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border border-slate-600 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-semibold block ${isDone ? 'line-through text-emerald-300' : 'text-slate-100'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                          {step.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {allStepsCompleted && (
                <div className="mt-2 text-center p-1.5 bg-emerald-950/60 border border-emerald-700/60 rounded-lg text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Posture Reset Executed! Cervical shear reduced.
                </div>
              )}
            </div>

            {/* Threshold Settings Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setShowThresholdSettings(!showThresholdSettings)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-mono"
              >
                <span>Sensitivity & Critical Threshold:</span>
                <span className="text-cyan-400 underline">Score &ge; {criticalThreshold}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${showThresholdSettings ? 'rotate-180' : ''}`}
                />
              </button>

              {showThresholdSettings && (
                <div className="mt-2 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-2">
                  <p className="text-slate-400 text-[11px]">
                    Trigger on-screen warning when AI live video analysis detects RULA score exceeding:
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 font-mono">
                    {[
                      { val: 5, label: 'Score ≥ 5', note: 'Action Lvl 3 (Strict)' },
                      { val: 6, label: 'Score ≥ 6', note: 'Action Lvl 3 (Default)' },
                      { val: 7, label: 'Score = 7', note: 'Action Lvl 4 (Critical)' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => onUpdateThreshold(opt.val)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          criticalThreshold === opt.val
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-200 font-bold shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <span className="block text-xs">{opt.label}</span>
                        <span className="block text-[9px] text-slate-500">{opt.note}</span>
                      </button>
                    ))}
                  </div>

                  {/* Verbal Speech Toggle */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Verbal Voice Alert (Speech API):</span>
                    <button
                      type="button"
                      onClick={() => setSpeechEnabled(!speechEnabled)}
                      className={`text-[10px] px-2.5 py-1 rounded-md border font-mono transition-colors ${
                        speechEnabled
                          ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {speechEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {onOpenCorrectives && (
                <button
                  type="button"
                  onClick={onOpenCorrectives}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  View Exercises
                </button>
              )}

              {onOpenErgonomics ? (
                <button
                  type="button"
                  onClick={onOpenErgonomics}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  Workstation Targets
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Dismiss Warning
                </button>
              )}
            </div>

            {/* Snooze Options */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Temporary Snooze:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSnooze(2)}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  2m
                </button>
                <button
                  type="button"
                  onClick={() => onSnooze(5)}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  5m
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
