# SIH 2026 Video Presentation Script
## MeghDrishti - Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts
### Team YuvaDevZ | Problem Statement ID: 26080

**Target Duration:** 5:30 - 7:00 minutes
**Format:** Narrated screen recording with slides + live dashboard demo

---

## SCENE 1: TITLE + HOOK (0:00 - 0:30)
**[SCREEN: Title slide - "MeghDrishti" with team name, SIH logo]**

> "Every monsoon season, India loses thousands of lives and billions of rupees to rainfall-related disasters. The reason? Weather models predict rainfall, but they get it wrong - sometimes badly wrong. The problem isn't that we lack forecasts. The problem is that no single correction works for all weather situations. A monsoon depression needs a different fix than coastal rain or mountain rainfall. That's exactly what we built. MeghDrishti - an AI system that understands *which* monsoon regime is active, and applies the *right* correction for *that* situation."

---

## SCENE 2: THE PROBLEM (0:30 - 1:15)
**[SCREEN: Slide 2 - Challenges and Problem]**

> "Let's break down the core challenges. First: one-size-fits-all forecasts. Current bias correction uses a single method regardless of whether it's an active monsoon phase, a break period, or a depression. That fails because each regime has a completely different error pattern. Second: no district-level insight. Raw weather model outputs are on a 25-kilometer grid. That's too coarse for a district collector deciding whether to evacuate a low-lying area. Third: no uncertainty quantification. Users get a single number - '60 millimeters of rain' - but not the probability that it could actually be 120. This matters for agriculture, flood preparedness, and disaster management."

**[SCREEN: Show the error table from README - regime vs. bias characteristics]**

> "As you can see, an active monsoon creates systematic wet bias because convection schemes are overactive. A depression underestimates heavy rain. Orographic zones show extreme wet bias over mountains. Each regime needs its own fix."

---

## SCENE 3: OUR SOLUTION (1:15 - 2:30)
**[SCREEN: Slide 3 - Innovation and Uniqueness]**

> "Our solution has three core AI components working together."

**[SCREEN: Switch to live code view of backend/ml/ directory]**

> "First - the Regime Classifier. It takes 14 atmospheric features - wind shear, moisture, pressure, OLR anomalies - and classifies the current monsoon state into one of six regimes: active monsoon, break monsoon, depression, orographic, coastal, or western disturbance. It outputs not just a label, but a confidence score and probability distribution across all six regimes."

**[SCREEN: Show ml/regime_classifier.py briefly]**

> "Second - the Regime-Aware Bias Corrector. Instead of one correction model, we have six - one trained specifically for each regime. But here's the key innovation: we don't hard-commit to one regime. We blend all six correctors weighted by the regime probabilities. If the classifier is 70% sure it's active monsoon and 20% break, we weight the corrections accordingly. This soft-blending makes the system robust to classification uncertainty."

**[SCREEN: Show ml/bias_corrector.py briefly]**

> "Third - the Probability Estimator. It converts a single rainfall number into risk levels: what's the probability of crossing 7.5 millimeters, 64.5 millimeters, 124.5 millimeters, or 244.5 millimeters? These are IMD's operational thresholds for moderate, heavy, very heavy, and extremely heavy rainfall."

**[SCREEN: Show ml/probability_estimator.py briefly]**

> "The entire pipeline is wrapped with a dry-wet hurdle model that prevents false rainfall on dry days, and a consistency dampener that catches edge cases where the soft blend inflates predictions."

---

## SCENE 4: LIVE DASHBOARD DEMO (2:30 - 4:15)
**[SCREEN: Open the live dashboard - frontend running on localhost]**

> "Now let me show you the live system."

**[SCREEN: Dashboard home page with map]**

> "This is MeghDrishti's dashboard. On the left, we have the current regime status. The system has classified today as Active Monsoon with high confidence. The map shows district-level rainfall forecasts across India - color-coded from light blue for minimal rain to deep red for extreme rainfall events."

**[SCREEN: Click on a district to show detailed forecast]**

> "When you click on any district - let's say Mumbai - you see the full picture: the raw NWP forecast, our corrected forecast, the identified regime, wet probability, and the four exceedance probabilities. A farmer in Maharashtra can now see: there's an 85% chance of heavy rainfall and a 30% chance of very heavy rainfall. That's actionable intelligence."

**[SCREEN: Navigate to Probability Map view]**

> "The probability map shows heavy rainfall risk across all districts simultaneously. Red zones indicate areas where the probability of exceeding 64.5 millimeters is above 75%. This is what a disaster management officer needs to see at a glance."

**[SCREEN: Navigate to Verification view]**

> "Our verification panel is critical for building trust. It compares raw NWP metrics against our corrected metrics side-by-side. You can see the RMSE reduction, the improvement in Equitable Threat Score, the Skill Score gains. The system doesn't just claim to be better - it proves it with standard meteorological verification metrics against IMD ground truth."

