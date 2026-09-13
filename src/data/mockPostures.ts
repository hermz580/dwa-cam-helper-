import { PosturalAnalysisResult } from '../types';
import {
  SAMPLE_CODER_FRAME_1,
  SAMPLE_CODER_FRAME_2,
  SAMPLE_CODER_FRAME_3,
  SAMPLE_CODER_FRAME_4,
} from './sampleImages';
import { calculateAnthropometrics } from '../utils/ergonomics';

export const SAMPLE_ANALYSIS_SAGITTAL: PosturalAnalysisResult = {
  analysisId: 'kine-sample-sagittal-001',
  timestamp: new Date().toISOString(),
  userHeightProfile: {
    heightCm: 178,
    heightFeet: 5,
    heightInches: 10,
    unit: 'in',
    workstationType: 'laptop',
  },
  anthropometrics: calculateAnthropometrics(178),
  temporalProgression: {
    totalDurationSeconds: 14.0,
    slumpVelocityDegPerMinute: -78.0, // High rate of postural decay during coding sprint
    fatigueOnsetSecond: 4.5,
    primaryDriftVector: 'Anterior Cranial Drift (-14.0° CVA) & Thoracic Flexion (+12.0°)',
    baselineCervicalLoadLbs: 12,
    peakCervicalLoadLbs: 38,
    codingFatigueSummary: 'Coder starts upright with aligned spine (T=0s), but within 4.5 seconds reaches toward keyboard and within 9.0s collapses into a forward head posture. By 14s, cervical shear load surges from 12 lbs to 38 lbs as gaze fixes on editor code.',
    frames: [
      {
        id: 'frame-0',
        frameIndex: 0,
        timestampSec: 0.0,
        phaseLabel: '0.0s • Upright Baseline',
        imageBase64: SAMPLE_CODER_FRAME_1,
        cvaDeg: 52.0,
        cervicalLoadLbs: 12,
        forwardHeadOffsetMm: 4,
        plumbLineIdealX: 38,
        slumpIndexScore: 8,
        rulaScore: 2,
        landmarks: [
          { name: 'Tragus (Ear)', x: 38, y: 17, confidence: 0.96, differentialFlag: false, label: 'Tragus (Neutral)' },
          { name: 'C7 Spinous Process', x: 38, y: 24, confidence: 0.95, differentialFlag: false, label: 'C7 Landmark' },
          { name: 'Acromion (Shoulder)', x: 38, y: 30, confidence: 0.95, differentialFlag: false, label: 'Acromion' },
          { name: 'Lateral Epicondyle', x: 42, y: 45, confidence: 0.92, differentialFlag: false, label: 'Elbow' },
          { name: 'Wrist', x: 54, y: 54, confidence: 0.90, differentialFlag: false, label: 'Wrist' },
          { name: 'Thoracic Apex (T7)', x: 38, y: 42, confidence: 0.93, differentialFlag: false, label: 'T7 Neutral' },
          { name: 'Greater Trochanter', x: 38, y: 64, confidence: 0.95, differentialFlag: false, label: 'Hip' },
          { name: 'Knee', x: 53, y: 65, confidence: 0.94, differentialFlag: false, label: 'Knee' },
          { name: 'Ankle', x: 53, y: 92, confidence: 0.95, differentialFlag: false, label: 'Ankle' },
        ],
      },
      {
        id: 'frame-1',
        frameIndex: 1,
        timestampSec: 4.5,
        phaseLabel: '4.5s • Typing Reach',
        imageBase64: SAMPLE_CODER_FRAME_2,
        cvaDeg: 46.5,
        cervicalLoadLbs: 19,
        forwardHeadOffsetMm: 18,
        plumbLineIdealX: 38,
        slumpIndexScore: 32,
        rulaScore: 4,
        landmarks: [
          { name: 'Tragus (Ear)', x: 40, y: 18, confidence: 0.95, differentialFlag: true, label: 'Tragus (+1.8cm)' },
          { name: 'C7 Spinous Process', x: 39, y: 25, confidence: 0.93, differentialFlag: false, label: 'C7 Landmark' },
          { name: 'Acromion (Shoulder)', x: 38, y: 31, confidence: 0.94, differentialFlag: false, label: 'Acromion' },
          { name: 'Lateral Epicondyle', x: 44, y: 46, confidence: 0.91, differentialFlag: false, label: 'Elbow' },
          { name: 'Wrist', x: 56, y: 55, confidence: 0.90, differentialFlag: false, label: 'Wrist' },
          { name: 'Thoracic Apex (T7)', x: 37, y: 43, confidence: 0.92, differentialFlag: false, label: 'T7' },
          { name: 'Greater Trochanter', x: 38, y: 64, confidence: 0.95, differentialFlag: false, label: 'Hip' },
          { name: 'Knee', x: 53, y: 65, confidence: 0.94, differentialFlag: false, label: 'Knee' },
          { name: 'Ankle', x: 53, y: 92, confidence: 0.95, differentialFlag: false, label: 'Ankle' },
        ],
      },
      {
        id: 'frame-2',
        frameIndex: 2,
        timestampSec: 9.0,
        phaseLabel: '9.0s • Focus Slump',
        imageBase64: SAMPLE_CODER_FRAME_3,
        cvaDeg: 40.0,
        cervicalLoadLbs: 29,
        forwardHeadOffsetMm: 34,
        plumbLineIdealX: 38,
        slumpIndexScore: 68,
        rulaScore: 6,
        landmarks: [
          { name: 'Tragus (Ear)', x: 42, y: 19, confidence: 0.95, differentialFlag: true, label: 'Tragus (+3.4cm)' },
          { name: 'C7 Spinous Process', x: 40, y: 26, confidence: 0.93, differentialFlag: false, label: 'C7 Landmark' },
          { name: 'Acromion (Shoulder)', x: 38, y: 32, confidence: 0.94, differentialFlag: false, label: 'Acromion' },
          { name: 'Lateral Epicondyle', x: 46, y: 48, confidence: 0.91, differentialFlag: false, label: 'Elbow' },
          { name: 'Wrist', x: 58, y: 55, confidence: 0.90, differentialFlag: false, label: 'Wrist' },
          { name: 'Thoracic Apex (T7)', x: 35, y: 44, confidence: 0.92, differentialFlag: true, label: 'T7 Kyphotic' },
          { name: 'Greater Trochanter', x: 38, y: 64, confidence: 0.95, differentialFlag: false, label: 'Hip' },
          { name: 'Knee', x: 53, y: 65, confidence: 0.94, differentialFlag: false, label: 'Knee' },
          { name: 'Ankle', x: 53, y: 92, confidence: 0.95, differentialFlag: false, label: 'Ankle' },
        ],
      },
      {
        id: 'frame-3',
        frameIndex: 3,
        timestampSec: 14.0,
        phaseLabel: '14.0s • Deep Slump',
        imageBase64: SAMPLE_CODER_FRAME_4,
        cvaDeg: 34.0,
        cervicalLoadLbs: 38,
        forwardHeadOffsetMm: 52,
        plumbLineIdealX: 38,
        slumpIndexScore: 94,
        rulaScore: 7,
        landmarks: [
          { name: 'Tragus (Ear)', x: 45, y: 20, confidence: 0.96, differentialFlag: true, label: 'Tragus (+5.2cm Ant.)' },
          { name: 'C7 Spinous Process', x: 41, y: 27, confidence: 0.93, differentialFlag: false, label: 'C7 Landmark' },
          { name: 'Acromion (Shoulder)', x: 38, y: 34, confidence: 0.94, differentialFlag: true, label: 'Acromion' },
          { name: 'Lateral Epicondyle', x: 48, y: 50, confidence: 0.91, differentialFlag: false, label: 'Elbow' },
          { name: 'Wrist', x: 60, y: 55, confidence: 0.90, differentialFlag: false, label: 'Wrist' },
          { name: 'Thoracic Apex (T7)', x: 33, y: 45, confidence: 0.92, differentialFlag: true, label: 'T7 Severe Kyphosis' },
          { name: 'Greater Trochanter', x: 38, y: 64, confidence: 0.95, differentialFlag: false, label: 'Hip' },
          { name: 'Knee', x: 53, y: 65, confidence: 0.94, differentialFlag: false, label: 'Knee' },
          { name: 'Ankle', x: 53, y: 92, confidence: 0.95, differentialFlag: false, label: 'Ankle' },
        ],
      },
    ],
  },
  cameraPerspective: {
    viewAngle: 'Sagittal (Right Lateral Profile)',
    estimatedCameraPitchDeg: 14,
    spatialOrientationAssessment: 'Desk-level perspective elevated ~14° above horizontal plane. User seated in task chair with forward torso inclination relative to desk surface.',
    environmentalLighting: 'Diffused frontal office lighting with mild shadow casting along posterior cervical spine.',
    confidenceScore: 94,
  },
  clinicalClassification: {
    primarySyndrome: 'Upper Crossed Syndrome (Janda Stage II) with Cervical Hyperextension',
    secondaryFindings: [
      'Thoracic Hyperkyphosis (increased Cobb angle)',
      'Scapular Protraction & Anterior Tipping',
      'Pelvic Posterior Pelvic Tilt with Lumbar Flattening',
      'Downward Visual Gaze Depression angle (-32°)'
    ],
    rulaScore: 6,
    rulaInterpretation: 'Action Level 3: High musculoskeletal risk. Investigation and changes required soon.',
    rebaScore: 8,
    cervicalLoadEstimateLbs: 34, // Baseline is 10-12 lbs; 34 lbs at 38° CVA!
  },
  differentials: [
    {
      id: 'diff-cva',
      name: 'Craniovertebral Angle (CVA)',
      measuredValue: '38.5°',
      normativeValue: '50.0° - 55.0°',
      deviationDelta: '-13.5° (Significant forward head shift)',
      severity: 'severe',
      region: 'cervical',
      biomechanicalImpact: 'Tragus translated 4.2 cm anterior to acromion plumb line. Multiplies gravitational shear stress on C5-C7 facets and overactivates suboccipital extensors.',
      plumbLineOffsetPercent: 12,
    },
    {
      id: 'diff-thoracic',
      name: 'Thoracic Kyphosis Index',
      measuredValue: '47.2°',
      normativeValue: '25.0° - 40.0°',
      deviationDelta: '+9.2° excess thoracic flexion',
      severity: 'moderate',
      region: 'thoracic',
      biomechanicalImpact: 'Compensatory thoracic curvature restricts diaphragmatic excursion by ~15% and increases intradiscal hydrostatic pressure in T6-T9.',
      plumbLineOffsetPercent: 8,
    },
    {
      id: 'diff-shoulder-protraction',
      name: 'Glenohumeral Anterior Translation',
      measuredValue: '28 mm',
      normativeValue: '< 10 mm anterior to mid-clavicle',
      deviationDelta: '+18 mm anterior excursion',
      severity: 'severe',
      region: 'shoulder',
      biomechanicalImpact: 'Subacromial space reduced by estimated 2.3 mm, precipitating supraspinatus impingement risk during keyboard reaching tasks.',
      plumbLineOffsetPercent: 9,
    },
    {
      id: 'diff-pelvic',
      name: 'Lumbopelvic Rhythm & Lordosis',
      measuredValue: '18.0°',
      normativeValue: '35.0° - 45.0°',
      deviationDelta: '-19.0° (Hypolordotic / Sacral Sitting)',
      severity: 'moderate',
      region: 'pelvic',
      biomechanicalImpact: 'Sacral sitting shifts loading from ischial tuberosities to coccyx and lumbar posterior longitudinal ligaments, promoting disc herniation vulnerability.',
      plumbLineOffsetPercent: -6,
    },
    {
      id: 'diff-gaze',
      name: 'Cranio-Ocular Gaze Depression Angle',
      measuredValue: '-32.0°',
      normativeValue: '-15.0° to -20.0° optimal',
      deviationDelta: '-14.0° excessive downward pitch',
      severity: 'moderate',
      region: 'cervical',
      biomechanicalImpact: 'Forces sustained isometric contraction of levator scapulae and splenius capitis to stabilize downward visual fixation.',
      plumbLineOffsetPercent: 5,
    },
  ],
  myofascialProfile: {
    hypertonicMuscles: [
      { name: 'Suboccipitals (Rectus capitis & Obliquus)', impact: 'Sustained shortening causing cervicogenic tension headaches' },
      { name: 'Upper Trapezius & Levator Scapulae', impact: 'Elevated baseline EMG tone resulting in chronic shoulder knotting' },
      { name: 'Pectoralis Major & Minor', impact: 'Contracture pulling scapulae into internal rotation and protraction' },
      { name: 'Sternocleidomastoid (SCM)', impact: 'Sustained anterior recruitment overriding deep neck flexors' },
    ],
    inhibitedMuscles: [
      { name: 'Deep Cervical Flexors (Longus Colli/Capitis)', impact: 'Reciprocal inhibition leading to loss of cervical lordotic stabilization' },
      { name: 'Lower & Middle Trapezius', impact: 'Lengthened and weakened, unable to depress and retract scapulae' },
      { name: 'Serratus Anterior', impact: 'Scapular winging tendency during prolonged reaching' },
      { name: 'Transverse Abdominis & Gluteals', impact: 'Core flaccidity during passive slump seating' },
    ],
  },
  skeletalLandmarks: [
    { name: 'Tragus (Ear)', x: 42, y: 18, confidence: 0.95, differentialFlag: true, label: 'Tragus (+4.2cm Ant.)' },
    { name: 'C7 Spinous Process', x: 38, y: 28, confidence: 0.92, differentialFlag: false, label: 'C7 Landmark' },
    { name: 'Acromion (Shoulder)', x: 37, y: 34, confidence: 0.94, differentialFlag: true, label: 'Acromion (Plumb Line Zero)' },
    { name: 'Lateral Epicondyle (Elbow)', x: 44, y: 52, confidence: 0.89, differentialFlag: false, label: 'Elbow 95°' },
    { name: 'Wrist Joint', x: 58, y: 55, confidence: 0.88, differentialFlag: false, label: 'Wrist Desk Interface' },
    { name: 'Thoracic Apex (T7)', x: 33, y: 42, confidence: 0.85, differentialFlag: true, label: 'Kyphotic Apex (+9°)' },
    { name: 'Greater Trochanter (Hip)', x: 37, y: 66, confidence: 0.91, differentialFlag: true, label: 'Trochanter (-19° Pelvic)' },
    { name: 'Lateral Femoral Condyle (Knee)', x: 56, y: 78, confidence: 0.89, differentialFlag: false, label: 'Knee 92°' },
    { name: 'Lateral Malleolus (Ankle)', x: 54, y: 94, confidence: 0.84, differentialFlag: false, label: 'Ground Floor Contact' },
  ],
  plumbLineReference: {
    idealX: 37, // Acromion Coronal Plumb Line
    coronalDeviations: [
      { landmark: 'Tragus', offsetMm: 42 },
      { landmark: 'Acromion', offsetMm: 0 },
      { landmark: 'T7 Apex', offsetMm: -38 },
      { landmark: 'Greater Trochanter', offsetMm: 2 },
    ],
  },
  slides: [
    {
      id: 1,
      stepNumber: 1,
      totalSteps: 6,
      title: 'Spatial & Camera Coordinate Calibration',
      subtitle: 'Understanding vantage angle, room perspective, and 3D user orientation',
      category: 'spatial_calibration',
      narrative: 'The optical sensor is positioned at a Sagittal Right orientation with a +14° upward pitch from the desk surface. By calibrating the perspective matrix against the horizontal plane, optical perspective distortion is corrected, allowing millimeter-accurate plumb line derivation.',
      keyMetrics: [
        { label: 'Camera Pitch', value: '+14° Upward', status: 'neutral' },
        { label: 'Camera Vantage', value: 'Sagittal (Right)', status: 'good' },
        { label: 'Focal Distance', value: '~1.2 meters', status: 'neutral' },
        { label: 'Spatial Context', value: 'Seated Task Station', status: 'good' },
      ],
      bulletPoints: [
        'Inverse-perspective transformation applied to normalize camera tilt angle.',
        'User detected in seated workstation posture with desk resting plane at ~72cm.',
        'Temporal consistency analysis indicates static posture hold without micro-shifting.',
        'Gravitational vertical plumb line calculated through lateral acromion reference vector.'
      ],
      visualType: 'spatial_3d',
      callout: 'Perspective compensation ensures that head and shoulder displacement measurements remain true regardless of camera height or tilt.'
    },
    {
      id: 2,
      stepNumber: 2,
      totalSteps: 6,
      title: 'High-Differential Biomechanical Mapping',
      subtitle: 'Plumb line divergence and angular landmark quantification',
      category: 'differential_breakdown',
      narrative: 'A pronounced cranial-cervical shear differential was detected. The Craniovertebral Angle (CVA) measures 38.5°, representing a -13.5° deficit from normative baseline. For every 10° deviation below 50°, the cervical spine absorbs an additional 10–12 lbs of mechanical lever load.',
      keyMetrics: [
        { label: 'CVA Differential', value: '-13.5° Deficit', status: 'alert' },
        { label: 'Cervical Load', value: '34 lbs (vs 12 lbs)', status: 'alert' },
        { label: 'Kyphosis Flexion', value: '+9.2° Excess', status: 'warning' },
        { label: 'Shoulder Translation', value: '+18 mm Anterior', status: 'warning' },
      ],
      bulletPoints: [
        'C7-Tragus vector shows forward head translation of 4.2 cm beyond acromial plumb line.',
        'Thoracic Cobb angle demonstrates compensatory mid-dorsal hyperkyphosis.',
        'Anterior shoulder drift of 18mm causes internal glenohumeral rotation.',
        'Lumbar curve exhibits posterior pelvic rotation ("sacral sitting").'
      ],
      visualType: 'plumb_line',
      callout: 'Your head currently exerts approximately 34 lbs of force on your cervical facet joints—almost triple the anatomical design load.'
    },
    {
      id: 3,
      stepNumber: 3,
      totalSteps: 6,
      title: 'Kinetic Chain & Clinical Diagnosis',
      subtitle: 'Rapid Upper Limb Assessment (RULA) & Janda Syndrome Classification',
      category: 'kinetic_chain',
      narrative: 'Biomechanical profiling classifies this posture as classical Janda Upper Crossed Syndrome (Stage II). The kinetic chain reacts sequentially: thoracic slump forces cervical hyperextension to keep the visual gaze horizontal, precipitating suboccipital compression and TMJ disc tension.',
      keyMetrics: [
        { label: 'Clinical Pattern', value: 'Upper Crossed (Janda II)', status: 'alert' },
        { label: 'RULA Score', value: '6 / 7 (High Risk)', status: 'alert' },
        { label: 'REBA Score', value: '8 / 15 (Medium-High)', status: 'warning' },
        { label: 'Gaze Depression', value: '-32° (Excessive)', status: 'warning' },
      ],
      bulletPoints: [
        'Cervico-thoracic junction (C7-T1) subjected to severe shear stress from forward gravitational moment.',
        'Compensatory upward tilting of the occiput restricts vertebral artery and greater occipital nerve clearance.',
        'Reduced subacromial clearance elevates risk of chronic rotator cuff tendinopathy.',
        'Diaphragmatic excursion is restricted by 15% due to upper abdominal compression.'
      ],
      visualType: 'kinetic_flow',
      callout: 'The neck strain is not an isolated symptom; it is the kinetic endpoint of a collapsed thoracic cage and unaligned pelvis.'
    },
    {
      id: 4,
      stepNumber: 4,
      totalSteps: 6,
      title: 'Myofascial Differential Analysis',
      subtitle: 'Hypertonic contractures versus inhibited, lengthened stabilizers',
      category: 'myofascial_balance',
      narrative: 'Postural distortion creates reciprocal neurological inhibition. Phasic stabilizers (longus colli, lower trapezius, serratus) go dormant, while tonic postural muscles (upper traps, pectorals, SCM) become chronically contracted and ischemic.',
      keyMetrics: [
        { label: 'Hypertonic Groups', value: '4 Key Muscle Beds', status: 'alert' },
        { label: 'Inhibited Stabilizers', value: '4 Muscle Chains', status: 'warning' },
        { label: 'Tone Imbalance', value: 'High Reciprocal Deficit', status: 'alert' },
        { label: 'Ischemia Risk', value: 'Elevated in Suboccipitals', status: 'warning' },
      ],
      bulletPoints: [
        'Hypertonic: Upper Trapezius, Levator Scapulae, Pectoralis Major & Minor, Suboccipital triangle.',
        'Inhibited: Deep Neck Flexors (Longus Colli/Capitis), Lower/Middle Trapezius, Serratus Anterior, Rhomboids.',
        'Constant isometric spasm diminishes local blood perfusion, triggering myofascial trigger points.',
        'Restoration requires releasing the hypertonic anterior chain before activating dormant posterior stabilizers.'
      ],
      visualType: 'muscle_map',
      callout: 'Strengthening without releasing will only reinforce faulty patterns. Release the tight anterior chain before activating dormant retractors.'
    },
    {
      id: 5,
      stepNumber: 5,
      totalSteps: 6,
      title: 'Step-by-Step Clinical Corrective Protocols',
      subtitle: 'Prescribed physical therapy sequences with biomechanical cues',
      category: 'corrective_protocols',
      narrative: 'A calibrated 3-phase physical therapy intervention designed to systematically reverse the measured differentials. Each exercise directly targets a specific quantified deviation identified in your scan.',
      keyMetrics: [
        { label: 'Phase 1', value: 'Axial Decompression', status: 'good' },
        { label: 'Phase 2', value: 'Scapular Posterior Tilt', status: 'good' },
        { label: 'Phase 3', value: 'Thoracic Extension', status: 'good' },
        { label: 'Total Daily Time', value: '8 Minutes Total', status: 'neutral' },
      ],
      bulletPoints: [
        'Protocol 1: Supine or Seated Chin Tuck with Axial Cervical Elongation (3 sets x 10 reps, 5s isometric hold).',
        'Protocol 2: Doorway Pectoral Release with Diaphragmatic Breath Excursion (3 sets x 30s gentle stretch).',
        'Protocol 3: Prone or Wall Y-to-W Scapular Depression & Retraction (3 sets x 12 reps, 3s squeeze).',
        'Protocol 4: Thoracic Extension mobilization over chair back or foam roller (2 sets x 8 gentle extensions).'
      ],
      visualType: 'exercise_guide',
      callout: 'Perform the Axial Chin Tuck every 45 minutes while working. Think of making a double chin while growing tall through the crown of your head.'
    },
    {
      id: 6,
      stepNumber: 6,
      totalSteps: 6,
      title: 'Spatial & Ergonomic Recommendations',
      subtitle: 'Targeted workstation adjustments and temporal habits',
      category: 'ergonomic_action',
      narrative: 'Sustainable postural correction requires altering the spatial environment that induced the compensation. Aligning the visual horizon and pelvic foundation eliminates 80% of unconscious slouching triggers.',
      keyMetrics: [
        { label: 'Monitor Height', value: '+8 cm Higher Needed', status: 'warning' },
        { label: 'Gaze Target', value: 'Top 1/3 at Eye Level', status: 'good' },
        { label: 'Lumbar Wedge', value: '15° Tilt Recommended', status: 'good' },
        { label: 'Reset Interval', value: 'Every 30 Minutes', status: 'good' },
      ],
      bulletPoints: [
        'Elevate Primary Display: Raise monitor so the top third of the panel aligns with horizontal eye level, eliminating the -32° downward gaze.',
        'Seat Base Angle: Tilt chair pan forward ~5-10° or introduce a firm lumbar roll to preserve native lordotic curvature.',
        'Forearm Resting Plane: Adjust armrest height so elbows form a 90°-100° open angle with relaxed shoulders.',
        'Temporal 30/30 Rule: Every 30 minutes, perform 30 seconds of axial decompression and look 20+ feet into the distance.'
      ],
      visualType: 'ergonomic_setup',
      callout: 'Your posture is an automatic response to your visual target. Bring the screen up, and your spine will naturally follow.'
    }
  ],
  recommendations: {
    immediateCues: [
      'Axial Elongation: Imagine a gentle upward tether pulling the crown of your head toward the ceiling.',
      'Scapular Pocketing: Slide your shoulder blades down and gently together, as if placing them into your back pockets.',
      'Ischial Weight Distribution: Rock your pelvis forward until you feel your sit-bones (ischial tuberosities) bearing direct weight.'
    ],
    exercises: [
      {
        id: 'ex-chin-tuck',
        name: 'Axial Cervical Retraction (Chin Tuck)',
        targetSyndrome: 'Forward Head Posture & CVA Deficit',
        targetMuscles: ['Deep Cervical Flexors (Longus Colli)', 'Suboccipitals (Stretching)'],
        setsAndReps: '3 sets of 10 repetitions',
        tempo: '2s retract, 5s isometric hold, 2s release',
        instructions: [
          'Sit tall with your shoulders relaxed and gaze straight ahead.',
          'Place two fingers gently on your chin for proprioceptive feedback.',
          'Without tilting your head down, draw your chin straight back as if creating a subtle double chin.',
          'Feel a gentle traction stretch at the base of your skull while your deep throat muscles engage.',
          'Hold firmly for 5 seconds, breathe calmly, and return smoothly to neutral.'
        ],
        clinicalRationale: 'Directly combats the -13.5° CVA deviation by reactivating longus colli and decompressing the suboccipital nerve bed.',
        commonMistake: 'Do not flex your neck downward toward your chest; the motion is purely horizontal retraction.'
      },
      {
        id: 'ex-wall-yw',
        name: 'Wall Y-to-W Scapular Depression & Retraction',
        targetSyndrome: 'Scapular Protraction & Thoracic Kyphosis',
        targetMuscles: ['Lower Trapezius', 'Middle Trapezius', 'Rhomboids', 'Infraspinatus'],
        setsAndReps: '3 sets of 12 repetitions',
        tempo: '3s down into W, 2s peak squeeze, 3s return to Y',
        instructions: [
          'Stand with your back, head, and sacrum flat against a wall, feet 6 inches forward.',
          'Extend your arms overhead into a "Y" position with backs of hands and elbows contacting the wall.',
          'Slowly glide your elbows downward along the wall into a "W" shape, tucking your elbows toward your ribs.',
          'Concentrate on pulling your shoulder blades downward and inward toward your spine.',
          'Pause in the bottom contraction for 2 seconds before smoothly gliding back up.'
        ],
        clinicalRationale: 'Recruits dormant lower trapezius fibers to counteract pectoralis minor contracture and open subacromial space.',
        commonMistake: 'Do not allow your lower back to arch excessively off the wall during the movement.'
      },
      {
        id: 'ex-doorway-pec',
        name: 'Doorway Pectoralis Minor & Major Release',
        targetSyndrome: 'Internal Shoulder Rotation & Forward Slump',
        targetMuscles: ['Pectoralis Minor', 'Pectoralis Major (Clavicular/Sternal)', 'Anterior Deltoid'],
        setsAndReps: '3 sets of 30-40 seconds per angle',
        tempo: 'Static progressive stretch with deep diaphragmatic breaths',
        instructions: [
          'Stand in a doorway with one forearm resting flat against the door frame at a 90° elbow bend.',
          'Take a gentle step forward with the same-side leg until a comfortable stretch is felt across the chest.',
          'Ensure your shoulder stays depressed away from your ear throughout.',
          'Inhale deeply into your ribcage for 4 seconds; on the exhale, relax deeper into the opening.',
          'Perform at 90° for pectoralis major, and raise forearm to 120° to isolate pectoralis minor.'
        ],
        clinicalRationale: 'Lengthens chronically shortened anterior myofascia, permitting the scapula to achieve natural posterior tipping.',
        commonMistake: 'Do not twist your lumbar spine or lean aggressively forward; maintain neutral pelvic alignment.'
      },
      {
        id: 'ex-thoracic-roller',
        name: 'Thoracic Spine Extension Mobilization',
        targetSyndrome: 'Thoracic Hyperkyphosis',
        targetMuscles: ['Thoracic Erector Spinae', 'Intercostals', 'Anterior Longitudinal Ligament'],
        setsAndReps: '2 sets of 8 controlled extensions',
        tempo: '3s extension over apex, 2s hold, 3s return',
        instructions: [
          'Sit in a sturdy chair with a mid-back rest or lie on a foam roller positioned perpendicular across your mid-back (T6-T8).',
          'Interlace your fingers behind your neck to fully support your cervical spine.',
          'Keeping your lower ribs pulled down to avoid lumbar hyperextension, gently extend your upper back backward over the fulcrum.',
          'Inhale as you extend backward, holding the gentle extension for 2-3 seconds.',
          'Exhale and return to upright. Move the chair contact or roller up 1 inch and repeat.'
        ],
        clinicalRationale: 'Restores segmental extension to the rigid thoracic cage, reducing compensatory cervical forward translation.',
        commonMistake: 'Never crank on your neck with your hands; hands are strictly a cradle for the head.'
      }
    ],
    workstationErgonomics: [
      'Elevate monitor so the top 1/3 of the display aligns with horizontal gaze (requires ~8 cm lift).',
      'Position display 20 to 28 inches (arm length) away to prevent leaning forward.',
      'Adjust chair pan or add 10° wedge cushion to promote natural pelvic lordosis.',
      'Keep keyboard and mouse close to body so elbows stay within 10° of torso perpendicular.',
      'Use a footrest if feet do not rest firmly flat on the floor with thighs parallel.'
    ],
    timeSchedule: {
      postureBreakFrequency: 'Every 30 minutes of continuous seated work',
      dailyRoutine: 'Perform 3 minutes of Chin Tucks & Wall Y-W during mid-morning and mid-afternoon breaks.'
    }
  }
};

