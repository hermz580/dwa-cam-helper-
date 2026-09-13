import React, { useState, useEffect } from 'react';
import { SlideItem, PosturalAnalysisResult } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Compass,
  Scale,
  Activity,
  Zap,
  Dumbbell,
  Laptop,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock
} from 'lucide-react';
import { speakClinicalText, stopSpeech, isSpeaking } from '../utils/speech';

interface SlideDeckProps {
  analysis: PosturalAnalysisResult;
  onNavigateToRecommendations?: () => void;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({
  analysis,
  onNavigateToRecommendations,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = analysis.slides;
  const currentSlide: SlideItem = slides[currentSlideIndex] || slides[0];

  // Auto-play timer
  useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 14000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Handle narration audio toggle
  const toggleAudioNarration = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const narrativeText = `${currentSlide.title}. ${currentSlide.subtitle}. ${currentSlide.narrative}. ${currentSlide.callout}`;
      const started = speakClinicalText(
        narrativeText,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
      if (started) setIsPlayingAudio(true);
    }
  };

  // Stop audio on slide change
  const handleSlideChange = (newIndex: number) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    }
    setCurrentSlideIndex(newIndex);
  };

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      handleSlideChange(currentSlideIndex + 1);
    } else {
      handleSlideChange(0);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      handleSlideChange(currentSlideIndex - 1);
    } else {
      handleSlideChange(slides.length - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  // Category visual icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spatial_calibration':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'differential_breakdown':
        return <Scale className="w-4 h-4 text-amber-400" />;
      case 'kinetic_chain':
        return <Activity className="w-4 h-4 text-rose-400" />;
      case 'myofascial_balance':
        return <Zap className="w-4 h-4 text-indigo-400" />;
      case 'corrective_protocols':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'ergonomic_action':
      default:
        return <Laptop className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div
      id="slide-deck-wrapper"
      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'relative'
      }`}
    >
      {/* Top Deck Navigation Bar */}
      <div id="deck-header" className="bg-slate-950/80 border-b border-slate-800 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200">
            {getCategoryIcon(currentSlide.category)}
            <span>Step {currentSlide.stepNumber} of {currentSlide.totalSteps}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Clinical Slide Deck
          </span>
        </div>

        {/* Step dots / Jump buttons */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={`slide-step-${s.id}`}
              id={`slide-nav-step-${idx + 1}`}
              onClick={() => handleSlideChange(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlideIndex
                  ? 'w-6 bg-sky-400 shadow-sm shadow-sky-400/50'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Jump to Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Audio & Autoplay Tools */}
        <div className="flex items-center gap-2">
          <button
            id="audio-narration-btn"
            onClick={toggleAudioNarration}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border ${
              isPlayingAudio
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Listen to clinical narration"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingAudio ? 'Mute Speech' : 'Audio Narration'}</span>
          </button>

          <button
            id="autoplay-deck-btn"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`p-1.5 rounded-lg text-xs font-medium transition border ${
              isAutoPlaying
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isAutoPlaying ? 'Pause presentation' : 'Autoplay slide presentation'}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            id="fullscreen-deck-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 transition hidden sm:block"
            title={isFullscreen ? 'Exit full screen' : 'Expand full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div id="slide-body-viewport" className="p-6 sm:p-8 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Title Block */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 mb-1">
              <span>{currentSlide.category.replace('_', ' ')}</span>
              <span>•</span>
              <span>DIAGNOSTIC STAGE {currentSlide.stepNumber}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
              {currentSlide.title}
            </h2>
            <p className="text-base text-slate-400 mt-1 font-normal">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentSlide.keyMetrics.map((metric, i) => {
              const statusColor =
                metric.status === 'alert'
                  ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                  : metric.status === 'warning'
                  ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                  : metric.status === 'good'
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-700 bg-slate-800/40 text-slate-300';

              return (
                <div
                  key={`metric-${i}`}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${statusColor}`}
                >
                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider truncate">
                    {metric.label}
                  </span>
                  <span className="text-lg font-bold tracking-tight mt-1">
                    {metric.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Slide Specific Visual / Interactive Feature Card */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            {/* Render specialized widget depending on slide category */}
            {currentSlide.category === 'spatial_calibration' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-400" />
                    Spatial Transformation & Perspective Calibration
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-800/60">
                    Calibration Confidence: {analysis.cameraPerspective.confidenceScore}%
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Optical Vantage Angle</div>
                    <div className="text-slate-100 font-semibold mt-0.5">{analysis.cameraPerspective.viewAngle}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Estimated Pitch Angle</div>
                    <div className="text-sky-300 font-semibold mt-0.5">
                      {analysis.cameraPerspective.estimatedCameraPitchDeg > 0 ? '+' : ''}
                      {analysis.cameraPerspective.estimatedCameraPitchDeg}° from Horizon
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Workspace Context</div>
                    <div className="text-emerald-300 font-semibold mt-0.5">Seated Task Posture</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  {analysis.cameraPerspective.spatialOrientationAssessment}
                </p>
              </div>
            )}

            {currentSlide.category === 'differential_breakdown' && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  High Differential Deviation Breakdown
                </h4>
                <div className="space-y-2">
                  {analysis.differentials.map((diff) => (
                    <div
                      key={diff.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          {diff.name}
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              diff.severity === 'severe'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                : diff.severity === 'moderate'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            }`}
                          >
                            {diff.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px]">{diff.biomechanicalImpact}</div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 sm:text-right">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Measured</div>
                          <div className="font-bold text-slate-200">{diff.measuredValue}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">Normative</div>
                          <div className="font-medium text-emerald-400">{diff.normativeValue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentSlide.category === 'kinetic_chain' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" />
                    Kinetic Chain Cascade & Mechanical Load
                  </h4>
                  <span className="text-xs text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800">
                    Cervical Spine Force: {analysis.clinicalClassification.cervicalLoadEstimateLbs} lbs
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-4 text-xs">
                  <div className="w-full md:w-1/3 p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 text-center">
                    <div className="text-[11px] text-rose-300 font-medium">Head Forward Translation</div>
                    <div className="text-2xl font-black text-rose-400 my-1">
                      {analysis.clinicalClassification.cervicalLoadEstimateLbs} lbs
                    </div>
                    <div className="text-[10px] text-slate-400">Normal head weight: ~10-12 lbs</div>
                  </div>
                  <div className="w-full md:w-2/3 text-slate-300 text-xs space-y-1.5 leading-relaxed">
                    <div className="font-medium text-slate-200">
                      Primary Diagnosis: <span className="text-sky-300">{analysis.clinicalClassification.primarySyndrome}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Secondary Kinetic Linkages:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {analysis.clinicalClassification.secondaryFindings.map((finding, idx) => (
                        <li key={`sec-find-${idx}`}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentSlide.category === 'myofascial_balance' && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Myofascial Imbalance Cross Matrix (Janda Pattern)
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {/* Hypertonic / Tight */}
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                    <div className="font-semibold text-rose-300 flex items-center gap-1.5 text-xs">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      Hypertonic / Contracted (Overactive)
                    </div>
                    <div className="space-y-1.5">
                      {analysis.myofascialProfile.hypertonicMuscles.map((m, idx) => (
                        <div key={`hyper-${idx}`} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="font-medium text-slate-200">{m.name}</div>
                          <div className="text-[10px] text-slate-400">{m.impact}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inhibited / Weak */}
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Inhibited / Lengthened (Dormant)
                    </div>
                    <div className="space-y-1.5">
                      {analysis.myofascialProfile.inhibitedMuscles.map((m, idx) => (
                        <div key={`inhib-${idx}`} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="font-medium text-slate-200">{m.name}</div>
                          <div className="text-[10px] text-slate-400">{m.impact}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide.category === 'corrective_protocols' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                    Prescribed Corrective Exercises
                  </h4>
                  {onNavigateToRecommendations && (
                    <button
                      onClick={onNavigateToRecommendations}
                      className="text-xs text-sky-400 hover:text-sky-300 underline font-medium"
                    >
                      View Detailed Timers & Routines →
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {analysis.recommendations.exercises.slice(0, 4).map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs"
                    >
                      <div className="font-semibold text-emerald-300">{ex.name}</div>
                      <div className="text-slate-400 text-[11px]">Dose: <strong className="text-slate-200">{ex.setsAndReps}</strong></div>
                      <div className="text-[10px] text-slate-400 line-clamp-2">{ex.clinicalRationale}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentSlide.category === 'ergonomic_action' && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  Immediate Spatial & Temporal Modifications
                </h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  {analysis.recommendations.workstationErgonomics.map((item, idx) => (
                    <div
                      key={`ergo-${idx}`}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2 text-slate-300 text-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    Temporal Frequency: <strong>{analysis.recommendations.timeSchedule.postureBreakFrequency}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Narrative & Clinical Detail */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentSlide.narrative}
            </p>

            {/* Bullet Points */}
            <ul className="space-y-2">
              {currentSlide.bulletPoints.map((point, i) => (
                <li key={`bullet-${i}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2"></div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Callout Box */}
          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/50 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-sky-200 font-medium leading-relaxed">
              {currentSlide.callout}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Deck Controls */}
      <div id="deck-footer" className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
        <button
          id="deck-prev-btn"
          onClick={prevSlide}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Use ← / → keyboard arrows to navigate slides
        </div>

        {currentSlideIndex < slides.length - 1 ? (
          <button
            id="deck-next-btn"
            onClick={nextSlide}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md shadow-sky-600/20"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="deck-finish-recommendations-btn"
            onClick={onNavigateToRecommendations}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <span>View Full Recommendations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
