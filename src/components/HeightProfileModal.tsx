import React, { useState } from 'react';
import { UserHeightProfile, WorkstationType } from '../types';
import { calculateAnthropometrics, cmToFeetInches, feetInchesToCm } from '../utils/ergonomics';
import { Ruler, Monitor, Laptop, Check, X, Sliders, ShieldAlert, Sparkles } from 'lucide-react';

interface HeightProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserHeightProfile;
  onSave?: (updatedProfile: UserHeightProfile) => void;
  onSaveProfile?: (updatedProfile: UserHeightProfile) => void;
}

export const HeightProfileModal: React.FC<HeightProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave,
  onSaveProfile,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>(currentProfile.unit || 'in');
  const [feet, setFeet] = useState<number>(currentProfile.heightFeet || 5);
  const [inches, setInches] = useState<number>(currentProfile.heightInches || 10);
  const [cm, setCm] = useState<number>(currentProfile.heightCm || 178);
  const [workstation, setWorkstation] = useState<WorkstationType>(currentProfile.workstationType || 'laptop');

  if (!isOpen) return null;

  // Sync state on unit switch
  const handleUnitChange = (newUnit: 'in' | 'cm') => {
    if (newUnit === 'cm' && unit === 'in') {
      const calculatedCm = feetInchesToCm(feet, inches);
      setCm(calculatedCm);
    } else if (newUnit === 'in' && unit === 'cm') {
      const converted = cmToFeetInches(cm);
      setFeet(converted.feet);
      setInches(converted.inches);
    }
    setUnit(newUnit);
  };

  const effectiveCm = unit === 'in' ? feetInchesToCm(feet, inches) : cm;
  const anthro = calculateAnthropometrics(effectiveCm);

  const handleSave = () => {
    const finalFeet = unit === 'in' ? feet : Math.floor((cm / 2.54) / 12);
    const finalInches = unit === 'in' ? inches : Math.round((cm / 2.54) % 12);
    const updatedProfile: UserHeightProfile = {
      heightCm: effectiveCm,
      heightFeet: finalFeet,
      heightInches: finalInches,
      unit,
      workstationType: workstation,
    };

    if (typeof onSave === 'function') {
      onSave(updatedProfile);
    } else if (typeof onSaveProfile === 'function') {
      onSaveProfile(updatedProfile);
    }
    onClose();
  };

  return (
    <div
      id="height-profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="height-profile-modal"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Subject Height & Coder Workstation</h3>
              <p className="text-xs text-slate-400">Calibrates pixel-to-metric scaling & ANSI/HFES workstation heights</p>
            </div>
          </div>
          <button
            id="close-height-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Unit Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Height Measurement System
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                id="unit-imperial-btn"
                onClick={() => handleUnitChange('in')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  unit === 'in'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Imperial (Feet & Inches)
              </button>
              <button
                type="button"
                id="unit-metric-btn"
                onClick={() => handleUnitChange('cm')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  unit === 'cm'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Metric (Centimeters)
              </button>
            </div>
          </div>

          {/* Height Input Fields */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Standing Height
            </label>
            {unit === 'in' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 mb-1 block">Feet (ft)</span>
                  <select
                    id="height-feet-select"
                    value={feet}
                    onChange={(e) => setFeet(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    {[4, 5, 6, 7].map((f) => (
                      <option key={f} value={f}>
                        {f} ft
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs text-slate-400 mb-1 block">Inches (in)</span>
                  <select
                    id="height-inches-select"
                    value={inches}
                    onChange={(e) => setInches(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i).map((inch) => (
                      <option key={inch} value={inch}>
                        {inch} in
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="135"
                    max="215"
                    value={cm}
                    onChange={(e) => setCm(Number(e.target.value))}
                    className="flex-1 accent-sky-500"
                  />
                  <div className="w-24 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-center">
                    <span className="text-sm font-bold text-white font-mono">{cm}</span>
                    <span className="text-xs text-slate-400 ml-1">cm</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Current stature: <strong className="text-sky-400">{effectiveCm} cm</strong> ({cmToFeetInches(effectiveCm).feet}' {cmToFeetInches(effectiveCm).inches}")
            </p>
          </div>

          {/* Workstation Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Coding Workstation Configuration
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'laptop', label: 'Laptop Only (On Desk)', icon: Laptop, note: 'High neck flexion risk' },
                { id: 'external_monitor', label: 'External Monitor + Keys', icon: Monitor, note: 'Optimal eye alignment' },
                { id: 'dual_monitor', label: 'Dual Coding Monitors', icon: Sliders, note: 'Rotational cervical shear' },
                { id: 'standing_desk', label: 'Sit-to-Stand Desk', icon: Sparkles, note: 'Dynamic cadence' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = workstation === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWorkstation(item.id as WorkstationType)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/60 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                    <span className="text-xs font-semibold mt-1">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.note}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Calculated Ergonomic Blueprint */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                ANSI/HFES 100 Calibrated Targets
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Precision ±0.5"</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Chair Seat Pan</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {unit === 'in' ? `${anthro.seatedPoplitealChairHeightIn}"` : `${anthro.seatedPoplitealChairHeightCm} cm`}
                </span>
                <span className="text-[9px] text-slate-500 block">from floor</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Desk Surface</span>
                <span className="text-sm font-bold text-sky-400 font-mono">
                  {unit === 'in' ? `${anthro.seatedElbowDeskHeightIn}"` : `${anthro.seatedElbowDeskHeightCm} cm`}
                </span>
                <span className="text-[9px] text-slate-500 block">for 90° elbow</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Top of Monitor</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {unit === 'in' ? `${anthro.recommendedMonitorTopHeightIn}"` : `${anthro.recommendedMonitorTopHeightCm} cm`}
                </span>
                <span className="text-[9px] text-slate-500 block">eye-level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            id="save-height-profile-btn"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Calibration
          </button>
        </div>
      </div>
    </div>
  );
};
