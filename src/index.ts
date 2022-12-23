import { Injector, common } from "replugged";
import { EmojiInfo, SelectedGuildStore } from "./webpack";
import { Emoji } from "./types";

const injector = new Injector();

// TODO: test with nitro
function isEmojiAvailable(emoji: Emoji): boolean {
  // Emoji not available on Discord (e.g. emoji was in slot 50+ and the server ran out of boosts)
  if (!emoji.available) return false;

  if (emoji.animated) return false;

  // Emoji from the current guild
  // Note: getGuildId will return null if user is in DMs
  if (emoji.guildId == SelectedGuildStore.getGuildId()) return true;

  return false;
}

export function start(): void {
  injector.before(common.messages, "sendMessage", (args) => {
    const [, message] = args;
    const escapedIds: string[] = [];

    for (const match of message.content.matchAll(/\\<(a?):(.*?):(.*?)>/gm)) {
      escapedIds.push(match[3]);
    }

    for (const emoji of message.validNonShortcutEmojis as unknown as Emoji[]) {
      if (escapedIds.includes(emoji.id)) continue;
      if (isEmojiAvailable(emoji)) continue;

      const animated = emoji.animated ? "a" : "";
      const name = emoji.originalName || emoji.name;

      const searchString = `<${animated}:${name}:${emoji.id}>`;

      message.content = message.content.replace(searchString, emoji.url);
    }

    return args;
  });

  injector.instead(EmojiInfo, "getEmojiUnavailableReason", () => {
    return null;
  });

  injector.instead(EmojiInfo, "isEmojiPremiumLocked", () => {
    return false;
  });

  injector.instead(EmojiInfo, "isEmojiDisabled", () => {
    return false;
  });
}

export function stop(): void {
  injector.uninjectAll();
}
