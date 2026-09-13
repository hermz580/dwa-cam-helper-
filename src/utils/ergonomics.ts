import { AnthropometricErgonomics, UserHeightProfile } from '../types';

/**
 * Converts feet and inches to centimeters
 */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
}

/**
 * Converts centimeters to feet and rounded inches
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Calculates evidence-based anthropometric workstation parameters based on user height
 * Grounded in ANSI/HFES 100-2007 and ISO 9241-5 Computer Workstation standards.
 */
export function calculateAnthropometrics(heightCm: number, workstationType?: string): AnthropometricErgonomics {
  // Biomechanical anthropometric ratios:
  // Seated popliteal height (chair pan) ~ 25.5% of standing stature
  const chairCm = Math.round(heightCm * 0.255 * 10) / 10;
  // Seated elbow height (desk working surface for 90° forearm) ~ 39.5% of stature
  const deskCm = Math.round(heightCm * 0.395 * 10) / 10;
  // Seated eye height from floor ~ 68.5% of stature
  const eyeCm = Math.round(heightCm * 0.685 * 10) / 10;
  // Top of monitor screen level ~ eye height to 3cm below eye height
  const monitorTopCm = Math.round((eyeCm - 2) * 10) / 10;
  // Recommended viewing distance (arm's length) ~ 38% to 42% of stature
  const viewingDistCm = Math.round(heightCm * 0.40 * 10) / 10;

  return {
    userHeightCm: heightCm,
    seatedPoplitealChairHeightCm: chairCm,
    seatedElbowDeskHeightCm: deskCm,
    seatedEyeHeightFromFloorCm: eyeCm,
    recommendedMonitorTopHeightCm: monitorTopCm,
    recommendedViewingDistanceCm: viewingDistCm,

    seatedPoplitealChairHeightIn: Math.round((chairCm / 2.54) * 10) / 10,
    seatedElbowDeskHeightIn: Math.round((deskCm / 2.54) * 10) / 10,
    seatedEyeHeightFromFloorIn: Math.round((eyeCm / 2.54) * 10) / 10,
    recommendedMonitorTopHeightIn: Math.round((monitorTopCm / 2.54) * 10) / 10,
    recommendedViewingDistanceIn: Math.round((viewingDistCm / 2.54) * 10) / 10,
    pixelToCmScaleMultiplier: Math.round((heightCm / 180) * 100) / 100,
  };
}

/**
 * Provides coder-specific posture insights based on workstation type
 */
export function getCoderWorkstationTips(
  workstationType: string,
  userHeightCm: number,
  unit: 'cm' | 'in' = 'in'
): string[] {
  const anthro = calculateAnthropometrics(userHeightCm);
  const chairStr = unit === 'in' ? `${anthro.seatedPoplitealChairHeightIn}"` : `${anthro.seatedPoplitealChairHeightCm} cm`;
  const deskStr = unit === 'in' ? `${anthro.seatedElbowDeskHeightIn}"` : `${anthro.seatedElbowDeskHeightCm} cm`;
  const monitorStr = unit === 'in' ? `${anthro.recommendedMonitorTopHeightIn}"` : `${anthro.recommendedMonitorTopHeightCm} cm`;

  const baseTips = [
    `Chair Seat Pan Height: Calibrate to exactly ${chairStr} from floor so feet rest flat with knees at 90°-100°.`,
    `Desk & Keyboard Working Surface: Set to ${deskStr} so wrists stay straight without forearm contact stress.`,
    `Top of Monitor Screen: Position top bezel at ${monitorStr} from floor; your natural gaze sits 15° downward.`,
    `IDE & Terminal Typography: Increase coding font size to 14px-16px (e.g. JetBrains Mono) to eliminate involuntary forward head craning toward small code tokens.`,
  ];

  if (workstationType === 'laptop') {
    baseTips.unshift(
      'Laptop Warning: Using a laptop directly on the desk creates a severe downward gaze angle (-35°), forcing 30+ lbs of cervical strain. Use a laptop riser stand + separate keyboard.'
    );
  } else if (workstationType === 'dual_monitor') {
    baseTips.unshift(
      'Dual Monitor Notice: If one monitor is your primary coding screen, center it directly in front of your midline. Angling two screens equally causes repetitive 25° cervical rotatory shear.'
    );
  } else if (workstationType === 'standing_desk') {
    baseTips.unshift(
      'Sit-Stand Cadence: Follow the 20-8-2 rule: 20 minutes sitting, 8 minutes standing upright while coding, 2 minutes walking or stretching.'
    );
  }

  return baseTips;
}
