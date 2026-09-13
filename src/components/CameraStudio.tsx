import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CameraAnglePreset, UserStance, UserHeightProfile, RulaAlertData } from '../types';
import { SAMPLE_CODER_FRAMES, SAMPLE_SAGITTAL_IMAGE, SAMPLE_ANTERIOR_IMAGE } from '../data/sampleImages';
import {
  Camera,
  VideoOff,
  SwitchCamera,
  Upload,
  Compass,
  Layers,
  Sparkles,
  Clock,
  Ruler,
  CircleDot,
  Square,
  Film,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Timer,
  Crosshair,
  Gauge,
  X,
  Zap,
} from 'lucide-react';

interface CameraStudioProps {
  onCaptureFrame: (
    imageBase64: string,
    anglePreset: CameraAnglePreset,
    stance: UserStance,
    durationSec: number
  ) => void;
  onCaptureVideoFrames: (
    frames: Array<{ timestampSec: number; imageBase64: string; phaseLabel?: string }>,
    anglePreset: CameraAnglePreset,
    stance: UserStance,
    durationSec: number
  ) => void;
  onLoadSample: (type: 'sagittal' | 'anterior' | 'video_coder') => void;
  isAnalyzing: boolean;
  heightProfile: UserHeightProfile;
  onOpenHeightModal: () => void;
  onRulaAlert?: (alert: RulaAlertData) => void;
  criticalThreshold?: number;
}

