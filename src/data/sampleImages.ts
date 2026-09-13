// Generates clean SVG anatomical subject image data URIs for sample case studies

export const SAMPLE_SAGITTAL_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background-color: #0b1120;">
  <!-- Workspace desk & chair representation -->
  <rect x="420" y="320" width="360" height="18" fill="#1e293b" rx="4"/>
  <rect x="520" y="338" width="20" height="240" fill="#334155"/>
  <!-- Task monitor -->
  <rect x="620" y="160" width="22" height="160" fill="#38bdf8" opacity="0.85" rx="3"/>
  <rect x="630" y="240" width="80" height="10" fill="#475569"/>
  <!-- Seated Subject Silhouette (Slouched Desk Posture with Forward Head) -->
  <g fill="#334155" stroke="#64748b" stroke-width="2">
    <!-- Head tilted forward -->
    <ellipse cx="340" cy="110" rx="38" ry="46" fill="#475569" stroke="#94a3b8"/>
    <!-- Face profile line -->
    <path d="M 365 105 Q 380 115 368 128 Q 375 140 360 148 L 340 155" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Ear (Tragus) marker target -->
    <circle cx="336" cy="112" r="5" fill="#f59e0b"/>
    <!-- Cervical spine forward curve -->
    <path d="M 330 150 Q 315 170 305 200" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="2 2"/>
    <!-- Torso / Kyphotic spine -->
    <path d="M 305 200 Q 255 260 295 380 L 320 385 Q 340 280 325 200 Z" fill="#334155"/>
    <!-- Arm reaching forward toward keyboard -->
    <path d="M 300 205 Q 350 310 440 320 L 480 320" fill="none" stroke="#475569" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Forearm and hand on desk -->
    <circle cx="485" cy="320" r="10" fill="#64748b"/>
    <!-- Thigh (Seated horizontal) -->
    <rect x="290" y="375" width="165" height="35" rx="14" fill="#1e293b" stroke="#334155"/>
    <!-- Lower leg down to floor -->
    <rect x="420" y="390" width="32" height="175" rx="12" fill="#1e293b" stroke="#334155"/>
    <!-- Foot -->
    <path d="M 420 565 L 480 565 L 475 550 L 420 550 Z" fill="#334155"/>
    <!-- Task Chair Base -->
    <rect x="250" y="395" width="140" height="15" fill="#0f172a" rx="4"/>
    <rect x="315" y="410" width="16" height="140" fill="#1e293b"/>
  </g>
</svg>
`)}`;

export const SAMPLE_ANTERIOR_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background-color: #0b1120;">
  <!-- Symmetrical Coronal Frame with Asymmetric Right Shoulder Drop -->
  <g fill="#334155" stroke="#64748b" stroke-width="2">
    <!-- Head slightly tilted left -->
    <ellipse cx="400" cy="95" rx="45" ry="55" fill="#475569" transform="rotate(-4.8 400 95)"/>
    <!-- Ears -->
    <circle cx="355" cy="115" r="4.5" fill="#f59e0b"/>
    <circle cx="445" cy="102" r="4.5" fill="#f59e0b"/>
    <!-- Neck -->
    <path d="M 380 145 L 375 190 L 425 180 L 420 145 Z" fill="#334155"/>
    <!-- Asymmetric Shoulders (Right Elevated) -->
    <path d="M 270 205 Q 350 185 400 185 Q 450 170 530 180 L 515 360 L 285 360 Z" fill="#1e293b" stroke="#475569"/>
    <!-- Acromion markers -->
    <circle cx="272" cy="204" r="6" fill="#10b981"/>
    <circle cx="528" cy="180" r="6" fill="#ef4444"/>
    <!-- Torso and Pelvis -->
    <rect x="330" y="360" width="140" height="180" rx="10" fill="#334155"/>
  </g>
</svg>
`)}`;

// 4-Frame Temporal Progression of a Coder Sprint:
// Frame 1: 0.0s Neutral Baseline (Upright, Ear above shoulder)
export const SAMPLE_CODER_FRAME_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background-color: #0b1120;">
  <!-- Timestamp Badge -->
  <rect x="20" y="20" width="160" height="32" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
  <text x="32" y="41" fill="#34d399" font-size="13" font-family="monospace" font-weight="bold">T=0.0s • BASELINE</text>
  <!-- Workspace -->
  <rect x="440" y="330" width="340" height="18" fill="#1e293b" rx="4"/>
  <rect x="640" y="160" width="22" height="170" fill="#38bdf8" opacity="0.85" rx="3"/>
  <!-- Upright Seated Subject -->
  <g fill="#334155" stroke="#64748b" stroke-width="2">
    <!-- Head aligned vertically with spine -->
    <ellipse cx="305" cy="100" rx="38" ry="46" fill="#475569" stroke="#94a3b8"/>
    <circle cx="304" cy="102" r="5" fill="#10b981"/>
    <!-- Torso upright ~92° -->
    <path d="M 305 146 L 295 385 L 325 385 L 320 150 Z" fill="#334155"/>
    <!-- Arm poised near keyboard -->
    <path d="M 305 180 Q 320 280 430 325" fill="none" stroke="#475569" stroke-width="16" stroke-linecap="round"/>
    <circle cx="435" cy="325" r="9" fill="#64748b"/>
    <!-- Thigh & Legs -->
    <rect x="290" y="380" width="165" height="35" rx="14" fill="#1e293b"/>
    <rect x="420" y="395" width="32" height="170" rx="12" fill="#1e293b"/>
    <rect x="250" y="400" width="140" height="15" fill="#0f172a"/>
  </g>
</svg>
`)}`;

