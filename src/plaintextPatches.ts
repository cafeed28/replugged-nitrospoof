import { PlaintextPatch } from "replugged/dist/types";

export default [
  {
    // based on Canary 9e0a524
    find: "canStreamQuality:",
    replacements: [
      {
        // Removes all Object.freeze to allow PremiumInfo patching.
        // Also removes enums' Object.freeze but that shouldn't cause any problems?
        match: /Object\.freeze/g,
        replace: "",
      },
    ],
  },
] as PlaintextPatch[];
