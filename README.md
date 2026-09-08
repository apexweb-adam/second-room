# Second Room

An original furniture reuse planning prototype by Ádám Tokár for NextStep Hacks 2026 / Earth Forward. Built September 8, 2026 with AI-assisted implementation by Codex. See public/about.html for the complete methods, privacy, evidence and limitations.

## Run

Node 22.12+: `npm ci`, `npm test`, `npm run dev`. Open http://127.0.0.1:4323. `npm run build` creates the standalone dist site. No credentials or backend required.

## Working behavior

Five procedural furniture objects, two arrangements, orbit/zoom, selection, bounded translations and rotation. Choose Reuse, Repair, Buy new or Leave out; omitted objects leave the scene. Enter repair/replacement amounts, condition, notes and completion. Checklist has transparent budget math, deterministic condition-based suggestions and portable JSON import/export. Completion is self-reported, separately counted and reset when an action changes. All data remains in local storage or downloaded files.

Costs are illustrative user inputs in EUR. No claims of real savings, CO2 reduction, diverted waste, tested school adoption or CAD/safety suitability. Condition suggestions are ordinary rules, not an AI service. Public EEA circular-economy overview supports the general reuse motivation, not a measured outcome of this app.

## Originality and licensing

The Roomcraft renderer/design was created earlier on September 8 as the author's original work sample; it is MIT licensed. Second Room adds a distinct original environmental planning layer the same day, within the event's August 21–September 13 build window. No code is represented as made before/after its actual creation date. The project has not been submitted as a final entry to another event.

MIT: original code/procedural assets, React, React DOM, Three.js and Vite. Manrope: SIL Open Font License served by Google Fonts, system fallback available. The generated design concept is not shipped as the interactive UI or scene. Source dependencies are pinned in package-lock.json.

No billing account, paid plan, real personal data, external service integrations or credential files belong in this repository. Public deployment URL and actual verification are recorded in design/verification.md once checked.