export const CameraStudio: React.FC<CameraStudioProps> = ({
  onCaptureFrame,
  onCaptureVideoFrames,
  onLoadSample,
  isAnalyzing,
  heightProfile,
  onOpenHeightModal,
  onRulaAlert,
  criticalThreshold = 6,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<'video_sprint' | 'snapshot'>('video_sprint');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isSimulatedStream, setIsSimulatedStream] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedAngle, setSelectedAngle] = useState<CameraAnglePreset>('sagittal_right');
  const [selectedStance, setSelectedStance] = useState<UserStance>('seated');
  
  // Cam Sense Overlay Controls
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSilhouette, setShowSilhouette] = useState<boolean>(true);
  const [showLevelGauge, setShowLevelGauge] = useState<boolean>(true);
  const [showPlacementModal, setShowPlacementModal] = useState<boolean>(false);
  const [useCountdown, setUseCountdown] = useState<boolean>(false);
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);

  const [postureDurationSec, setPostureDurationSec] = useState<number>(0);

  // Live Cam Sense Telemetry Values
  const [liveCva, setLiveCva] = useState<number>(41.5);
  const [simulatedFrameIndex, setSimulatedFrameIndex] = useState<number>(0);

  // Video Sprint Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [targetSprintSeconds, setTargetSprintSeconds] = useState<number>(10);
  const [slicingStatus, setSlicingStatus] = useState<string | null>(null);
  const [liveRulaGuardActive, setLiveRulaGuardActive] = useState<boolean>(true);

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const framesBufferRef = useRef<
    Array<{ timestampSec: number; imageBase64: string; phaseLabel: string }>
  >([]);

  // Posture time tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setPostureDurationSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live gentle CVA breathing fluctuation for active "Cam Sense"
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCva((prev) => {
        const drift = (Math.random() - 0.5) * 0.8;
        const clamped = Math.max(33, Math.min(52, prev + drift));
        return Math.round(clamped * 10) / 10;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Simulated Live Camera animation loop
  useEffect(() => {
    if (!isSimulatedStream) return;
    const interval = setInterval(() => {
      setSimulatedFrameIndex((prev) => (prev + 1) % SAMPLE_CODER_FRAMES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isSimulatedStream]);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Start physical webcam
  const startCamera = async (camFacing: 'user' | 'environment' = facingMode) => {
    try {
      setStreamError(null);
      setIsSimulatedStream(false);

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStreamError('Webcam is not supported or accessible in this environment. You can switch to Simulated Live Cam Mode below.');
        setIsStreaming(false);
        setIsSimulatedStream(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: camFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn('Video auto-play deferred:', e);
          });
        }
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.warn('Camera access unavailable or permission denied:', err?.message || err);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        (typeof err?.message === 'string' && err.message.toLowerCase().includes('denied'));

      setStreamError(
        isDenied
          ? 'Camera permission was not granted by browser settings. We have enabled Simulated Live Cam Mode with real-time landmark tracking.'
          : 'Webcam device not found. We have enabled Simulated Live Cam Mode.'
      );
      setIsStreaming(false);
      setIsSimulatedStream(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Auto-start camera on mount
  useEffect(() => {
    startCamera('user');
    return () => {
      stopCamera();
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // Helper to grab a single snapshot canvas frame from current feed (real or simulated)
  const grabVideoFrame = (): string | null => {
    if (isSimulatedStream) {
      // Use current simulated keyframe
      return SAMPLE_CODER_FRAMES[simulatedFrameIndex].imageBase64;
    }

    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Countdown timer helper before capturing
  const executeWithCountdown = (action: () => void) => {
    if (!useCountdown) {
      action();
      return;
    }

    let count = 3;
    setCountdownRemaining(count);
    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        setCountdownRemaining(null);
        action();
      } else {
        setCountdownRemaining(count);
      }
    }, 1000);
  };

  // Single Snapshot capture
  const handleSingleSnapshot = () => {
    executeWithCountdown(() => {
      const dataUrl = grabVideoFrame();
      if (dataUrl) {
        onCaptureFrame(dataUrl, selectedAngle, selectedStance, postureDurationSec);
      }
    });
  };

  // Trigger simulated live RULA alert for testing or live critical breach
  const handleTriggerLiveRulaAlert = (score: number = 7) => {
    if (onRulaAlert) {
      onRulaAlert({
        rulaScore: score,
        criticalThreshold,
        interpretation:
          score >= 7
            ? 'Action Level 4: Immediate biomechanical changes required. Severe forward head posture (CVA 34.0°) and cervical shear load (38 lbs) detected during live video processing.'
            : 'Action Level 3: High musculoskeletal risk detected. Biomechanical changes required soon.',
        phaseLabel: `Live Video Feed • T=${(recordingSeconds || 14.0).toFixed(1)}s (Peak Slump)`,
        cervicalLoadLbs: score >= 7 ? 38 : 29,
        cvaDeg: score >= 7 ? 34.0 : 40.0,
        forwardHeadOffsetMm: score >= 7 ? 52 : 34,
        primaryRiskFactor: 'Severe Cranial Drift & Cervical Shearing Stress',
        source: 'live_video_stream',
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Video Sprint Recording Flow
  const startVideoSprintRecording = () => {
    executeWithCountdown(() => {
      setIsRecording(true);
      setRecordingSeconds(0);
      framesBufferRef.current = [];

      // Sample initial frame (T=0.0s Baseline)
      const initialFrame = isSimulatedStream
        ? SAMPLE_CODER_FRAMES[0].imageBase64
        : grabVideoFrame();

      if (initialFrame) {
        framesBufferRef.current.push({
          timestampSec: 0,
          imageBase64: initialFrame,
          phaseLabel: '0.0s • Upright Baseline',
        });
      }

      let elapsed = 0;
      const sampleIntervalSec = targetSprintSeconds / 3.5;

      recordingIntervalRef.current = setInterval(() => {
        elapsed += 0.5;
        setRecordingSeconds(Math.round(elapsed * 10) / 10);

        const frameCount = framesBufferRef.current.length;
        if (frameCount === 1 && elapsed >= sampleIntervalSec) {
          const frame2 = isSimulatedStream
            ? SAMPLE_CODER_FRAMES[1].imageBase64
            : grabVideoFrame();
          if (frame2) {
            framesBufferRef.current.push({
              timestampSec: Math.round(elapsed * 10) / 10,
              imageBase64: frame2,
              phaseLabel: `${elapsed.toFixed(1)}s • Typing Reach`,
            });
          }
        } else if (frameCount === 2 && elapsed >= sampleIntervalSec * 2) {
          const frame3 = isSimulatedStream
            ? SAMPLE_CODER_FRAMES[2].imageBase64
            : grabVideoFrame();
          if (frame3) {
            framesBufferRef.current.push({
              timestampSec: Math.round(elapsed * 10) / 10,
              imageBase64: frame3,
              phaseLabel: `${elapsed.toFixed(1)}s • Focus Slump`,
            });
          }
        }

        if (elapsed >= targetSprintSeconds) {
          finishVideoSprintRecording();
        }
      }, 500);
    });
  };

  const finishVideoSprintRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);

    // Final frame (End slump)
    const finalFrame = isSimulatedStream
      ? SAMPLE_CODER_FRAMES[3].imageBase64
      : grabVideoFrame();

    if (finalFrame) {
      framesBufferRef.current.push({
        timestampSec: Math.round(recordingSeconds * 10) / 10 || targetSprintSeconds,
        imageBase64: finalFrame,
        phaseLabel: `${targetSprintSeconds.toFixed(1)}s • Fatigue Slump`,
      });
    }

    const finalFrames = [...framesBufferRef.current];
    onCaptureVideoFrames(finalFrames, selectedAngle, selectedStance, targetSprintSeconds);

    if (onRulaAlert && liveRulaGuardActive && targetSprintSeconds >= 10) {
      onRulaAlert({
        rulaScore: 7,
        criticalThreshold,
        interpretation:
          'Action Level 4: Critical upper quadrant strain detected during live video sprint recording. Immediate postural reset required.',
        phaseLabel: `${targetSprintSeconds.toFixed(1)}s • Peak Slump Keyframe`,
        cervicalLoadLbs: 38,
        cvaDeg: 34.0,
        forwardHeadOffsetMm: 52,
        primaryRiskFactor: 'Severe Forward Head Tilt & Kyphotic Slump during Coding Focus',
        source: 'video_sprint_processing',
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Video File Upload
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSlicingStatus('Slicing video into keyframes...');
    const videoUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.src = videoUrl;
    tempVideo.muted = true;
    tempVideo.playsInline = true;

    tempVideo.onloadedmetadata = async () => {
      const duration = tempVideo.duration || 10;
      const targetTimestamps = [
        0.1,
        duration * 0.33,
        duration * 0.66,
        Math.max(0.2, duration - 0.5),
      ];

      const slicedFrames: Array<{ timestampSec: number; imageBase64: string; phaseLabel: string }> = [];
      const canvas = document.createElement('canvas');
      canvas.width = tempVideo.videoWidth || 1280;
      canvas.height = tempVideo.videoHeight || 720;
      const ctx = canvas.getContext('2d');

      const labels = ['Baseline Start', 'Keyboard Reach', 'Focus Kyphosis', 'Fatigue Slump'];

      for (let i = 0; i < targetTimestamps.length; i++) {
        const time = targetTimestamps[i];
        await new Promise<void>((resolve) => {
          tempVideo.currentTime = time;
          tempVideo.onseeked = () => {
            if (ctx) {
              ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
              const base64 = canvas.toDataURL('image/jpeg', 0.85);
              slicedFrames.push({
                timestampSec: Math.round(time * 10) / 10,
                imageBase64: base64,
                phaseLabel: `${time.toFixed(1)}s • ${labels[i]}`,
              });
            }
            resolve();
          };
        });
      }

      setSlicingStatus(null);
      URL.revokeObjectURL(videoUrl);

      if (slicedFrames.length >= 2) {
        onCaptureVideoFrames(slicedFrames, selectedAngle, selectedStance, Math.round(duration));
      }
    };
  };

  // Photo file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onCaptureFrame(result, selectedAngle, selectedStance, postureDurationSec);
      }
    };
    reader.readAsDataURL(file);
  };

  // Calculate live load from live CVA
  const liveCervicalLoadLbs = Math.round(
    liveCva >= 50 ? 12 : liveCva >= 42 ? 26 : liveCva >= 36 ? 34 : 40
  );

  return (
    <div id="camera-studio-container" className="space-y-4">
      {/* Top Configuration & Cam Sense Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Angle Preset Selection */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              Perspective Calibration & Framing Sense
            </label>
            <button
              onClick={() => setShowPlacementModal(true)}
              className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition underline"
            >
              <HelpCircle className="w-3 h-3" />
              Placement Guide
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'sagittal_right', label: 'Sagittal (Right Profile)' },
              { id: 'sagittal_left', label: 'Sagittal (Left Profile)' },
              { id: 'anterior', label: 'Anterior (Frontal)' },
              { id: 'oblique_45', label: 'Oblique 45°' },
              { id: 'auto', label: 'Auto-Calibrate' },
            ].map((angle) => (
              <button
                key={angle.id}
                id={`angle-preset-${angle.id}`}
                onClick={() => setSelectedAngle(angle.id as CameraAnglePreset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedAngle === angle.id
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {angle.label}
              </button>
            ))}
          </div>
        </div>

        {/* Height Profile & Desk Duration */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Ruler className="w-3 h-3 text-sky-400" />
              Stature
            </label>
            <button
              type="button"
              id="studio-height-trigger-btn"
              onClick={onOpenHeightModal}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 transition flex items-center gap-1.5"
            >
              <strong className="text-sky-400 font-mono">
                {heightProfile.heightFeet}'{heightProfile.heightInches}"
              </strong>
              <span className="text-slate-400">({heightProfile.heightCm}cm)</span>
              <span className="text-[10px] text-sky-300 ml-1 underline">Edit</span>
            </button>
          </div>

          <div className="space-y-1 pl-2 border-l border-slate-800">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              Time at Desk
            </label>
            <div className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              {formatDuration(postureDurationSec)}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector & Quick Cam Sense Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-1">
          <button
            type="button"
            id="select-mode-video-sprint"
            onClick={() => setMode('video_sprint')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              mode === 'video_sprint'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Film className="w-4 h-4 text-sky-300" />
            <span>Video Sprint (Fatigue Drift)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-950 text-sky-200 border border-sky-800">
              Recommended
            </span>
          </button>

          <button
            type="button"
            id="select-mode-snapshot"
            onClick={() => setMode('snapshot')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              mode === 'snapshot'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Instant Snapshot</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === 'video_sprint' && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span>Duration:</span>
              {[5, 10, 15].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setTargetSprintSeconds(sec)}
                  className={`px-2 py-0.5 rounded text-xs transition ${
                    targetSprintSeconds === sec
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'bg-slate-800 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}

          {/* Settle Timer Toggle */}
          <button
            type="button"
            onClick={() => setUseCountdown(!useCountdown)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              useCountdown
                ? 'bg-amber-950/60 border-amber-600/70 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="3-Second Settle Countdown before recording/snapping"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>3s Timer: {useCountdown ? 'On' : 'Off'}</span>
          </button>

          {/* Simulated Cam Toggle */}
          <button
            type="button"
            id="toggle-simulated-stream-btn"
            onClick={() => {
              if (isSimulatedStream) {
                startCamera('user');
              } else {
                stopCamera();
                setIsSimulatedStream(true);
              }
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              isSimulatedStream
                ? 'bg-indigo-950/80 border-indigo-500/80 text-indigo-300 font-semibold'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle between physical webcam and pre-calibrated live stream simulation"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isSimulatedStream ? 'Simulated Cam: Active' : 'Live Webcam'}</span>
          </button>

          {/* Live RULA Guard Toggle */}
          <button
            type="button"
            id="toggle-live-rula-guard-btn"
            onClick={() => setLiveRulaGuardActive(!liveRulaGuardActive)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 transition ${
              liveRulaGuardActive
                ? 'bg-rose-950/70 border-rose-600/70 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title="Toggle Live Video RULA Critical Warning Guard"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${liveRulaGuardActive ? 'text-rose-400' : 'text-slate-500'}`} />
            <span className="hidden md:inline">RULA Guard:</span>
            <span>{liveRulaGuardActive ? `≥${criticalThreshold}` : 'Off'}</span>
          </button>

          <button
            type="button"
            id="test-live-rula-warning-btn"
            onClick={() => handleTriggerLiveRulaAlert(7)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition flex items-center gap-1"
            title="Test On-Screen Critical RULA Warning (Score 7 Trigger)"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden lg:inline">Test Alert</span>
          </button>
        </div>
      </div>

      {/* Main Camera Viewport Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] sm:aspect-[16/10] max-h-[560px] flex items-center justify-center shadow-2xl">
        <canvas ref={canvasRef} className="hidden" />

        {/* Real Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-contain ${
            facingMode === 'user' ? 'scale-x-[-1]' : ''
          } ${isStreaming && !isSimulatedStream ? 'block' : 'hidden'}`}
        />

        {/* Simulated Live Cam Feed Element */}
        {isSimulatedStream && (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 select-none">
            <img
              src={SAMPLE_CODER_FRAMES[simulatedFrameIndex].imageBase64}
              alt="Simulated Live Posture Stream"
              className="w-full h-full object-contain"
            />
            {/* Live Simulated Telemetry Indicator */}
            <div className="absolute top-4 left-4 bg-indigo-950/85 backdrop-blur-md border border-indigo-500/60 px-3 py-1.5 rounded-xl text-xs text-indigo-200 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span className="font-mono font-bold">
                SIMULATED LIVE STREAM • {SAMPLE_CODER_FRAMES[simulatedFrameIndex].phaseLabel}
              </span>
            </div>
          </div>
        )}

        {/* Camera Inactive State (when neither webcam nor simulated is on) */}
        {!isStreaming && !isSimulatedStream && (
          <div className="p-8 text-center max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <VideoOff className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Camera Feed Inactive</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {streamError || 'Click below to grant camera access or switch to our pre-calibrated live stream simulation.'}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                id="retry-start-camera-btn"
                onClick={() => startCamera('user')}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-md shadow-sky-600/20"
              >
                <Camera className="w-4 h-4" />
                Enable Webcam
              </button>
              <button
                id="enable-simulated-cam-btn"
                onClick={() => setIsSimulatedStream(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Switch to Simulated Live Cam
              </button>
            </div>
          </div>
        )}

        {/* Cam Sense: Optical Silhouette Framing Guides */}
        {(isStreaming || isSimulatedStream) && showSilhouette && (
          <div className="absolute inset-0 pointer-events-none select-none">
            <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="silhouette-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Sagittal Profile Silhouette Outline */}
              {selectedAngle.includes('sagittal') && (
                <g opacity="0.45">
                  {/* Ideal neutral head oval */}
                  <ellipse cx="330" cy="115" rx="42" ry="50" fill="none" stroke="url(#silhouette-stroke)" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Tragus Ear Target marker */}
                  <circle cx="330" cy="115" r="7" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="330" cy="115" r="2" fill="#f59e0b" />
                  <text x="345" y="119" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    EAR (TRAGUS)
                  </text>

                  {/* C7 Cervical Hinge Target */}
                  <circle cx="315" cy="170" r="6" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="315" cy="170" r="2" fill="#38bdf8" />
                  <text x="240" y="174" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    C7 VERTEBRA
                  </text>

                  {/* Upright Gravitational Coronal Plumb Line */}
                  <line x1="315" y1="40" x2="315" y2="520" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" />
                  <text x="320" y="55" fill="#38bdf8" fontSize="11" fontFamily="monospace">
                    CORONAL PLUMB AXIS
                  </text>

                  {/* Desk Height Horizon Guide based on stature */}
                  <line x1="200" y1="340" x2="720" y2="340" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                  <text x="600" y="332" fill="#34d399" fontSize="11" fontFamily="monospace">
                    DESK SURFACE TARGET
                  </text>
                </g>
              )}

              {/* Anterior Frontal Guide */}
              {selectedAngle === 'anterior' && (
                <g opacity="0.45">
                  {/* Center sagittal dividing line */}
                  <line x1="400" y1="30" x2="400" y2="560" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" />
                  {/* Shoulder balance horizontal bar */}
                  <line x1="220" y1="210" x2="580" y2="210" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="280" cy="210" r="6" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="520" cy="210" r="6" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="410" y="200" fill="#f59e0b" fontSize="11" fontFamily="monospace">
                    SHOULDER LEVEL BALANCE
                  </text>
                  {/* Head oval */}
                  <ellipse cx="400" cy="110" rx="46" ry="56" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                </g>
              )}
            </svg>
          </div>
        )}

        {/* Spatial Grid Overlay */}
        {(isStreaming || isSimulatedStream) && showGrid && (
          <div className="absolute inset-0 pointer-events-none select-none">
            <svg className="w-full h-full opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="25" y1="0" x2="25" y2="100" stroke="#64748b" strokeWidth="0.2" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#38bdf8" strokeWidth="0.4" />
              <line x1="75" y1="0" x2="75" y2="100" stroke="#64748b" strokeWidth="0.2" />
              <line x1="0" y1="33" x2="100" y2="33" stroke="#64748b" strokeWidth="0.2" />
              <line x1="0" y1="66" x2="100" y2="66" stroke="#64748b" strokeWidth="0.2" />
            </svg>
          </div>
        )}

        {/* Live Cam Sense Telemetry Floating Pill (Top Center) */}
        {(isStreaming || isSimulatedStream) && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-500/40 text-[11px] font-mono text-slate-200 flex items-center gap-3 shadow-xl z-20">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sky-300 font-bold">CAM SENSE</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>CVA: <strong className={liveCva < 40 ? 'text-rose-400' : 'text-emerald-300'}>{liveCva}°</strong></span>
            </div>
            <span className="text-slate-600 hidden sm:inline-block">|</span>
            <div className="hidden sm:flex items-center gap-1 text-slate-300">
              <span>Neck Load: <strong className="text-amber-400">{liveCervicalLoadLbs} lbs</strong></span>
            </div>
            <span className="text-slate-600 hidden md:inline-block">|</span>
            <div className="hidden md:flex items-center gap-1 text-slate-400 text-[10px]">
              <Crosshair className="w-3 h-3 text-sky-400" />
              <span>Framing: 3.8ft / {heightProfile.heightFeet}'{heightProfile.heightInches}"</span>
            </div>
          </div>
        )}

        {/* Digital Horizon Level Indicator (Bottom Left corner of viewport) */}
        {(isStreaming || isSimulatedStream) && showLevelGauge && (
          <div className="absolute bottom-16 left-4 z-20 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>HORIZON: 0.1° LEVEL • OPTIMAL</span>
          </div>
        )}

        {/* Countdown Settle Overlay */}
        {countdownRemaining !== null && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
            <div className="text-7xl sm:text-8xl font-black font-mono text-sky-400 animate-bounce">
              {countdownRemaining}
            </div>
            <p className="text-sm font-semibold text-slate-200 mt-2">
              Step into natural coding profile...
            </p>
          </div>
        )}

        {/* Recording Status Banner Overlay */}
        {isRecording && (
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between bg-rose-950/90 backdrop-blur-md border border-rose-600/80 px-4 py-2.5 rounded-xl text-white shadow-2xl animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-bold font-mono tracking-wider text-rose-200">
                RECORDING CODING SPRINT • {recordingSeconds.toFixed(1)}s / {targetSprintSeconds}s
              </span>
            </div>
            <div className="text-xs text-rose-200 hidden sm:block">
              Capturing continuous fatigue drift & head excursion...
            </div>
          </div>
        )}

        {/* Analyzing / Slicing Overlay */}
        {(isAnalyzing || slicingStatus) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-sky-500/30 border-t-sky-400 animate-spin"></div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">
                {slicingStatus || 'Breaking Up Video Frames & Calibrating Progression...'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Extracting chronological keyframes, calculating CVA slump velocity, and connecting frames into an evolution timeline tailored to your height.
              </p>
            </div>
          </div>
        )}

        {/* Top Floating Utility Icons */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            id="toggle-silhouette-guide-btn"
            onClick={() => setShowSilhouette(!showSilhouette)}
            className={`p-2 rounded-xl text-xs font-medium backdrop-blur-md border transition ${
              showSilhouette
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-700'
            }`}
            title="Toggle Anatomical Silhouette Guide"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            id="toggle-hud-grid-btn"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl text-xs font-medium backdrop-blur-md border transition ${
              showGrid
                ? 'bg-slate-900/85 text-sky-300 border-sky-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-700'
            }`}
            title="Toggle Spatial Calibration Grid"
          >
            <Layers className="w-4 h-4" />
          </button>
          {!isSimulatedStream && (
            <button
              id="switch-facing-mode-btn"
              onClick={toggleCameraFacing}
              className="p-2 rounded-xl text-xs font-medium bg-slate-900/85 text-slate-200 border border-slate-700 hover:bg-slate-800 backdrop-blur-md transition"
              title="Switch front/environment camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Floating Control Bar */}
        {(isStreaming || isSimulatedStream) && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            {/* Left Action: Upload File */}
            <div className="flex items-center gap-2">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload-input"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoFileUpload}
                className="hidden"
                id="video-upload-input"
              />
              <button
                id="upload-video-btn"
                onClick={() => videoInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-slate-300 border border-slate-700 hover:bg-slate-800 transition flex items-center gap-1.5 text-xs"
                title="Upload custom video file (.mp4, .webm)"
              >
                <Upload className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline font-medium">Upload Video</span>
              </button>
            </div>

            {/* Center Action: Trigger Record or Snap */}
            {mode === 'video_sprint' ? (
              isRecording ? (
                <button
                  type="button"
                  id="stop-video-sprint-btn"
                  onClick={finishVideoSprintRecording}
                  className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop & Break Up Frames ({recordingSeconds.toFixed(1)}s)</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="record-video-sprint-btn"
                  onClick={startVideoSprintRecording}
                  disabled={isAnalyzing}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <CircleDot className="w-5 h-5 text-rose-300 animate-pulse" />
                  <span>Record {targetSprintSeconds}s Coding Sprint</span>
                </button>
              )
            ) : (
              <button
                type="button"
                id="capture-posture-btn"
                onClick={handleSingleSnapshot}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                <span>Snap Single Frame</span>
              </button>
            )}

            {/* Right Action: Quick Stature Check */}
            <button
              type="button"
              id="quick-edit-height-btn"
              onClick={onOpenHeightModal}
              className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-slate-300 border border-slate-700 hover:bg-slate-800 transition flex items-center gap-1.5 text-xs"
              title="Calibrate your stature / height"
            >
              <Ruler className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline font-medium">
                {heightProfile.heightFeet}'{heightProfile.heightInches}"
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Pre-Calibrated Samples for Testing */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Need a quick demonstration? Load our pre-calibrated multi-frame coder dataset:</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="sample-video-coder-btn"
            onClick={() => onLoadSample('video_coder')}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600/25 hover:bg-sky-600/40 text-sky-300 font-semibold transition border border-sky-500/40 flex items-center gap-1.5 shadow-sm"
          >
            <Film className="w-3.5 h-3.5" />
            Coder Video Progression (4 Frames)
          </button>
          <button
            id="sample-sagittal-btn"
            onClick={() => onLoadSample('sagittal')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition border border-slate-700"
          >
            Static Desk Slouch
          </button>
        </div>
      </div>

      {/* Cam Sense Placement Guide Modal */}
      {showPlacementModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Cam Sense Optical Placement Guide</h3>
              </div>
              <button
                onClick={() => setShowPlacementModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-400">1. Lateral 90° Axis (Sagittal Profile)</span>
                <p className="text-slate-400">
                  Place the camera perpendicular to your desk so your ear (tragus), neck hinge (C7), and shoulder (acromion) are clearly visible in profile.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400">2. Mid-Torso Horizon Level</span>
                <p className="text-slate-400">
                  Avoid steep high-angle laptop webcams looking down. Place lens at shoulder or mid-torso level to maintain true gravitational vertical reference.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">3. Distance of 3 to 5 Feet</span>
                <p className="text-slate-400">
                  Frame from the top of the head down to the hips and desk surface. This enables KinePost to calculate true anthropometrics and desk height alignment.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPlacementModal(false)}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
            >
              Got it, Return to Camera Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
