import { types } from "replugged";

const patches: types.PlaintextPatch[] = [
  {
    replacements: [
      {
        match: /(\.emojiItemDisabled)/g,
        replace: (_, _prefix, _suffix) => {
          return ".emojiItem";
        },
      },
    ],
  },
];

export default patches;
