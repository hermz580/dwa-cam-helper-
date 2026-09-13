import React, { useState } from 'react';
import {
  Activity,
  Camera,
  Layers,
  Presentation,
  CheckCircle2,
  Info,
  X,
  Compass,
  Film,
  Ruler,
  Laptop,
  Brain,
} from 'lucide-react';
import { stopSpeech, isSpeaking } from '../utils/speech';
import { UserHeightProfile } from '../types';

export type ActiveView = 'camera' | 'progression' | 'visualizer' | 'understanding' | 'slides' | 'recommendations' | 'deepwork';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  hasAnalysis: boolean;
  onNewScan: () => void;
  heightProfile?: UserHeightProfile;
  onOpenHeightModal?: () => void;
  criticalThreshold?: number;
  onTriggerTestAlert?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  hasAnalysis,
  onNewScan,
  heightProfile,
  onOpenHeightModal,
  criticalThreshold = 6,
  onTriggerTestAlert,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header id="app-header" className="bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Clinical System Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                  KinePost
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800">
                  Video Kinematics
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Multi-Frame Video Postural Analysis & Height Calibration
              </p>
            </div>
          </div>

          {/* Primary View Switcher Navigation */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              id="nav-camera-tab"
              onClick={() => setActiveView('camera')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'camera'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera & Video</span>
            </button>

            <button
              id="nav-progression-tab"
              onClick={() => setActiveView('progression')}
              disabled={!hasAnalysis}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'progression'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : hasAnalysis
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video Timeline</span>
            </button>

            <button
              id="nav-visualizer-tab"
              onClick={() => setActiveView('visualizer')}
              disabled={!hasAnalysis}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'visualizer'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : hasAnalysis
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vectors & Plumb</span>
            </button>

            <button
              id="nav-understanding-tab"
              onClick={() => setActiveView('understanding')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'understanding'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Interactive Biomechanics, Cervical Spine Dynamics & Cam Sense Lab"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Understanding Lab</span>
            </button>

            <button
              id="nav-slides-tab"
              onClick={() => setActiveView('slides')}
              disabled={!hasAnalysis}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'slides'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : hasAnalysis
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Step-by-Slide</span>
              {hasAnalysis && (
                <span className="w-4 h-4 rounded-full bg-sky-950 text-sky-300 text-[10px] flex items-center justify-center font-bold border border-sky-800">
                  6
                </span>
              )}
            </button>

            <button
              id="nav-recommendations-tab"
              onClick={() => setActiveView('recommendations')}
              disabled={!hasAnalysis}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'recommendations'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : hasAnalysis
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ergonomics</span>
            </button>

            <button
              id="nav-deepwork-tab"
              onClick={() => setActiveView('deepwork')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeView === 'deepwork'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Integration guide for hermz580/deep-work-assistant"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Deep Work API</span>
            </button>
          </nav>

          {/* Height profile badge & Quick Tools */}
          <div className="flex items-center gap-2">
            {heightProfile && (
              <button
                id="header-height-badge-btn"
                onClick={onOpenHeightModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-white hover:border-sky-500 transition"
                title="Click to calibrate your stature and workstation height"
              >
                <Ruler className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-white">
                  {heightProfile.heightFeet}'{heightProfile.heightInches}"
                </span>
                <span className="text-[11px] text-slate-400">({heightProfile.heightCm}cm)</span>
              </button>
            )}

            {onTriggerTestAlert && (
              <button
                id="header-rula-guard-btn"
                onClick={onTriggerTestAlert}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-600/50 text-xs text-rose-300 transition"
                title="RULA Live Posture Guard: Click to test on-screen critical warning"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-semibold">RULA Guard: ≥{criticalThreshold}</span>
              </button>
            )}

            <button
              id="clinical-info-btn"
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-850 transition"
              title="Clinical Methodology & Biomechanical Standards"
            >
              <Info className="w-4 h-4" />
            </button>

            {hasAnalysis && (
              <button
                id="new-scan-btn"
                onClick={onNewScan}
                className="px-3.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">New Session</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Clinical Reference Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Clinical Methodology & Kinematic Standards
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-sky-400">1. Spatial Perspective & Multi-Angle Correction</h4>
                <p>
                  KinePost applies inverse perspective projection matrices to account for the camera's vantage angle (Sagittal side profiles, Anterior coronal, Oblique 45°, and desk-level tilts). True gravitational plumb lines (0.0°) are calculated independent of camera pitch.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-amber-400">2. High Differential Quantification</h4>
                <p>
                  Calculates angular deltas against standard orthopedic baselines:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 mt-1">
                  <li><strong>Craniovertebral Angle (CVA):</strong> Normative 50°–55°. Less than 50° indicates progressive forward head posture.</li>
                  <li><strong>Bi-Acromial Differential:</strong> Bilateral shoulder height variance (&lt;5mm normative).</li>
                  <li><strong>Thoracic Cobb Angle:</strong> 20°–40° normative; &gt;45° indicates hyperkyphosis.</li>
                  <li><strong>Cervical Gravitational Load:</strong> Normal head weight is 10–12 lbs. At 38° CVA, effective cervical force surges to 34+ lbs.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-bold text-emerald-400">3. RULA & Janda Syndrome Classification</h4>
                <p>
                  Integrates the Rapid Upper Limb Assessment (RULA 1-7 scale) and Dr. Vladimir Janda's Upper & Lower Crossed Syndrome models to map reciprocal myofascial inhibition (which muscles are chronically tight vs which are neurologically dormant).
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
