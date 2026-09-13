export type CameraAnglePreset = 
  | 'auto'
  | 'sagittal_right'
  | 'sagittal_left'
  | 'anterior'
  | 'posterior'
  | 'oblique_45'
  | 'high_angle'
  | 'low_angle';

export type UserStance = 'seated' | 'standing' | 'perched' | 'dynamic';

export type WorkstationType = 
  | 'laptop'
  | 'external_monitor'
  | 'dual_monitor'
  | 'standing_desk'
  | 'tablet_phone';

export interface UserHeightProfile {
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  unit: 'cm' | 'in';
  workstationType: WorkstationType;
}

export const DEFAULT_HEIGHT_PROFILE: UserHeightProfile = {
  heightCm: 178,
  heightFeet: 5,
  heightInches: 10,
  unit: 'in',
  workstationType: 'laptop',
};

export interface AnthropometricErgonomics {
  userHeightCm: number;
  seatedPoplitealChairHeightCm: number; // ~0.25 * height
  seatedElbowDeskHeightCm: number;      // ~0.39 * height
  seatedEyeHeightFromFloorCm: number;   // ~0.68 * height
  recommendedMonitorTopHeightCm: number;
  recommendedViewingDistanceCm: number;
  // Imperial equivalents
  seatedPoplitealChairHeightIn: number;
  seatedElbowDeskHeightIn: number;
  seatedEyeHeightFromFloorIn: number;
  recommendedMonitorTopHeightIn: number;
  recommendedViewingDistanceIn: number;
  pixelToCmScaleMultiplier?: number;
}

export interface VideoSessionFrame {
  id: string;
  frameIndex: number;
  timestampSec: number;
  phaseLabel: string; // e.g. "0.0s Baseline", "4.5s Typing Reach", "9.0s Coding Slump", "14.0s Deep Fatigue"
  imageBase64: string;
  cvaDeg: number;
  cervicalLoadLbs: number;
  forwardHeadOffsetMm: number;
  landmarks?: SkeletalLandmark[];
  plumbLineIdealX?: number;
  slumpIndexScore: number; // 0 (perfect) to 100 (severe slump)
  rulaScore?: number; // 1-7 Rapid Upper Limb Assessment
}

export interface RulaAlertData {
  rulaScore: number;
  criticalThreshold: number;
  interpretation: string;
  phaseLabel?: string;
  timestampSec?: number;
  cervicalLoadLbs?: number;
  cvaDeg?: number;
  forwardHeadOffsetMm?: number;
  primaryRiskFactor?: string;
  source: 'live_video_stream' | 'video_sprint_processing' | 'keyframe_scrubber' | 'temporal_progression_scrubber' | 'manual_test' | 'ai_analysis';
  timestamp: string;
}

export interface TemporalProgression {
  totalDurationSeconds: number;
  frames: VideoSessionFrame[];
  slumpVelocityDegPerMinute: number;
  fatigueOnsetSecond: number;
  primaryDriftVector: string; // e.g. "Anterior Cranial Drift (-14° CVA) & Thoracic Flexion (+12°)"
  baselineCervicalLoadLbs: number;
  peakCervicalLoadLbs: number;
  codingFatigueSummary: string;
}

export type DifferentialSeverity = 'optimal' | 'mild' | 'moderate' | 'severe';

export interface PosturalDifferential {
  id: string;
  name: string;
  measuredValue: string;
  normativeValue: string;
  deviationDelta: string;
  severity: DifferentialSeverity;
  region: 'cervical' | 'thoracic' | 'lumbar' | 'pelvic' | 'shoulder' | 'kinetic_chain';
  biomechanicalImpact: string;
  plumbLineOffsetPercent?: number;
}

export interface SkeletalLandmark {
  name: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  confidence: number;
  differentialFlag?: boolean;
  label?: string;
  connectedTo?: string[];
}

export interface SlideItem {
  id: number;
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  category: 'spatial_calibration' | 'differential_breakdown' | 'kinetic_chain' | 'myofascial_balance' | 'corrective_protocols' | 'ergonomic_action';
  narrative: string;
  keyMetrics: Array<{
    label: string;
    value: string;
    status: 'good' | 'warning' | 'alert' | 'neutral';
  }>;
  bulletPoints: string[];
  visualType: 'spatial_3d' | 'plumb_line' | 'kinetic_flow' | 'muscle_map' | 'exercise_guide' | 'ergonomic_setup';
  callout: string;
}

export interface CorrectiveExercise {
  id: string;
  name: string;
  targetSyndrome: string;
  targetMuscles: string[];
  setsAndReps: string;
  tempo: string;
  instructions: string[];
  clinicalRationale: string;
  commonMistake: string;
}

export interface PosturalAnalysisResult {
  analysisId: string;
  timestamp: string;
  userHeightProfile?: UserHeightProfile;
  anthropometrics?: AnthropometricErgonomics;
  temporalProgression?: TemporalProgression;
  cameraPerspective: {
    viewAngle: string;
    estimatedCameraPitchDeg: number;
    spatialOrientationAssessment: string;
    environmentalLighting: string;
    confidenceScore: number;
  };
  clinicalClassification: {
    primarySyndrome: string;
    secondaryFindings: string[];
    rulaScore: number; // 1-7
    rulaInterpretation: string;
    rebaScore: number; // 1-15
    cervicalLoadEstimateLbs: number; // e.g. 12 lbs is baseline, 35+ lbs under forward head posture
  };
  differentials: PosturalDifferential[];
  myofascialProfile: {
    hypertonicMuscles: Array<{ name: string; impact: string }>;
    inhibitedMuscles: Array<{ name: string; impact: string }>;
  };
  skeletalLandmarks: SkeletalLandmark[];
  plumbLineReference: {
    idealX: number;
    coronalDeviations: Array<{ landmark: string; offsetMm: number }>;
  };
  slides: SlideItem[];
  recommendations: {
    immediateCues: string[];
    exercises: CorrectiveExercise[];
    workstationErgonomics: string[];
    timeSchedule: {
      postureBreakFrequency: string;
      dailyRoutine: string;
    };
  };
}

export interface AnalysisRequestPayload {
  imageBase64?: string;
  frames?: Array<{
    timestampSec: number;
    imageBase64: string;
    phaseLabel?: string;
  }>;
  anglePreset: CameraAnglePreset;
  userStance: UserStance;
  approxDistanceMeters?: number;
  durationInPostureSeconds?: number;
  userHeightCm?: number;
  userHeightUnit?: 'cm' | 'in';
  workstationType?: WorkstationType;
  userNotes?: string;
}
