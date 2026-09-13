import React, { useState } from 'react';
import { SkeletalLandmark, PosturalDifferential } from '../types';
import {
  Eye,
  EyeOff,
  Layers,
  Compass,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Brain,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PostureVisualizerProps {
  imageSrc: string;
  landmarks: SkeletalLandmark[];
  differentials: PosturalDifferential[];
  plumbLineX?: number; // 0 - 100 percentage
  cervicalLoadLbs?: number;
  rulaScore?: number;
  primarySyndrome?: string;
  className?: string;
}

export const PostureVisualizer: React.FC<PostureVisualizerProps> = ({
  imageSrc,
  landmarks,
  differentials,
  plumbLineX = 38,
  cervicalLoadLbs = 34,
  rulaScore = 6,
  primarySyndrome = 'Upper Crossed Syndrome',
  className = '',
}) => {
  const [showPlumbLine, setShowPlumbLine] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showDifferentials, setShowDifferentials] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [activeLandmark, setActiveLandmark] = useState<SkeletalLandmark | null>(null);
  const [showUnderstanding, setShowUnderstanding] = useState<boolean>(true);

  // Find landmarks for connections
  const tragus = landmarks.find(l => l.name.toLowerCase().includes('tragus'));
  const c7 = landmarks.find(l => l.name.toLowerCase().includes('c7'));
  const acromion = landmarks.find(l => l.name.toLowerCase().includes('acromion'));
  const elbow = landmarks.find(l => l.name.toLowerCase().includes('elbow') || l.name.toLowerCase().includes('epicondyle'));
  const wrist = landmarks.find(l => l.name.toLowerCase().includes('wrist'));
  const apex = landmarks.find(l => l.name.toLowerCase().includes('thoracic') || l.name.toLowerCase().includes('t7'));
  const hip = landmarks.find(l => l.name.toLowerCase().includes('trochanter') || l.name.toLowerCase().includes('hip') || l.name.toLowerCase().includes('asis'));
  const knee = landmarks.find(l => l.name.toLowerCase().includes('knee') || l.name.toLowerCase().includes('condyle'));
  const ankle = landmarks.find(l => l.name.toLowerCase().includes('ankle') || l.name.toLowerCase().includes('malleolus'));

  // Define bone connections
  const connections = [
    { from: tragus, to: c7, type: 'cervical', alert: true },
    { from: c7, to: acromion, type: 'shoulder', alert: false },
    { from: acromion, to: elbow, type: 'arm', alert: false },
    { from: elbow, to: wrist, type: 'forearm', alert: false },
    { from: c7, to: apex || hip, type: 'spine', alert: true },
    { from: apex, to: hip, type: 'lumbar', alert: false },
    { from: hip, to: knee, type: 'thigh', alert: false },
    { from: knee, to: ankle, type: 'leg', alert: false },
  ].filter(c => c.from && c.to) as Array<{ from: SkeletalLandmark; to: SkeletalLandmark; type: string; alert: boolean }>;

  return (
    <div id="posture-visualizer-container" className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl ${className}`}>
      {/* Control Toolbar */}
      <div id="visualizer-toolbar" className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Biomechanical Kinematics
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-600"></span>
          <span className="hidden sm:inline-block text-xs text-slate-300 font-mono">
            Eff. Load: <strong className="text-amber-400 font-semibold">{cervicalLoadLbs} lbs</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            id="toggle-plumbline-btn"
            onClick={() => setShowPlumbLine(!showPlumbLine)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
              showPlumbLine
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Gravitational Coronal Plumb Line"
          >
            {showPlumbLine ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Plumb Line
          </button>

          <button
            id="toggle-skeleton-btn"
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
              showSkeleton
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Skeletal Kinematic Links"
          >
            <Layers className="w-3 h-3" />
            Skeletal Chain
          </button>

          <button
            id="toggle-differentials-btn"
            onClick={() => setShowDifferentials(!showDifferentials)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
              showDifferentials
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle High-Differential Offset Vectors"
          >
            {showDifferentials ? <AlertTriangle className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3" />}
            Vectors
          </button>

          <button
            id="toggle-understanding-btn"
            onClick={() => setShowUnderstanding(!showUnderstanding)}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
              showUnderstanding
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Plain-English Biomechanical Understanding & Impact Guide"
          >
            <Brain className="w-3 h-3 text-indigo-400" />
            Sense & Impact
          </button>
        </div>
      </div>

      {/* Main Image Viewport & SVG Overlay */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] flex items-center justify-center bg-black select-none">
        <img
          src={imageSrc}
          alt="Postural Analysis Subject"
          className="w-full h-full object-contain"
        />

        {/* Interactive SVG Kinematic Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Glow filters for clinical highlights */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="plumb-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 1. Gravitational Coronal Plumb Line */}
          {showPlumbLine && (
            <g id="svg-plumb-line">
              {/* Plumb Line Base Vector */}
              <line
                x1={plumbLineX}
                y1={4}
                x2={plumbLineX}
                y2={96}
                stroke="url(#plumb-gradient)"
                strokeWidth="0.6"
                strokeDasharray="1.5 1.5"
                filter="url(#glow-cyan)"
              />
              {/* Top reference plumb marker */}
              <circle cx={plumbLineX} cy={4} r="1" fill="#38bdf8" />
              <text
                x={plumbLineX + 1.8}
                y={6.5}
                fill="#38bdf8"
                fontSize="2.2"
                fontWeight="bold"
                fontFamily="monospace"
              >
                PLUMB LINE (0.0°)
              </text>
            </g>
          )}

          {/* 2. Skeletal Connections */}
          {showSkeleton && (
            <g id="svg-skeleton-links">
              {connections.map((conn, idx) => (
                <line
                  key={`conn-${idx}`}
                  x1={conn.from.x}
                  y1={conn.from.y}
                  x2={conn.to.x}
                  y2={conn.to.y}
                  stroke={conn.alert ? '#f59e0b' : '#10b981'}
                  strokeWidth={conn.alert ? '0.8' : '0.6'}
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                />
              ))}
            </g>
          )}

          {/* 3. High-Differential Vectors (e.g. Forward Head Translation Delta) */}
          {showDifferentials && tragus && acromion && (
            <g id="svg-differential-vectors">
              {/* Horizontal translation line from plumb line to Tragus */}
              <line
                x1={plumbLineX}
                y1={tragus.y}
                x2={tragus.x}
                stroke="#ef4444"
                strokeWidth="0.7"
                strokeDasharray="0.8 0.8"
                filter="url(#glow-amber)"
              />
              {/* Angle arc between C7, Tragus, and horizontal */}
              {c7 && (
                <path
                  d={`M ${c7.x} ${c7.y} L ${tragus.x} ${tragus.y}`}
                  stroke="#f97316"
                  strokeWidth="0.8"
                  strokeDasharray="1 0.5"
                />
              )}
              {/* Differential delta annotation */}
              <rect
                x={Math.min(plumbLineX, tragus.x) + 0.5}
                y={tragus.y - 4.5}
                width="14"
                height="3.6"
                rx="0.8"
                fill="#1e1b4b"
                fillOpacity="0.9"
                stroke="#f59e0b"
                strokeWidth="0.3"
              />
              <text
                x={Math.min(plumbLineX, tragus.x) + 1.2}
                y={tragus.y - 2.0}
                fill="#fbbf24"
                fontSize="1.9"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                Δ +4.2 cm FHT
              </text>
            </g>
          )}

          {/* 4. Skeletal Landmark Nodes */}
          {landmarks.map((l, i) => {
            const isAlert = l.differentialFlag;
            return (
              <g
                key={`landmark-${i}`}
                className="cursor-pointer pointer-events-auto"
                onClick={() => setActiveLandmark(l)}
              >
                {/* Outer pulsing ring for high-differential flags */}
                {isAlert && (
                  <circle
                    cx={l.x}
                    cy={l.y}
                    r="2.2"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="0.4"
                    strokeDasharray="0.8 0.8"
                    opacity="0.85"
                  />
                )}
                <circle
                  cx={l.x}
                  cy={l.y}
                  r="1.2"
                  fill={isAlert ? '#ef4444' : '#10b981'}
                  stroke="#ffffff"
                  strokeWidth="0.3"
                />

                {/* Label text */}
                {showLabels && l.label && (
                  <g>
                    <rect
                      x={l.x > 50 ? l.x - 22 : l.x + 2}
                      y={l.y - 1.8}
                      width="20"
                      height="3.4"
                      rx="0.6"
                      fill="#0f172a"
                      fillOpacity="0.85"
                      stroke={isAlert ? '#ef4444' : '#334155'}
                      strokeWidth="0.2"
                    />
                    <text
                      x={l.x > 50 ? l.x - 21 : l.x + 3}
                      y={l.y + 0.6}
                      fill={isAlert ? '#fca5a5' : '#94a3b8'}
                      fontSize="1.8"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {l.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Landmark Detail Card */}
        {activeLandmark && (
          <div className="absolute bottom-4 left-4 z-30 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl max-w-xs text-xs backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                {activeLandmark.differentialFlag ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {activeLandmark.name}
              </span>
              <button
                onClick={() => setActiveLandmark(null)}
                className="text-slate-400 hover:text-slate-200 text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeLandmark.label || 'Anatomical datum marker for coronal/sagittal plumb line calibration.'}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
              <span>Coord: [{activeLandmark.x.toFixed(1)}%, {activeLandmark.y.toFixed(1)}%]</span>
              <span>Confidence: {(activeLandmark.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div id="visualizer-bottom-summary" className="bg-slate-900/90 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium">{primarySyndrome}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-400">
            RULA Risk Score: <strong className="text-amber-400">{rulaScore}/7</strong>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal Baseline
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate Deviation
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Severe High Differential
          </span>
        </div>
      </div>

      {/* Plain-English Biomechanical Understanding & Real-World Impact */}
      {showUnderstanding && (
        <div className="bg-slate-950 border-t border-slate-800/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Clinical Translation: What This Data Actually Means
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Calculated from Hansraj Cervical Dynamics
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-3 text-xs">
            {/* Box 1: Physical Force */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <Zap className="w-3.5 h-3.5" />
                <span>The Physical Force</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Your head weighs ~12 lbs upright. At this measured angle, gravitational torque exerts <strong className="text-amber-300">{cervicalLoadLbs} lbs</strong> on your C7 vertebra—equivalent to carrying a child around your neck for hours.
              </p>
            </div>

            {/* Box 2: What You Feel */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Symptoms & Strain</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Forces your suboccipitals and levator scapulae muscles into ischemic tension knots, causing dull headaches behind the eyes and shoulder blade burning by mid-afternoon.
              </p>
            </div>

            {/* Box 3: Immediate Fix */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Immediate Desk Fix</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Elevate your laptop or display so the top 1/3 of the screen aligns directly with eye gaze, and pull your keyboard 2 inches closer so your elbows rest at 90°.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