export const SAMPLE_ANALYSIS_ANTERIOR: PosturalAnalysisResult = {
  ...SAMPLE_ANALYSIS_SAGITTAL,
  analysisId: 'kine-sample-anterior-002',
  cameraPerspective: {
    viewAngle: 'Anterior (Frontal View)',
    estimatedCameraPitchDeg: -3,
    spatialOrientationAssessment: 'Direct coronal plane facing the user at approximately eye level (~1.1m). Clear visibility of bi-acromial, bi-pupillary, and sternal axes.',
    environmentalLighting: 'Even bilateral desk ambient lighting.',
    confidenceScore: 96,
  },
  clinicalClassification: {
    primarySyndrome: 'Coronal Plane Asymmetry with Right Shoulder Elevation & Cervical Lateral Shift',
    secondaryFindings: [
      'Right Upper Trapezius Hypertonicity with Scapular Elevation (+18mm)',
      'Left Lateral Cervical Flexion & Tilt (4.8°)',
      'Asymmetric Pelvic Obliquity (Left Iliac Crest drop ~8mm)',
      'Unilateral Mouse-Arm Dominance Compensation'
    ],
    rulaScore: 5,
    rulaInterpretation: 'Action Level 2: Investigation needed. Musculoskeletal strain developing.',
    rebaScore: 6,
    cervicalLoadEstimateLbs: 22,
  },
  differentials: [
    {
      id: 'diff-shoulder-elevation',
      name: 'Bi-Acromial Shoulder Elevation Delta',
      measuredValue: '18.5 mm (Right Elevated)',
      normativeValue: '< 5.0 mm bilateral variance',
      deviationDelta: '+13.5 mm right-sided dominance',
      severity: 'severe',
      region: 'shoulder',
      biomechanicalImpact: 'Habitual unilateral mouse anchoring causes sustained right upper trapezius and levator scapulae contracture, tilting the clavicular plane.',
      plumbLineOffsetPercent: 7,
    },
    {
      id: 'diff-head-tilt',
      name: 'Coronal Cranial Tilt (Bi-Pupillary Line)',
      measuredValue: '4.8° Lateral Tilt',
      normativeValue: '< 1.5° neutral horizon',
      deviationDelta: '+3.3° leftward tilt',
      severity: 'moderate',
      region: 'cervical',
      biomechanicalImpact: 'Vestibular ocular reflex tilts head counter to shoulder elevation to maintain horizontal gaze, loading left scalenes.',
      plumbLineOffsetPercent: 4,
    },
    {
      id: 'diff-pelvic-obliquity',
      name: 'Pelvic Crest Obliquity (ASIS Line)',
      measuredValue: '8.2 mm (Left Lower)',
      normativeValue: '< 3.0 mm bilateral',
      deviationDelta: '+5.2 mm pelvic list',
      severity: 'mild',
      region: 'pelvic',
      biomechanicalImpact: 'Unilateral leg crossing or dominant ischial weight-bearing produces functional scoliosis curve in thoracolumbar junction.',
      plumbLineOffsetPercent: -3,
    },
  ],
  skeletalLandmarks: [
    { name: 'Nasion (Mid-Forehead)', x: 50, y: 15, confidence: 0.96, differentialFlag: false, label: 'Midline Datum' },
    { name: 'Left Tragus', x: 44, y: 19, confidence: 0.92, differentialFlag: true, label: 'Ear (Tilted 4.8°)' },
    { name: 'Right Tragus', x: 56, y: 17, confidence: 0.92, differentialFlag: true, label: 'Ear' },
    { name: 'Left Acromion', x: 34, y: 34, confidence: 0.95, differentialFlag: false, label: 'Acromion Base' },
    { name: 'Right Acromion', x: 66, y: 30, confidence: 0.95, differentialFlag: true, label: 'Acromion (+18.5mm High)' },
    { name: 'Sternum / Jugular Notch', x: 50, y: 33, confidence: 0.94, differentialFlag: false, label: 'Sternal Axis' },
    { name: 'Left ASIS Pelvis', x: 42, y: 64, confidence: 0.88, differentialFlag: true, label: 'ASIS (-8mm Low)' },
    { name: 'Right ASIS Pelvis', x: 58, y: 62, confidence: 0.88, differentialFlag: false, label: 'ASIS' },
  ]
};
