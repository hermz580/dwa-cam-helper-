import React, { useState } from 'react';
import { UserHeightProfile } from '../types';
import {
  Brain,
  Activity,
  Flame,
  ShieldAlert,
  Ruler,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  RotateCcw,
  Zap,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface PostureUnderstandingLabProps {
  heightProfile: UserHeightProfile;
  onOpenHeightModal: () => void;
  onNavigateToCamera: () => void;
  onNavigateToProgression: () => void;
}

export const PostureUnderstandingLab: React.FC<PostureUnderstandingLabProps> = ({
  heightProfile,
  onOpenHeightModal,
  onNavigateToCamera,
  onNavigateToProgression,
}) => {
  // Interactive Simulation State
  const [headTiltDeg, setHeadTiltDeg] = useState<number>(30); // 0° to 60°
  const [hoursPerDay, setHoursPerDay] = useState<number>(6); // 1 to 12 hours
  const [selectedMuscle, setSelectedMuscle] = useState<string>('suboccipitals');
  const [activeRulaTab, setActiveRulaTab] = useState<number>(3); // 1 to 4 action level

  // Calculate cervical load based on Kapandji / Hansraj biomechanical spine model
  // 0° = 12 lbs, 15° = 27 lbs, 30° = 40 lbs, 45° = 49 lbs, 60° = 60 lbs
  const calculateCervicalLoad = (deg: number): number => {
    if (deg <= 0) return 12;
    if (deg <= 15) return Math.round(12 + (deg / 15) * 15);
    if (deg <= 30) return Math.round(27 + ((deg - 15) / 15) * 13);
    if (deg <= 45) return Math.round(40 + ((deg - 30) / 15) * 9);
    return Math.round(49 + ((deg - 45) / 15) * 11);
  };

  const cervicalLoadLbs = calculateCervicalLoad(headTiltDeg);
  const forwardOffsetMm = Math.round(headTiltDeg * 1.15);
  const dailySpinalEnergyExpenditureKcal = Math.round((cervicalLoadLbs - 12) * hoursPerDay * 4.2);

  // Craniovertebral Angle (CVA) inversely correlates with tilt
  // 0° tilt = ~56° CVA (healthy), 60° tilt = ~28° CVA (severe)
  const estimatedCvaDeg = Math.round(56 - headTiltDeg * 0.46);

  // Muscle group details
  const muscleProfiles: Record<
    string,
    { name: string; status: 'Hypertonic & Fatigued' | 'Inhibited & Weakened'; desc: string; symptoms: string; fix: string }
  > = {
    suboccipitals: {
      name: 'Suboccipital Muscles (Base of Skull)',
      status: 'Hypertonic & Fatigued',
      desc: 'Small muscle group at C1-C2 that acts as cranial proprioceptors. When the chin juts forward, these stay locked in continuous ischemic contraction.',
      symptoms: 'Tension headaches behind the eyes, craniocervical occipital throbbing, brain fog.',
      fix: 'Chin tucks (craniocervical flexion) and suboccipital release against a massage ball or rolled towel.',
    },
    upperTraps: {
      name: 'Upper Trapezius & Levator Scapulae',
      status: 'Hypertonic & Fatigued',
      desc: 'Suspends the shoulder girdle against gravity. Under forward head translation, must exert up to 4x basal force to prevent head from collapsing forward.',
      symptoms: 'Burning shoulder knots, upper neck stiffness, radiating trigger points between shoulder blades.',
      fix: 'Scapular retractions, seated doorway pectoral stretches, lowering armrests to support elbow weight.',
    },
    deepFlexors: {
      name: 'Deep Cervical Flexors (Longus Colli / Capitis)',
      status: 'Inhibited & Weakened',
      desc: 'The anatomical "core of the neck" that stabilizes cervical lordosis. Under chronic coder slump, these muscles neurologically shut down (reciprocal inhibition).',
      symptoms: 'Inability to hold head upright without fatigue, cervical disc compression, shallow breathing.',
      fix: 'Supine head nod exercises (tuck chin without lifting head from floor) held for 10 seconds, 5 reps.',
    },
    pectorals: {
      name: 'Pectoralis Major & Minor (Anterior Chest)',
      status: 'Hypertonic & Fatigued',
      desc: 'Shortened from sustained keyboard reaching. Pulls the acromion processes anteriorly, locking shoulders in internal rotation.',
      symptoms: 'Slumped round shoulders, restricted thoracic rib expansion, thoracic outlet numbness.',
      fix: 'Corner chest stretches, external rotation resistance band pull-aparts, adjusting keyboard distance closer.',
    },
  };

  return (
    <div id="posture-understanding-lab" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Biomechanics Lab
              </span>
              <span className="text-xs text-slate-400">• Hansraj & Kapandji Spine Dynamics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-400" />
              Posture & Cam Sense Understanding Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Understand the precise physics of your neck, spine, and desk ergonomics. Learn why small 1-inch head shifts compound into massive spinal loads during continuous coding sprints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToCamera}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-sky-600/25"
            >
              <Activity className="w-4 h-4" />
              <span>Test with Cam Sense</span>
            </button>
            <button
              onClick={onNavigateToProgression}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Video Progression</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Interactive Spine Load Simulator */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Head Angle & Load Physics (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                Cervical Spine Torque & Load Simulator
              </h3>
            </div>
            <button
              onClick={() => {
                setHeadTiltDeg(0);
                setHoursPerDay(6);
              }}
              className="text-[11px] font-semibold text-slate-400 hover:text-sky-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Neutral
            </button>
          </div>

          {/* Dynamic Visual Spine & Head Avatar */}
          <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 p-4 aspect-[16/9] flex items-center justify-center overflow-hidden">
            {/* SVG Visual Representation */}
            <svg className="w-full h-full max-w-sm" viewBox="0 0 400 240">
              <defs>
                <linearGradient id="spine-load-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Reference Neutral Plumb Line */}
              <line x1="160" y1="20" x2="160" y2="220" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              <text x="165" y="32" fill="#38bdf8" fontSize="9" fontFamily="monospace" opacity="0.7">NEUTRAL CORONAL AXIS (0.0°)</text>

              {/* Torso Base */}
              <path d="M 140 150 Q 155 170 160 220 L 190 220 Q 185 170 170 150 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <circle cx="155" cy="150" r="5" fill="#64748b" /> {/* Acromion / Shoulder */}
              <text x="100" y="154" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">Shoulder (C7)</text>

              {/* Deformed Cervical Spine Curve based on tilt */}
              {(() => {
                const headCenterX = 160 + headTiltDeg * 1.5;
                const headCenterY = 70 + (headTiltDeg / 60) * 20;
                const spineControlX = 155 + headTiltDeg * 0.9;
                const spineControlY = 115;
                return (
                  <g>
                    {/* Spine Curve */}
                    <path
                      d={`M 155 150 Q ${spineControlX} ${spineControlY} ${headCenterX} ${headCenterY + 30}`}
                      fill="none"
                      stroke={headTiltDeg > 35 ? '#ef4444' : headTiltDeg > 15 ? '#f59e0b' : '#10b981'}
                      strokeWidth={4 + (cervicalLoadLbs / 60) * 4}
                      strokeLinecap="round"
                    />

                    {/* Forward translation distance vector */}
                    {headTiltDeg > 0 && (
                      <line
                        x1="160"
                        y1={headCenterY}
                        x2={headCenterX}
                        y2={headCenterY}
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Head Oval (Rotates with tilt) */}
                    <g transform={`rotate(${headTiltDeg * 0.7} ${headCenterX} ${headCenterY})`}>
                      <ellipse
                        cx={headCenterX}
                        cy={headCenterY}
                        rx="28"
                        ry="34"
                        fill="#334155"
                        stroke={headTiltDeg > 35 ? '#ef4444' : headTiltDeg > 15 ? '#f59e0b' : '#38bdf8'}
                        strokeWidth="2.5"
                      />
                      {/* Tragus / Ear landmark */}
                      <circle cx={headCenterX - 2} cy={headCenterY + 2} r="4" fill="#f59e0b" />
                      {/* Eyeline pointer */}
                      <line
                        x1={headCenterX + 16}
                        y1={headCenterY - 4}
                        x2={headCenterX + 35}
                        y2={headCenterY + 6}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    </g>

                    {/* Dynamic Annotation Box */}
                    <rect
                      x={Math.max(180, headCenterX + 38)}
                      y={headCenterY - 18}
                      width="90"
                      height="36"
                      rx="6"
                      fill="#0f172a"
                      stroke={headTiltDeg > 35 ? '#ef4444' : headTiltDeg > 15 ? '#f59e0b' : '#10b981'}
                      strokeWidth="1"
                    />
                    <text x={Math.max(180, headCenterX + 38) + 8} y={headCenterY - 4} fill="#f8fafc" fontSize="11" fontWeight="bold">
                      {cervicalLoadLbs} LBS LOAD
                    </text>
                    <text x={Math.max(180, headCenterX + 38) + 8} y={headCenterY + 10} fill="#94a3b8" fontSize="8">
                      +{forwardOffsetMm}mm Forward Shift
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Quick Human Analogy Badge */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-[11px] text-slate-200 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Felt Weight:{' '}
                <strong className="text-amber-300">
                  {headTiltDeg <= 5
                    ? 'Natural head weight (Bowling Ball)'
                    : headTiltDeg <= 20
                    ? 'Carrying a 2-year old toddler'
                    : headTiltDeg <= 40
                    ? 'Carrying a 5-year-old child (40 lbs)'
                    : 'Carrying a 50 lb bag of concrete'}
                </strong>
              </span>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 pt-1">
            {/* Slider 1: Forward Head Angle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  Simulated Forward Head Angle: <strong className="text-sky-300 font-mono text-sm">{headTiltDeg}°</strong>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Estimated CVA: <strong className={estimatedCvaDeg < 40 ? 'text-rose-400' : 'text-emerald-400'}>{estimatedCvaDeg}°</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={headTiltDeg}
                onChange={(e) => setHeadTiltDeg(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0° (Neutral / 12 lbs)</span>
                <span>15° (Mild / 27 lbs)</span>
                <span>30° (Moderate / 40 lbs)</span>
                <span>45° (Severe / 49 lbs)</span>
                <span>60° (Extreme / 60 lbs)</span>
              </div>
            </div>

            {/* Slider 2: Daily Hours at Desk */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Hours per Day in this Posture: <strong className="text-emerald-300 font-mono text-sm">{hoursPerDay} hrs</strong>
                </span>
                <span className="text-[11px] text-slate-400">
                  Excess Spinal Tension: <strong className="text-amber-400">~{dailySpinalEnergyExpenditureKcal} kcal/day</strong>
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Takeaway Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Cervical Force</div>
              <div className={`text-base font-bold font-mono ${cervicalLoadLbs > 35 ? 'text-rose-400' : 'text-sky-400'}`}>
                {cervicalLoadLbs} lbs
              </div>
              <div className="text-[9px] text-slate-500">
                {(cervicalLoadLbs / 12).toFixed(1)}x normal load
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Forward Drift</div>
              <div className="text-base font-bold font-mono text-amber-400">
                +{forwardOffsetMm} mm
              </div>
              <div className="text-[9px] text-slate-500">
                {(forwardOffsetMm / 25.4).toFixed(1)} inches forward
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">CVA Angle</div>
              <div className={`text-base font-bold font-mono ${estimatedCvaDeg < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {estimatedCvaDeg}°
              </div>
              <div className="text-[9px] text-slate-500">
                {estimatedCvaDeg >= 50 ? 'Optimal' : estimatedCvaDeg >= 40 ? 'Borderline' : 'Severe Deficit'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Muscle Impact & RULA Action Level Decoder (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Muscle Anatomy Impact Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Myofascial Strain Anatomy
              </h3>
              <span className="text-[10px] text-slate-400">Click muscle to inspect</span>
            </div>

            {/* Muscle selector pills */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'suboccipitals', label: 'Suboccipitals' },
                { id: 'upperTraps', label: 'Upper Trapezius' },
                { id: 'deepFlexors', label: 'Deep Neck Flexors' },
                { id: 'pectorals', label: 'Pectorals (Chest)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuscle(m.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                    selectedMuscle === m.id
                      ? 'bg-sky-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Active Muscle Explainer */}
            {muscleProfiles[selectedMuscle] && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">
                    {muscleProfiles[selectedMuscle].name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      muscleProfiles[selectedMuscle].status.includes('Hypertonic')
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {muscleProfiles[selectedMuscle].status}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {muscleProfiles[selectedMuscle].desc}
                </p>
                <div className="pt-2 border-t border-slate-900 space-y-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-semibold">Common Symptoms: </span>
                    <span className="text-rose-300">{muscleProfiles[selectedMuscle].symptoms}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Corrective Fix: </span>
                    <span className="text-emerald-300">{muscleProfiles[selectedMuscle].fix}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RULA Action Level Interactive Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                RULA Action Level Demystifier
              </h3>
              <span className="text-[10px] text-slate-400">ANSI / ISO 11226</span>
            </div>

            {/* RULA Level Tabs */}
            <div className="flex items-center gap-1">
              {[
                { level: 1, label: 'Score 1-2', title: 'Negligible' },
                { level: 2, label: 'Score 3-4', title: 'Low' },
                { level: 3, label: 'Score 5-6', title: 'Medium' },
                { level: 4, label: 'Score 7', title: 'Critical' },
              ].map((tab) => (
                <button
                  key={tab.level}
                  onClick={() => setActiveRulaTab(tab.level)}
                  className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-semibold text-center transition ${
                    activeRulaTab === tab.level
                      ? tab.level === 4
                        ? 'bg-rose-600 text-white shadow-sm'
                        : tab.level === 3
                        ? 'bg-amber-600 text-white shadow-sm'
                        : tab.level === 2
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{tab.label}</div>
                  <div className="text-[9px] opacity-80">{tab.title}</div>
                </button>
              ))}
            </div>

            {/* Content for Selected RULA Tab */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              {activeRulaTab === 1 && (
                <>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Action Level 1 (Scores 1 - 2): Acceptable Posture</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    The posture is biomechanically balanced with the head resting close to the gravitational plumb line (CVA &gt; 50°). Muscles function in dynamic equilibrium without localized ischemia.
                  </p>
                  <div className="text-[10px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-lg">
                    Recommendation: Maintain current monitor and chair heights. Take standard 5-minute movement micro-breaks every 50 minutes.
                  </div>
                </>
              )}

              {activeRulaTab === 2 && (
                <>
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <Info className="w-4 h-4" />
                    <span>Action Level 2 (Scores 3 - 4): Low Risk</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Mild forward head posture or slight wrist extension during typing. Changes may be required if posture is sustained for long periods (&gt; 4 hours/day).
                  </p>
                  <div className="text-[10px] text-sky-300 bg-sky-950/40 border border-sky-800/60 p-2 rounded-lg">
                    Recommendation: Raise monitor top to exact eye level and pull keyboard 2 inches closer to prevent elbow reach.
                  </div>
                </>
              )}

              {activeRulaTab === 3 && (
                <>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Action Level 3 (Scores 5 - 6): High Risk</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Significant cervical shearing strain (28-35 lbs) and thoracic kyphosis. Investigation and ergonomic corrections required soon to prevent chronic neck spasms.
                  </p>
                  <div className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-800/60 p-2 rounded-lg">
                    Recommendation: Deploy KinePost on-screen warnings. Add lumbar support cushion to prevent pelvis posterior tilt.
                  </div>
                </>
              )}

              {activeRulaTab === 4 && (
                <>
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Action Level 4 (Score 7): Critical Risk</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Severe biomechanical deficit: CVA &lt; 36°, forward head translation &gt; 4.5 cm, cervical load &gt; 38 lbs. Immediate intervention required to avert cervical disc herniation and nerve impingement.
                  </p>
                  <div className="text-[10px] text-rose-300 bg-rose-950/50 border border-rose-800/80 p-2 rounded-lg font-medium">
                    Recommendation: Stand up immediately. Perform 10 chin tucks and doorway chest stretches. Transition to standing desk or adjust laptop riser.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Golden Rules of Cam Sense & Ergonomic Calibration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              The 3 Golden Rules of Cam Sense Calibration
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            Current Stature: <strong className="text-sky-300">{heightProfile.heightFeet}'{heightProfile.heightInches}"</strong> ({heightProfile.heightCm} cm)
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center font-mono">
              01
            </div>
            <h4 className="font-bold text-slate-200">True 90° Lateral Sagittal Axis</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Position camera directly to the side of your desk (not diagonally). This ensures the Tragus (ear) and C7 (neck hinge) are tracked without parallax distortion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono">
              02
            </div>
            <h4 className="font-bold text-slate-200">Shoulder-Height Lens Horizon</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Set the camera lens at mid-torso or shoulder level. Angling from a high shelf or floor tilts the coronal plumb line and invalidates RULA vertical angles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center font-mono">
              03
            </div>
            <h4 className="font-bold text-slate-200">3 to 5 Feet Stature Framing</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Keep enough distance to frame from the crown of the head down to the hips and desk surface. This lets KinePost gauge desk height against your stature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
