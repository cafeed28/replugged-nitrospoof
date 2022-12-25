import { Injector, common, settings } from "replugged";
import { CloudUploader, EmojiInfo, SelectedGuildStore } from "./webpack";
import { Config, Emoji } from "./types";
import { OutgoingMessage } from "replugged/dist/renderer/modules/webpack/common/messages";

const injector = new Injector();
const config = await settings.init<Config>("com.cafeed28.NitroSpoof");

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

    const name = emoji.originalName || emoji.name;
    const animated = emoji.animated ? "a" : "";
    const searchString = `<${animated}:${name}:${emoji.id}>`;

    const size = config.get("emojiSize", 48);
    const replaceUrl = `https://cdn.discordapp.com/emojis/${emoji.id}?size=${size}`; // TODO: ui for this (when replugged settings ui is done)

    message.content = message.content.replace(searchString, replaceUrl);
  }
}

export function start(): void {
  injector.before(CloudUploader, "uploadFiles", (args) => {
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
