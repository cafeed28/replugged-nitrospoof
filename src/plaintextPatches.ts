import { PlaintextPatch } from "replugged/dist/types";

export default [
  {
    // based on Canary df4e5b4
    find: "canStreamHighQuality:function",
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
