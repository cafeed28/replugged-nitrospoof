import { Injector, common, webpack } from "replugged";
import { EmojiInfo, SelectedGuildStore } from "./webpack";
import { Emoji } from "./types";
import { OutgoingMessage } from "replugged/dist/renderer/modules/webpack/common/messages";

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

function replaceEmojis(message: OutgoingMessage): void {
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
    const replaceUrl = `https://cdn.discordapp.com/emojis/${emoji.id}?size=48`; // TODO: configurable emoji size (when replugged settings is done)

    message.content = message.content.replace(searchString, replaceUrl);
  }
}

export async function start(): Promise<void> {
  const mod = await webpack.waitForModule<{
    uploadFiles: (args: { parsedMessage: OutgoingMessage }) => void;
  }>(webpack.filters.byProps("uploadFiles"));

  injector.before(mod, "uploadFiles", (args) => {
    const message = args[0].parsedMessage;
    replaceEmojis(message);
    return args;
  });

  injector.before(common.messages, "sendMessage", (args) => {
    const [, message] = args;
    replaceEmojis(message);
    return args;
  });

  injector.instead(EmojiInfo, "isEmojiDisabled", () => false);
  injector.instead(EmojiInfo, "isEmojiPremiumLocked", () => false);
  injector.instead(EmojiInfo, "getEmojiUnavailableReason", () => null);
}

export function stop(): void {
  injector.uninjectAll();
}
