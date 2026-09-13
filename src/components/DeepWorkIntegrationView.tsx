import React, { useState } from 'react';
import {
  Code,
  Laptop,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu,
  Video,
  BellRing,
  ExternalLink,
  Terminal,
  GitBranch,
} from 'lucide-react';
import { RulaAlertData, UserHeightProfile } from '../types';

interface DeepWorkIntegrationViewProps {
  heightProfile: UserHeightProfile;
  criticalThreshold: number;
  onTriggerTestAlert: () => void;
}

export const DeepWorkIntegrationView: React.FC<DeepWorkIntegrationViewProps> = ({
  heightProfile,
  criticalThreshold,
  onTriggerTestAlert,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyCode = (codeText: string, snippetId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSnippet(snippetId);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const codeSnippet1 = `// 1. Import KinePost CameraStudio & RULA Guard into Deep Work Assistant Session View
import { CameraStudio } from './components/CameraStudio';
import { RulaWarningNotification } from './components/RulaWarningNotification';
import { calculateAnthropometrics } from './utils/ergonomics';

export function DeepWorkFocusSession() {
  const [rulaAlert, setRulaAlert] = useState<RulaAlertData | null>(null);
  const [isFocusTimerActive, setIsFocusTimerActive] = useState(true);

  // When posture degradation breaches RULA critical threshold (e.g. >= 6)
  const handleRulaAlert = (alert: RulaAlertData) => {
    setRulaAlert(alert);
    // Optionally pause Deep Work Pomodoro timer or prompt stretch break
    if (alert.rulaScore >= 6) {
      setIsFocusTimerActive(false);
    }
  };

  return (
    <div className="deep-work-layout">
      <CameraStudio 
        onRulaAlert={handleRulaAlert}
        criticalThreshold={${criticalThreshold}}
        heightProfile={${JSON.stringify({
          heightCm: heightProfile.heightCm,
          workstationType: heightProfile.workstationType,
        })} }
      />
      {rulaAlert && (
        <RulaWarningNotification 
          alert={rulaAlert} 
          onDismiss={() => setRulaAlert(null)}
          onSnooze={(mins) => { setRulaAlert(null); setIsFocusTimerActive(true); }}
        />
      )}
    </div>
  );
}`;

  const codeSnippet2 = `// 2. Server-side POST /api/analyze-posture endpoint integration for Deep Work AI Vision
app.post('/api/analyze-posture', async (req, res) => {
  const { imageBase64, anglePreset, userStance, durationInPostureSeconds } = req.body;
  
  // Call Gemini 2.5 Flash / Pro Vision API with ANSI/HFES 100 clinical prompt
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { text: "Analyze posture for ANSI/HFES 100 RULA score, cervical load, CVA angle..." },
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
    ],
    config: { responseMimeType: 'application/json' }
  });

  res.json(JSON.parse(response.text()));
});`;

  return (
    <div id="deep-work-integration-view" className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GitBranch className="w-48 h-48 text-sky-400" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-mono font-bold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Repository Integration: hermz580 / deep-work-assistant
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            KinePost as the Real-Time Camera Posture & Ergonomic Guardian
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            This module integrates KinePost's multi-frame video kinematics, AI anatomical landmarking, and ANSI/HFES 100 RULA risk scoring directly into your <span className="text-sky-300 font-semibold">Deep Work Assistant</span> repository without modifying or disrupting existing focus timers or task management workflows.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <a
              href="https://github.com/hermz580/deep-work-assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition shadow"
            >
              <ExternalLink className="w-4 h-4 text-sky-400" />
              <span>View deep-work-assistant Repo</span>
            </a>
            <button
              type="button"
              id="test-integration-alert-btn"
              onClick={onTriggerTestAlert}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
            >
              <BellRing className="w-4 h-4" />
              <span>Test Live Posture Warning Trigger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integration Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              1. Camera & Sprint Capture
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Drop <code className="text-sky-300 font-mono">CameraStudio.tsx</code> into your deep work session view. It monitors continuous coder posture via webcam feed or records timed video sprints (5s, 10s, 15s) to detect slump decay during intense coding blocks.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero impact on focus timers</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              2. Real-Time RULA Guardian
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              When the AI computer vision detects a critical RULA score (e.g. <span className="font-mono text-rose-300">≥{criticalThreshold}</span>), <code className="text-rose-300 font-mono">RulaWarningNotification</code> triggers an on-screen alert, cervical load estimate (lbs), and prompts a structured micro-break.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>ANSI/HFES 100 compliance</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              3. Anthropometric State Sync
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Synchronize user height profile ({heightProfile.heightFeet}'{heightProfile.heightInches}") with deep work user settings to automatically compute optimal desk height, monitor eye-level offset, and keyboard tilt.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Calibrated for {heightProfile.heightCm}cm stature</span>
          </div>
        </div>
      </div>

      {/* Code Wiring & Architecture Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-1 flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              IMPLEMENTATION BLUEPRINT
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Wiring KinePost into `deep-work-assistant`
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            TypeScript + React 19 + Express
          </span>
        </div>

        {/* Snippet 1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Component Integration (Client Side)</span>
            <button
              type="button"
              onClick={() => copyCode(codeSnippet1, 'snippet1')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 transition flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" />
              <span>{copiedSnippet === 'snippet1' ? 'Copied to Clipboard!' : 'Copy Snippet'}</span>
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed">
            <pre>{codeSnippet1}</pre>
          </div>
        </div>

        {/* Snippet 2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Server Proxy Route Integration (Backend Express API)</span>
            <button
              type="button"
              onClick={() => copyCode(codeSnippet2, 'snippet2')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 transition flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" />
              <span>{copiedSnippet === 'snippet2' ? 'Copied to Clipboard!' : 'Copy Snippet'}</span>
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed">
            <pre>{codeSnippet2}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