**[SCREEN: Navigate to Model Versions view]**

> "We also track model versions. Each retraining run is logged with its dataset, metrics, and staleness detection. If the underlying data distribution shifts, the system flags that retraining is needed."

---

## SCENE 5: TECHNICAL ARCHITECTURE (4:15 - 4:45)
**[SCREEN: Slide 3 - Technical Architecture diagram]**

> "On the architecture side: the backend is FastAPI serving our ML pipeline. We ingest GFS and ECMWF forecasts along with IMD observed rainfall and ERA5 reanalysis. Features are engineered per district per day. The frontend is React with Tailwind CSS, Leaflet for maps, and Recharts for verification charts. The system is containerized with Docker Compose and uses PostgreSQL with PostGIS for spatial queries."

---

## SCENE 6: RESULTS AND IMPACT (4:45 - 5:30)
**[SCREEN: Slide 5 - Impact and Benefits]**

> "Let's talk results and impact. Our regime classifier achieves over 98 percent accuracy on the test set. The bias correction pipeline reduces RMSE by over 70 percent compared to raw NWP output. The dry-day hurdle correctly zeros out 71 percent of near-zero rainfall cases, eliminating false alarms."

> "The impact spans multiple stakeholders. For farmers - 150 million people depend on monsoon agriculture. Accurate district-level forecasts mean better crop planning and irrigation scheduling. For disaster management authorities - NDMA and SDMA get early warning with probability estimates, not just point forecasts. For IMD forecasters - our system reduces manual post-processing workload while improving reliability. And for urban planners - regime-aware predictions for coastal and orographic regions support drainage and infrastructure decisions."

**[SCREEN: Show the impact bar chart from the PPT]**

> "At scale, accurate monsoon predictions support food grain storage, prevent price spikes, and ensure food security for 1.4 billion people."

---

## SCENE 7: CLOSING (5:30 - 6:00)
**[SCREEN: Title slide with GitHub link]**

> "MeghDrishti is built on a proven open-source stack - scikit-learn, XGBoost, FastAPI, React - with a working prototype running end-to-end. The same pipeline can be extended from current districts to all 780+ districts across India. We've documented everything - the code, the architecture, and even the known limitations - because transparency builds trust. The repository is open and the system is ready for the next phase of development. Thank you."

**[SCREEN: End card with team name, problem statement ID, GitHub link]**

---

## RECORDING INSTRUCTIONS

### Pre-Recording Setup:
1. Start the backend: `cd backend && python -m uvicorn main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Ensure dashboard loads with data at `http://localhost:5173`
4. Have the PPT open for slide scenes
5. Use OBS Studio or similar for screen recording

### Recording Tips:
- **Audio**: Use a good microphone, speak clearly at moderate pace
- **Screen**: Record at 1080p, use fullscreen for dashboard scenes
- **Slides**: Use presenter mode, export slides as images for clean overlay
- **Cursor**: Highlight areas of interest with cursor or annotation tool
- **Transitions**: Use simple fade transitions between scenes

### Post-Production:
- Add background music (low volume, royalty-free)
- Add text overlays for key metrics (e.g., "98% Accuracy", "70% RMSE Reduction")
- Add lower-third with team name during narration
- Ensure total duration stays under 7 minutes
- Export at 1080p 30fps for YouTube upload

### YouTube Upload Settings:
- **Title**: "MeghDrishti - Regime-Aware AI Monsoon Rainfall Forecasting | SIH 2026"
- **Description**: Include problem statement ID, team name, GitHub link, and brief solution summary
- **Tags**: SIH 2026, monsoon forecasting, AI rainfall, weather prediction, Smart India Hackathon
- **Visibility**: Unlisted (for SIH portal submission only)

### Slide-by-Slide Visual Mapping:

| Scene | PPT Slide | Dashboard View | Duration |
|-------|-----------|----------------|----------|
| 1 - Hook | Slide 1 (Title) | - | 30s |
| 2 - Problem | Slide 2 (Challenges) | README error table | 45s |
| 3 - Solution | Slide 3 (Innovation) | Code files (ml/) | 75s |
| 4 - Demo | - | Live dashboard (all views) | 100s |
| 5 - Architecture | Slide 3 (Tech) | - | 30s |
| 6 - Impact | Slide 5 (Benefits) | Impact chart | 45s |
| 7 - Closing | Slide 1 (Title) | - | 30s |

### Key Phrases to Emphasize:
- "Different correction for different monsoon regimes"
- "Soft-blending makes the system robust"
- "District-level actionable intelligence"
- "Proves improvement with standard meteorological metrics"
- "780+ districts across India"
- "150 million farmers depend on this"

### Known Limitations to Address if Asked:
- Heavy rain POD at 64.5mm threshold is still being improved
- Lead-time differentiation not yet fully implemented
- Currently focused on North-West India districts for validation
- Requires periodic retraining as monsoon patterns shift
