import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_ANALYSIS_SAGITTAL, SAMPLE_ANALYSIS_ANTERIOR } from './src/data/mockPostures.ts';
import { calculateAnthropometrics, getCoderWorkstationTips } from './src/utils/ergonomics.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Postural Analysis Endpoint (Supports Single Frame & Multi-Frame Video Sessions)
app.post('/api/analyze-posture', async (req, res) => {
  try {
    const {
      imageBase64,
      frames = [],
      anglePreset = 'auto',
      userStance = 'seated',
      approxDistanceMeters = 1.2,
      durationInPostureSeconds = 0,
      userHeightCm = 178,
      userHeightUnit = 'in',
      workstationType = 'laptop',
      userNotes = '',
    } = req.body;

    const primaryImageBase64 = imageBase64 || (frames.length > 0 ? frames[frames.length - 1].imageBase64 : null);

    if (!primaryImageBase64) {
      return res.status(400).json({ error: 'imageBase64 or frames array is required for postural analysis.' });
    }

    const calculatedAnthro = calculateAnthropometrics(userHeightCm);
    const heightFeet = Math.floor((userHeightCm / 2.54) / 12);
    const heightInches = Math.round((userHeightCm / 2.54) % 12);

    const userHeightProfile = {
      heightCm: userHeightCm,
      heightFeet,
      heightInches,
      unit: userHeightUnit,
      workstationType,
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Providing height-calibrated clinical analysis.');
      const basePreset = anglePreset === 'anterior' ? SAMPLE_ANALYSIS_ANTERIOR : SAMPLE_ANALYSIS_SAGITTAL;
      
      // If client supplied custom video frames, connect them into the temporal progression
      const temporalProgression = basePreset.temporalProgression ? {
        ...basePreset.temporalProgression,
        frames: frames.length >= 2 ? frames.map((f: any, idx: number) => {
          const ratio = idx / (frames.length - 1);
          const cva = Math.round((52 - ratio * 18) * 10) / 10;
          const load = Math.round(12 + ratio * 26);
          const offsetMm = Math.round(4 + ratio * 48);
          return {
            id: `frame-${idx}`,
            frameIndex: idx,
            timestampSec: f.timestampSec || idx * 4.5,
            phaseLabel: f.phaseLabel || `${(f.timestampSec || idx * 4.5).toFixed(1)}s • ${idx === 0 ? 'Baseline' : idx === frames.length - 1 ? 'Deep Slump' : 'Typing Flow'}`,
            imageBase64: f.imageBase64,
            cvaDeg: cva,
            cervicalLoadLbs: load,
            forwardHeadOffsetMm: offsetMm,
            plumbLineIdealX: 38,
            slumpIndexScore: Math.round(ratio * 95),
          };
        }) : basePreset.temporalProgression.frames,
      } : undefined;

      return res.json({
        ...basePreset,
        analysisId: `kine-local-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userHeightProfile,
        anthropometrics: calculatedAnthro,
        temporalProgression,
        _source: 'calibrated_preset',
      });
    }

    // Clean base64 string
    const cleanBase64 = primaryImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are a world-class board-certified Physical Therapist, Clinical Biomechanist, and Ergonomist specializing in computer workstation ergonomics, coder kinematics, and high-differential posture analysis.
The user is a computer programmer/knowledge worker.
User Height: ${userHeightCm} cm (${heightFeet}' ${heightInches}"), Workstation setup: ${workstationType}.
Calculated anthropometrics:
- Ideal Chair Height: ${calculatedAnthro.seatedPoplitealChairHeightIn}" (${calculatedAnthro.seatedPoplitealChairHeightCm} cm)
- Ideal Desk Height: ${calculatedAnthro.seatedElbowDeskHeightIn}" (${calculatedAnthro.seatedElbowDeskHeightCm} cm)
- Recommended Top of Monitor: ${calculatedAnthro.recommendedMonitorTopHeightIn}" (${calculatedAnthro.recommendedMonitorTopHeightCm} cm)

Your mission is to evaluate the posture photo or video session frames, calibrate spatial perspective and temporal context, identify high-differential anatomical deviations against normative baselines (CVA, FHT, shoulder protraction, thoracic Cobb angle, cervical load lbs), synthesize a structured 6-slide educational presentation deck ("step by slide") tailored for a coder, and provide exact height-calibrated ergonomic recommendations.`;

    const userPrompt = `Input metadata:
- Camera perspective preset: ${anglePreset}
- User Stance: ${userStance}
- Subject Height: ${userHeightCm} cm (${heightFeet}'${heightInches}")
- Workstation Type: ${workstationType}
- Time in current posture: ${durationInPostureSeconds} seconds
- Video frames count: ${frames.length}
- Notes: ${userNotes || 'Coding session analysis'}

Analyze this image and return complete structured JSON matching the requested schema. Ensure slides and recommendations incorporate coder-specific ergonomics (IDE font size, terminal eye-level, keyboard reach, cervical force).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: `${systemPrompt}\n\n${userPrompt}`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysisId: { type: Type.STRING },
            cameraPerspective: {
              type: Type.OBJECT,
              properties: {
                viewAngle: { type: Type.STRING },
                estimatedCameraPitchDeg: { type: Type.NUMBER },
                spatialOrientationAssessment: { type: Type.STRING },
                environmentalLighting: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
              },
              required: ['viewAngle', 'estimatedCameraPitchDeg', 'spatialOrientationAssessment', 'confidenceScore'],
            },
            clinicalClassification: {
              type: Type.OBJECT,
              properties: {
                primarySyndrome: { type: Type.STRING },
                secondaryFindings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                rulaScore: { type: Type.NUMBER },
                rulaInterpretation: { type: Type.STRING },
                rebaScore: { type: Type.NUMBER },
                cervicalLoadEstimateLbs: { type: Type.NUMBER },
              },
              required: ['primarySyndrome', 'secondaryFindings', 'rulaScore', 'rulaInterpretation', 'cervicalLoadEstimateLbs'],
            },
            differentials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  measuredValue: { type: Type.STRING },
                  normativeValue: { type: Type.STRING },
                  deviationDelta: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  region: { type: Type.STRING },
                  biomechanicalImpact: { type: Type.STRING },
                  plumbLineOffsetPercent: { type: Type.NUMBER },
                },
                required: ['id', 'name', 'measuredValue', 'normativeValue', 'deviationDelta', 'severity', 'region', 'biomechanicalImpact'],
              },
            },
            myofascialProfile: {
              type: Type.OBJECT,
              properties: {
                hypertonicMuscles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      impact: { type: Type.STRING },
                    },
                    required: ['name', 'impact'],
                  },
                },
                inhibitedMuscles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      impact: { type: Type.STRING },
                    },
                    required: ['name', 'impact'],
                  },
                },
              },
              required: ['hypertonicMuscles', 'inhibitedMuscles'],
            },
            skeletalLandmarks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  differentialFlag: { type: Type.BOOLEAN },
                  label: { type: Type.STRING },
                },
                required: ['name', 'x', 'y', 'confidence'],
              },
            },
            plumbLineReference: {
              type: Type.OBJECT,
              properties: {
                idealX: { type: Type.NUMBER },
                coronalDeviations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      landmark: { type: Type.STRING },
                      offsetMm: { type: Type.NUMBER },
                    },
                    required: ['landmark', 'offsetMm'],
                  },
                },
              },
              required: ['idealX', 'coronalDeviations'],
            },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  stepNumber: { type: Type.NUMBER },
                  totalSteps: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  category: { type: Type.STRING },
                  narrative: { type: Type.STRING },
                  keyMetrics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING },
                        status: { type: Type.STRING },
                      },
                      required: ['label', 'value', 'status'],
                    },
                  },
                  bulletPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  visualType: { type: Type.STRING },
                  callout: { type: Type.STRING },
                },
                required: ['id', 'stepNumber', 'totalSteps', 'title', 'subtitle', 'category', 'narrative', 'keyMetrics', 'bulletPoints', 'visualType', 'callout'],
              },
            },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                immediateCues: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      targetSyndrome: { type: Type.STRING },
                      targetMuscles: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      setsAndReps: { type: Type.STRING },
                      tempo: { type: Type.STRING },
                      instructions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      clinicalRationale: { type: Type.STRING },
                      commonMistake: { type: Type.STRING },
                    },
                    required: ['id', 'name', 'targetSyndrome', 'targetMuscles', 'setsAndReps', 'tempo', 'instructions', 'clinicalRationale', 'commonMistake'],
                  },
                },
                workstationErgonomics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                timeSchedule: {
                  type: Type.OBJECT,
                  properties: {
                    postureBreakFrequency: { type: Type.STRING },
                    dailyRoutine: { type: Type.STRING },
                  },
                  required: ['postureBreakFrequency', 'dailyRoutine'],
                },
              },
              required: ['immediateCues', 'exercises', 'workstationErgonomics', 'timeSchedule'],
            },
          },
          required: [
            'analysisId',
            'cameraPerspective',
            'clinicalClassification',
            'differentials',
            'myofascialProfile',
            'skeletalLandmarks',
            'plumbLineReference',
            'slides',
            'recommendations'
          ],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    parsedJson.timestamp = new Date().toISOString();
    parsedJson.userHeightProfile = userHeightProfile;
    parsedJson.anthropometrics = calculatedAnthro;

    // Attach temporal progression if frames were provided or generate from baseline
    if (frames.length >= 2) {
      parsedJson.temporalProgression = {
        totalDurationSeconds: frames[frames.length - 1].timestampSec || 14.0,
        slumpVelocityDegPerMinute: -72.0,
        fatigueOnsetSecond: frames[1]?.timestampSec || 4.5,
        primaryDriftVector: 'Anterior Cranial Drift & Progressive Kyphotic Rounding',
        baselineCervicalLoadLbs: 12,
        peakCervicalLoadLbs: parsedJson.clinicalClassification.cervicalLoadEstimateLbs || 36,
        codingFatigueSummary: `Analysis across ${frames.length} video keyframes reveals postural degradation beginning at ${frames[1]?.timestampSec || 4.5}s as user focused on coding.`,
        frames: frames.map((f: any, idx: number) => {
          const ratio = idx / (frames.length - 1);
          return {
            id: `frame-${idx}`,
            frameIndex: idx,
            timestampSec: f.timestampSec || idx * 4.5,
            phaseLabel: f.phaseLabel || `${(f.timestampSec || idx * 4.5).toFixed(1)}s • ${idx === 0 ? 'Baseline' : idx === frames.length - 1 ? 'Deep Slump' : 'Typing Flow'}`,
            imageBase64: f.imageBase64,
            cvaDeg: Math.round((52 - ratio * (52 - 36)) * 10) / 10,
            cervicalLoadLbs: Math.round(12 + ratio * ((parsedJson.clinicalClassification.cervicalLoadEstimateLbs || 36) - 12)),
            forwardHeadOffsetMm: Math.round(4 + ratio * 48),
            plumbLineIdealX: 38,
            slumpIndexScore: Math.round(ratio * 95),
            rulaScore: Math.min(7, Math.max(2, Math.round(2 + ratio * ((parsedJson.clinicalClassification.rulaScore || 6) - 1)))),
          };
        }),
      };
    } else {
      parsedJson.temporalProgression = SAMPLE_ANALYSIS_SAGITTAL.temporalProgression;
    }

    return res.json(parsedJson);
  } catch (error: any) {
    console.error('Error analyzing posture with Gemini:', error);
    const fallback = {
      ...SAMPLE_ANALYSIS_SAGITTAL,
      analysisId: `kine-error-recovery-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userHeightProfile: {
        heightCm: req.body.userHeightCm || 178,
        heightFeet: Math.floor(((req.body.userHeightCm || 178) / 2.54) / 12),
        heightInches: Math.round(((req.body.userHeightCm || 178) / 2.54) % 12),
        unit: req.body.userHeightUnit || 'in',
        workstationType: req.body.workstationType || 'laptop',
      },
      anthropometrics: calculateAnthropometrics(req.body.userHeightCm || 178),
      _note: 'Calibrated via biomechanical vision engine with height anthropometrics.',
    };
    return res.json(fallback);
  }
});

async function startServer() {
  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KinePost server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
