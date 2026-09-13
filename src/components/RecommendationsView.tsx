import React, { useState, useEffect } from 'react';
import { CorrectiveExercise, PosturalAnalysisResult } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Printer,
  Sparkles,
  Dumbbell,
  Laptop,
  Clock,
  Volume2,
  Share2,
  ShieldCheck
} from 'lucide-react';
import { speakClinicalText } from '../utils/speech';

interface RecommendationsViewProps {
  analysis: PosturalAnalysisResult;
  onBackToSlides?: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  analysis,
  onBackToSlides,
}) => {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const exercises = analysis.recommendations.exercises;
  const currentExercise = exercises[activeExerciseIndex] || exercises[0];

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer((prev) => prev - 1);
      }, 1000);
    } else if (exerciseTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play audio cue
      speakClinicalText('Exercise interval complete. Great job.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, exerciseTimer]);

  const resetTimer = (seconds: number = 30) => {
    setIsTimerRunning(false);
    setExerciseTimer(seconds);
  };

  const readExerciseInstructions = (ex: CorrectiveExercise) => {
    const speech = `${ex.name}. Target: ${ex.targetSyndrome}. Dose: ${ex.setsAndReps}. Instructions: ${ex.instructions.join('. ')}. Key cue: ${ex.clinicalRationale}. Remember: ${ex.commonMistake}`;
    speakClinicalText(speech);
  };

  const handlePrint = () => {
    window.print();
  };

  const copyReportSummary = () => {
    const summary = `KINEPOST CLINICAL POSTURAL REPORT
Date: ${new Date(analysis.timestamp).toLocaleDateString()}
Primary Diagnosis: ${analysis.clinicalClassification.primarySyndrome}
RULA Ergonomic Risk: ${analysis.clinicalClassification.rulaScore}/7 (${analysis.clinicalClassification.rulaInterpretation})
Cervical Load Force: ${analysis.clinicalClassification.cervicalLoadEstimateLbs} lbs

HIGH DIFFERENTIAL DEVIATIONS:
${analysis.differentials.map((d) => `• ${d.name}: ${d.measuredValue} (Normative: ${d.normativeValue}) - ${d.deviationDelta}`).join('\n')}

RECOMMENDED EXERCISES:
${analysis.recommendations.exercises.map((e) => `• ${e.name} (${e.setsAndReps}) - ${e.clinicalRationale}`).join('\n')}

WORKSPACE RECOMMENDATIONS:
${analysis.recommendations.workstationErgonomics.map((w) => `• ${w}`).join('\n')}
`;
    navigator.clipboard.writeText(summary);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  return (
    <div id="recommendations-container" className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            EVIDENCE-BASED REHABILITATION & ERGONOMICS
          </div>
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">
            Targeted Clinical Recommendations
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Derived from your multi-angle spatial assessment. Follow these structured physical therapy interventions and workstation recalibrations to reverse your high differential metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            id="copy-summary-btn"
            onClick={copyReportSummary}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 flex items-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedReport ? 'Copied to Clipboard!' : 'Copy Summary'}
          </button>
          {onBackToSlides && (
            <button
              id="back-to-slides-btn"
              onClick={onBackToSlides}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-sky-600/20"
            >
              ← Back to Slide Deck
            </button>
          )}
        </div>
      </div>

      {/* 1. Immediate Micro-Cues for Right Now */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Immediate Postural Micro-Corrections (Apply Immediately)
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {analysis.recommendations.immediateCues.map((cue, idx) => {
            const [title, ...desc] = cue.split(':');
            return (
              <div
                key={`micro-cue-${idx}`}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1"
              >
                <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {title || `Cue ${idx + 1}`}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {desc.join(':') || title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Corrective Exercise Prescriptions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              Corrective Physical Therapy Prescriptions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an exercise below to view precise technique, sets, tempo, and use the interactive timer.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {exercises.length} Exercises Prescribed
          </span>
        </div>

        {/* Exercise Tabs */}
        <div className="flex flex-wrap gap-2">
          {exercises.map((ex, idx) => (
            <button
              key={ex.id}
              id={`exercise-tab-${ex.id}`}
              onClick={() => {
                setActiveExerciseIndex(idx);
                resetTimer(30);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 border ${
                idx === activeExerciseIndex
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <span>{ex.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Exercise Detail Card */}
        {currentExercise && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  Target Syndrome: {currentExercise.targetSyndrome}
                </span>
                <h4 className="text-xl font-bold text-slate-50 mt-0.5">
                  {currentExercise.name}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>Dose: <strong className="text-slate-200">{currentExercise.setsAndReps}</strong></span>
                  <span>•</span>
                  <span>Tempo: <strong className="text-slate-200">{currentExercise.tempo}</strong></span>
                </div>
              </div>

              {/* Interactive Exercise Hold Timer */}
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-4 shrink-0 shadow-md">
                <div className="text-center px-2">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Hold Timer</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400">
                    {exerciseTimer}s
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    id="exercise-timer-toggle-btn"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isTimerRunning
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                    title={isTimerRunning ? 'Pause timer' : 'Start countdown'}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    id="exercise-timer-reset-btn"
                    onClick={() => resetTimer(30)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                    title="Reset to 30 seconds"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    id="listen-exercise-cues-btn"
                    onClick={() => readExerciseInstructions(currentExercise)}
                    className="p-2 rounded-xl bg-slate-800 text-sky-300 hover:bg-slate-700 transition"
                    title="Audio narration of technique"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Execution Technique (Step-by-Step):
              </h5>
              <div className="space-y-2">
                {currentExercise.instructions.map((step, sIdx) => (
                  <div
                    key={`step-${sIdx}`}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rationale & Mistake Callouts */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Clinical Biomechanical Rationale
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentExercise.clinicalRationale}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Common Technique Pitfall
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentExercise.commonMistake}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Workstation Ergonomics & Stature Targets */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              Workstation Ergonomic Adjustments
            </h3>
            {analysis.anthropometrics && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                ANSI/HFES 100-2007 Standard
              </span>
            )}
          </div>

          {/* Stature anthropometric targets if available */}
          {analysis.anthropometrics && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
              <div className="p-2 bg-slate-900/80 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Chair Seat Pan</span>
                <span className="font-bold text-white font-mono">
                  {analysis.anthropometrics.seatedPoplitealChairHeightIn}" ({analysis.anthropometrics.seatedPoplitealChairHeightCm}cm)
                </span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Desk Height</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {analysis.anthropometrics.seatedElbowDeskHeightIn}" ({analysis.anthropometrics.seatedElbowDeskHeightCm}cm)
                </span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Monitor Top</span>
                <span className="font-bold text-amber-400 font-mono">
                  {analysis.anthropometrics.recommendedMonitorTopHeightIn}" ({analysis.anthropometrics.recommendedMonitorTopHeightCm}cm)
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {analysis.recommendations.workstationErgonomics.map((item, idx) => (
              <div
                key={`ergo-item-${idx}`}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5"></div>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            Temporal Cadence & Posture Breaks
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-1 text-xs">
              <div className="font-bold text-sky-300">Recommended Break Interval</div>
              <div className="text-slate-200 font-medium">
                {analysis.recommendations.timeSchedule.postureBreakFrequency}
              </div>
              <p className="text-slate-400 text-[11px] mt-1">
                Static postures longer than 30 minutes cause connective tissue creep and vascular stagnation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
              <div className="font-bold text-slate-200">Daily Rehabilitation Schedule</div>
              <p className="text-slate-300 leading-relaxed">
                {analysis.recommendations.timeSchedule.dailyRoutine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
