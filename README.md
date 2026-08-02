# The Personality Quiz

A Vite + strictly typed TypeScript + Phaser 3 WebGL adventure. The game avoids exponential map construction with a three-segment treadmill: a player climbs through a small set of reusable biome layouts, locks a choice by physically entering a shrine gate, then crosses an obscured airlock while the next stage is rebuilt from world state.

## Run

```bash
npm install
npm run dev
```

Move with **WASD / arrow keys**. Press **E** at a shrine to awaken its gates, then walk through a gate to make your decision. Press **R** to reset a saved journey.

## Art hand-off

`src/assets/TextureFactory.ts` is the temporary art factory. Replace its generated texture keys with Aseprite atlas exports and replace `TreadmillMap.buildBiome()` with Tiled JSON layer loading without changing game rules, entities, or systems.
