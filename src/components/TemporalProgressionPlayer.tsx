import React, { useState, useEffect, useRef } from 'react';
import {
  TemporalProgression,
  VideoSessionFrame,
  UserHeightProfile,
  AnthropometricErgonomics,
  RulaAlertData,
} from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Clock,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Ruler,
  Sliders,
  ChevronRight,
  Split,
  Eye,
  Activity,
  BellRing,
} from 'lucide-react';

interface TemporalProgressionPlayerProps {
  progression: TemporalProgression;
  heightProfile?: UserHeightProfile;
  anthropometrics?: AnthropometricErgonomics;
  onOpenHeightModal?: () => void;
  onRulaAlert?: (alert: RulaAlertData) => void;
  criticalThreshold?: number;
  className?: string;
}

export const TemporalProgressionPlayer: React.FC<TemporalProgressionPlayerProps> = ({
  progression,
  heightProfile,
  anthropometrics,
  onOpenHeightModal,
  onRulaAlert,
  criticalThreshold = 6,
  className = '',
}) => {
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [compareWithBaseline, setCompareWithBaseline] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const frames = progression.frames || [];
  const currentFrame = frames[selectedFrameIndex] || frames[0];
  const baselineFrame = frames[0] || currentFrame;

  // Auto-advance loop when playing
  useEffect(() => {
    if (isPlaying && frames.length > 1) {
      playTimerRef.current = setInterval(() => {
        setSelectedFrameIndex((prev) => (prev + 1) % frames.length);
      }, 1400 / playbackSpeed);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, frames.length]);

  if (!frames || frames.length === 0) {
    return null;
  }

  // Calculate delta against baseline (Frame 0)
  const cvaDelta = (currentFrame.cvaDeg - baselineFrame.cvaDeg).toFixed(1);
  const loadDelta = currentFrame.cervicalLoadLbs - baselineFrame.cervicalLoadLbs;
  const forwardOffsetCm = ((currentFrame.forwardHeadOffsetMm || 0) / 10).toFixed(1);

  return (
    <div
      id="temporal-progression-player"
      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl ${className}`}
    >
      {/* Top Banner: Video Evolution & Coder Ergonomics Context */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Video Coding Session Progression</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected {frames.length} Keyframes
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tracking postural degradation & fatigue drift over a {progression.totalDurationSeconds}s coding sprint
            </p>
          </div>
        </div>

        {/* Height & Workstation Calibration Trigger */}
        <div className="flex items-center gap-2">
          {heightProfile && (
            <button
              id="open-height-calibration-btn"
              onClick={onOpenHeightModal}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
              title="Calibrate user height and workstation measurements"
            >
              <Ruler className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Height: <strong className="text-white">{heightProfile.heightFeet}'{heightProfile.heightInches}"</strong> ({heightProfile.heightCm} cm)
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <span className="text-slate-400 capitalize">{heightProfile.workstationType.replace('_', ' ')}</span>
            </button>
          )}

          <button
            id="toggle-compare-baseline-btn"
            onClick={() => setCompareWithBaseline(!compareWithBaseline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              compareWithBaseline
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            {compareWithBaseline ? 'Comparing vs T=0s' : 'Compare to Start'}
          </button>
        </div>
      </div>

      {/* Main Progression Stage: Video Frame Viewport */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas Frame Viewer */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[16/10] flex items-center justify-center">
            {compareWithBaseline && selectedFrameIndex !== 0 ? (
              /* Split Comparison View: Frame 0 vs Active Frame */
              <div className="w-full h-full grid grid-cols-2 divide-x divide-slate-800">
                <div className="relative flex flex-col items-center justify-center p-2 bg-slate-950">
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    T=0.0s (Baseline)
                  </div>
                  <img
                    src={baselineFrame.imageBase64}
                    alt="Baseline Posture"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 inset-x-2 text-center text-[11px] text-slate-400 bg-slate-900/80 rounded py-0.5">
                    CVA: <strong className="text-emerald-400">{baselineFrame.cvaDeg}°</strong> • Load: <strong>{baselineFrame.cervicalLoadLbs} lbs</strong>
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-center p-2 bg-slate-950">
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800">
                    T={currentFrame.timestampSec.toFixed(1)}s (Slump)
                  </div>
                  <img
                    src={currentFrame.imageBase64}
                    alt="Current Frame"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 inset-x-2 text-center text-[11px] text-slate-400 bg-slate-900/80 rounded py-0.5">
                    CVA: <strong className="text-rose-400">{currentFrame.cvaDeg}°</strong> • Load: <strong className="text-amber-400">{currentFrame.cervicalLoadLbs} lbs</strong>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Frame Active View with HUD metrics overlay */
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentFrame.imageBase64}
                  alt={currentFrame.phaseLabel}
                  className="w-full h-full object-contain"
                />

                {/* HUD Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900/90 text-white border border-slate-700 shadow-lg">
                    {currentFrame.phaseLabel}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      currentFrame.slumpIndexScore > 60
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : currentFrame.slumpIndexScore > 25
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    Slump Index: {currentFrame.slumpIndexScore}%
                  </span>
                  {currentFrame.rulaScore !== undefined && (
                    <button
                      type="button"
                      id="hud-rula-alert-btn"
                      onClick={() => {
                        if (onRulaAlert) {
                          onRulaAlert({
                            rulaScore: currentFrame.rulaScore || 7,
                            criticalThreshold,
                            interpretation:
                              (currentFrame.rulaScore || 7) >= 7
                                ? 'Action Level 4: Immediate ergonomic intervention required. Extreme biomechanical loading detected at this temporal stage.'
                                : 'Action Level 3: High musculoskeletal risk detected.',
                            phaseLabel: currentFrame.phaseLabel,
                            cervicalLoadLbs: currentFrame.cervicalLoadLbs,
                            cvaDeg: currentFrame.cvaDeg,
                            forwardHeadOffsetMm: currentFrame.forwardHeadOffsetMm,
                            primaryRiskFactor: 'Severe Forward Cervical Translation & Kyphotic Slump',
                            source: 'scrubber_frame_analysis',
                            timestamp: new Date().toISOString(),
                          });
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition flex items-center gap-1 shadow-md ${
                        (currentFrame.rulaScore || 0) >= criticalThreshold
                          ? 'bg-rose-950/90 text-rose-200 border-rose-500 animate-pulse'
                          : (currentFrame.rulaScore || 0) >= 5
                          ? 'bg-amber-950/80 text-amber-200 border-amber-500'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                      }`}
                      title="Click to trigger on-screen warning alert for this frame"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>RULA: {currentFrame.rulaScore}/7</span>
                      {(currentFrame.rulaScore || 0) >= criticalThreshold && (
                        <span className="text-[10px] uppercase font-bold text-rose-300 ml-0.5">CRITICAL</span>
                      )}
                    </button>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1 text-right">
                  <span className="text-[10px] text-slate-400 block">Cervical Force Load</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {currentFrame.cervicalLoadLbs} lbs
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Playback Controls & Scrubber */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col gap-2.5">
            {/* Scrubber slider */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="play-pause-progression-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition shadow-md"
                title={isPlaying ? 'Pause progression playback' : 'Play progression loop'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                id="reset-progression-btn"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedFrameIndex(0);
                }}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                title="Reset to Frame 1 (Baseline)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Slider Track */}
              <div className="flex-1 relative flex items-center">
                <input
                  id="frame-scrubber-range"
                  type="range"
                  min={0}
                  max={frames.length - 1}
                  step={1}
                  value={selectedFrameIndex}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setSelectedFrameIndex(Number(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Playback speed toggle */}
              <div className="flex items-center gap-1 text-[11px] font-mono bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded ${
                      playbackSpeed === spd
                        ? 'bg-sky-500 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Time markers info */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
              <span>T=0.0s (Start)</span>
              <span className="text-sky-400 font-semibold">
                Scrubbing: Frame {selectedFrameIndex + 1} of {frames.length} ({currentFrame.timestampSec.toFixed(1)}s)
              </span>
              <span>T={progression.totalDurationSeconds}s (Max Slump)</span>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Biomechanical Differential Analysis */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Real-time Drift Delta Cards */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              Kinematic Drift from Baseline (T=0s)
            </h4>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Craniovertebral Angle (CVA)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-white font-mono">{currentFrame.cvaDeg}°</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      Number(cvaDelta) < -10 ? 'text-rose-400' : Number(cvaDelta) < 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {Number(cvaDelta) > 0 ? `+${cvaDelta}` : cvaDelta}°
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Normative: 50.0° - 55.0°</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Effective Cervical Load</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-amber-400 font-mono">{currentFrame.cervicalLoadLbs} lbs</span>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {loadDelta > 0 ? `+${loadDelta} lbs` : `${loadDelta} lbs`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Baseline: 10-12 lbs force</span>
              </div>
            </div>

            {/* Metric Physical Forward Translation in cm / in (based on user stature) */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Forward Head Translation</span>
                <span className="font-mono font-bold text-rose-400">
                  +{forwardOffsetCm} cm ({((Number(forwardOffsetCm) / 2.54)).toFixed(1)}")
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (Number(forwardOffsetCm) / 6.0) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Every 1 inch of forward neck excursion adds ~10 lbs of gravitational shearing stress on the C5-C7 spinal discs.
              </span>
            </div>

            {/* Fatigue Onset Note */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block">Postural Decay Alert:</strong>
                Postural stability degraded after just <strong>{progression.fatigueOnsetSecond} seconds</strong> of typing as cognitive attention shifted to the code editor.
              </div>
            </div>
          </div>

          {/* Ergonomic Risk: ANSI/HFES 100 RULA Score & Warning Trigger */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              (currentFrame.rulaScore || 0) >= criticalThreshold
                ? 'bg-rose-950/40 border-rose-600/50'
                : (currentFrame.rulaScore || 0) >= 5
                ? 'bg-amber-950/20 border-amber-600/40'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert
                  className={`w-4 h-4 ${
                    (currentFrame.rulaScore || 0) >= criticalThreshold ? 'text-rose-400' : 'text-sky-400'
                  }`}
                />
                ANSI/HFES 100 RULA Risk Status
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                  (currentFrame.rulaScore || 0) >= criticalThreshold
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : (currentFrame.rulaScore || 0) >= 5
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                }`}
              >
                Action Level {(currentFrame.rulaScore || 0) >= 7 ? '4 (Immediate)' : (currentFrame.rulaScore || 0) >= 5 ? '3 (Soon)' : '1-2 (Acceptable)'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {currentFrame.rulaScore || 6}<span className="text-sm text-slate-400">/7</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {(currentFrame.rulaScore || 0) >= criticalThreshold
                      ? `Breached critical threshold (≥${criticalThreshold})`
                      : `Threshold: ≥${criticalThreshold}`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {(currentFrame.rulaScore || 0) >= criticalThreshold
                    ? 'Extreme musculoskeletal load. Video analysis confirms rapid upper quadrant degradation.'
                    : 'Active posture within non-critical operational bounds.'}
                </p>
              </div>

              {onRulaAlert && (
                <button
                  type="button"
                  id="trigger-rula-warning-btn"
                  onClick={() => {
                    onRulaAlert({
                      rulaScore: currentFrame.rulaScore || 7,
                      criticalThreshold,
                      interpretation:
                        (currentFrame.rulaScore || 7) >= 7
                          ? 'Action Level 4: Immediate biomechanical changes required. Severe forward head posture and cervical shearing strain detected in video progression.'
                          : 'Action Level 3: High musculoskeletal risk detected.',
                      phaseLabel: currentFrame.phaseLabel,
                      cervicalLoadLbs: currentFrame.cervicalLoadLbs,
                      cvaDeg: currentFrame.cvaDeg,
                      forwardHeadOffsetMm: currentFrame.forwardHeadOffsetMm,
                      primaryRiskFactor: 'Progressive Cervical Creep & Forward Head Excursion',
                      source: 'temporal_progression_scrubber',
                      timestamp: new Date().toISOString(),
                    });
                  }}
                  className="shrink-0 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition"
                  title="Trigger on-screen clinical warning notification"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Trigger Alert</span>
                </button>
              )}
            </div>
          </div>

          {/* Coder Height & Ergonomic Recommendations Panel */}
          {anthropometrics && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Height-Calibrated Desk Targets
                </span>
                <button
                  type="button"
                  onClick={onOpenHeightModal}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-0.5"
                >
                  Adjust <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Chair Pan</span>
                  <span className="font-bold text-white font-mono">
                    {heightProfile?.unit === 'cm'
                      ? `${anthropometrics.seatedPoplitealChairHeightCm}cm`
                      : `${anthropometrics.seatedPoplitealChairHeightIn}"`}
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Desk Height</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {heightProfile?.unit === 'cm'
                      ? `${anthropometrics.seatedElbowDeskHeightCm}cm`
                      : `${anthropometrics.seatedElbowDeskHeightIn}"`}
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Monitor Top</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {heightProfile?.unit === 'cm'
                      ? `${anthropometrics.recommendedMonitorTopHeightCm}cm`
                      : `${anthropometrics.recommendedMonitorTopHeightIn}"`}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                <strong className="text-white">Coder Tip:</strong> Enlarge code editor font size from 12px to 15px. When font is too small, programmers unconsciously crane forward by up to 5cm to decipher punctuation tokens.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Filmstrip: Chronological Frame Connector */}
      <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            Connected Frame Sequence ({frames.length} Extracted Keyframes)
          </span>
          <span className="text-xs text-slate-400 font-mono">Click any frame to jump</span>
        </div>

        {/* Chronological Connector Ribbon */}
        <div className="relative flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {frames.map((frame, idx) => {
            const isSelected = selectedFrameIndex === idx;
            return (
              <React.Fragment key={frame.id || idx}>
                {/* Frame Card */}
                <button
                  type="button"
                  id={`filmstrip-frame-${idx}`}
                  onClick={() => {
                    setIsPlaying(false);
                    setSelectedFrameIndex(idx);
                  }}
                  className={`relative flex-shrink-0 w-32 sm:w-40 rounded-xl overflow-hidden border text-left transition-all group ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/40 shadow-lg scale-102 bg-slate-800'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="relative aspect-[16/10] bg-black">
                    <img
                      src={frame.imageBase64}
                      alt={frame.phaseLabel}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-white">
                      {frame.timestampSec.toFixed(1)}s
                    </div>
                  </div>

                  <div className="p-2 space-y-0.5">
                    <div className="text-[11px] font-semibold text-white truncate">
                      {frame.phaseLabel.split('•')[1] || frame.phaseLabel}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>CVA {frame.cvaDeg}°</span>
                      <span className="text-amber-400 font-semibold">{frame.cervicalLoadLbs} lbs</span>
                    </div>
                  </div>
                </button>

                {/* Connector Arrow between frames */}
                {idx < frames.length - 1 && (
                  <div className="flex-shrink-0 flex items-center justify-center text-slate-600">
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
