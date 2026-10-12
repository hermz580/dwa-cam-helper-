# KinePost → DWA Body lane

KinePost was the concept for a DWA camera helper. The working version now lives in
[`hermz580/deep-work-assistant`](https://github.com/hermz580/deep-work-assistant) as the **Body** app in DWA OS
(`deep-work-ui --os`) and the `deep_work_assistant/body.py` module.

This repo stays as a design reference. It is not the runtime.

## Why it moved

DWA's governance asks six questions of every feature: mission fit, reality, reuse, integration cost,
privacy, redundancy. KinePost had strong ideas but failed two of them:

- **Reality.** Without a Gemini key, `/api/analyze-posture` returns canned sample analyses
  (`src/data/mockPostures.ts`) with synthetic numbers. The simulated live stream uses `Math.random()`.
- **Privacy.** With a key, webcam frames are sent to a cloud model. DWA requires local-by-default sensing.

## What carried over, and how

| KinePost idea | In DWA | How it is made honest |
|---|---|---|
| Calibration HUD, framing guide | Body → Frame | Live preview stays in the browser; nothing is uploaded |
| Craniovertebral angle / forward head | Forward-head angle from local MediaPipe landmarks | Measured locally, sampled once a minute during real work |
| "Personal" posture judgement | Consent + calibrated neutral baseline | Median + spread, confidence label, refuses thin evidence |
| Hansraj cervical torque | Estimated head load (lbs) | Labeled as an estimate from a proxy angle, not a diagnosis |
| Height-calibrated anthropometrics | Workstation targets | Labeled as approximate population ratios |
| RULA alerts at a threshold | Personal alert threshold | Widens when you say an alert was wrong |
| Deep Work integration | Native: posture is part of the reminder engine | One local process, one evidence log |

## What was left out

- RULA/REBA scores, myofascial maps, and the slide deck: they need full-body or clinical input
  that a desk webcam cannot measure reliably.
- Cloud image analysis.