// Frame 2: 4.5s Keyboard Reaching (Slight forward lean, hands resting on keyboard)
export const SAMPLE_CODER_FRAME_2 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background-color: #0b1120;">
  <!-- Timestamp Badge -->
  <rect x="20" y="20" width="180" height="32" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="32" y="41" fill="#38bdf8" font-size="13" font-family="monospace" font-weight="bold">T=4.5s • TYPING REACH</text>
  <!-- Workspace -->
  <rect x="440" y="330" width="340" height="18" fill="#1e293b" rx="4"/>
  <rect x="640" y="160" width="22" height="170" fill="#38bdf8" opacity="0.85" rx="3"/>
  <!-- Slight Forward Shift -->
  <g fill="#334155" stroke="#64748b" stroke-width="2">
    <!-- Head drifting slightly forward -->
    <ellipse cx="322" cy="105" rx="38" ry="46" fill="#475569" stroke="#94a3b8"/>
    <circle cx="320" cy="107" r="5" fill="#38bdf8"/>
    <!-- Torso starting slight 6° forward lean -->
    <path d="M 315 150 Q 295 260 295 385 L 325 385 Q 330 260 325 152 Z" fill="#334155"/>
    <path d="M 310 185 Q 340 290 445 328" fill="none" stroke="#475569" stroke-width="16" stroke-linecap="round"/>
    <circle cx="450" cy="328" r="9" fill="#64748b"/>
    <rect x="290" y="380" width="165" height="35" rx="14" fill="#1e293b"/>
    <rect x="420" y="395" width="32" height="170" rx="12" fill="#1e293b"/>
    <rect x="250" y="400" width="140" height="15" fill="#0f172a"/>
  </g>
</svg>
`)}`;

// Frame 3: 9.0s Deep Focus Slump (Chin pokes forward, thoracic kyphosis starts rounding)
export const SAMPLE_CODER_FRAME_3 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background-color: #0b1120;">
  <!-- Timestamp Badge -->
  <rect x="20" y="20" width="200" height="32" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="32" y="41" fill="#fbbf24" font-size="13" font-family="monospace" font-weight="bold">T=9.0s • FOCUS SLUMP</text>
  <!-- Workspace -->
  <rect x="440" y="330" width="340" height="18" fill="#1e293b" rx="4"/>
  <rect x="640" y="160" width="22" height="170" fill="#38bdf8" opacity="0.85" rx="3"/>
  <!-- Focus Slump -->
  <g fill="#334155" stroke="#64748b" stroke-width="2">
    <!-- Head translated anteriorly -->
    <ellipse cx="342" cy="112" rx="38" ry="46" fill="#475569" stroke="#94a3b8"/>
    <circle cx="338" cy="114" r="5" fill="#f59e0b"/>
    <!-- Kyphotic C-curve spine -->
    <path d="M 325 155 Q 275 250 295 385 L 322 385 Q 338 270 330 156 Z" fill="#334155"/>
    <path d="M 305 195 Q 350 300 460 328" fill="none" stroke="#475569" stroke-width="16" stroke-linecap="round"/>
    <circle cx="465" cy="328" r="9" fill="#64748b"/>
    <rect x="290" y="380" width="165" height="35" rx="14" fill="#1e293b"/>
    <rect x="420" y="395" width="32" height="170" rx="12" fill="#1e293b"/>
    <rect x="250" y="400" width="140" height="15" fill="#0f172a"/>
  </g>
</svg>
`)}`;

// Frame 4: 14.0s Deep Fatigue "Turtle Neck" Collapse (Max forward head, CVA drops to 34°)
export const SAMPLE_CODER_FRAME_4 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background-color: #0b1120;">
  <!-- Timestamp Badge -->
  <rect x="20" y="20" width="210" height="32" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>
  <text x="32" y="41" fill="#f87171" font-size="13" font-family="monospace" font-weight="bold">T=14.0s • DEEP SLUMP</text>
  <!-- Workspace -->
  <rect x="440" y="330" width="340" height="18" fill="#1e293b" rx="4"/>
  <rect x="640" y="160" width="22" height="170" fill="#38bdf8" opacity="0.85" rx="3"/>
  <!-- Severe Slump -->
  <g fill="#334155" stroke="#64748b" stroke-width="2">
    <!-- Chin craning toward screen -->
    <ellipse cx="365" cy="120" rx="38" ry="46" fill="#475569" stroke="#ef4444"/>
    <circle cx="362" cy="122" r="5" fill="#ef4444"/>
    <!-- Excessive Kyphosis -->
    <path d="M 335 160 Q 255 250 295 385 L 320 385 Q 345 280 338 162 Z" fill="#334155"/>
    <path d="M 300 205 Q 360 305 475 328" fill="none" stroke="#475569" stroke-width="16" stroke-linecap="round"/>
    <circle cx="480" cy="328" r="9" fill="#ef4444"/>
    <rect x="290" y="380" width="165" height="35" rx="14" fill="#1e293b"/>
    <rect x="420" y="395" width="32" height="170" rx="12" fill="#1e293b"/>
    <rect x="250" y="400" width="140" height="15" fill="#0f172a"/>
  </g>
</svg>
`)}`;

export const SAMPLE_CODER_FRAMES = [
  { timestampSec: 0.0, imageBase64: SAMPLE_CODER_FRAME_1, phaseLabel: '0.0s • Baseline (Neutral)' },
  { timestampSec: 4.5, imageBase64: SAMPLE_CODER_FRAME_2, phaseLabel: '4.5s • Typing Reach (Mild Drift)' },
  { timestampSec: 9.0, imageBase64: SAMPLE_CODER_FRAME_3, phaseLabel: '9.0s • Focus Slump (Moderate)' },
  { timestampSec: 14.0, imageBase64: SAMPLE_CODER_FRAME_4, phaseLabel: '14.0s • Deep Slump (Severe)' },
];


