import { Injector, settings } from "replugged";
import { OutgoingMessage } from "replugged/dist/renderer/modules/webpack/common/messages";
import { Config, Emoji } from "./types";
import { EmojiInfo, MessageParser, SelectedGuildStore } from "./webpack";

const injector = new Injector();
const config = await settings.init<Config>("com.cafeed28.NitroSpoof");

const HIDE_TEXT_SPOILERS = "||\u200b||".repeat(199);

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
    const prefix = emoji.animated ? "a" : "";
    const searchString = `<${prefix}:${name}:${emoji.id}>`;

    const size = config.get("emojiSize", 48);
    const extension = emoji.animated ? "gif" : "webp";
    const replaceUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}?size=${size}`; // TODO: ui for this (when replugged settings ui is done)
    const hideLinks = config.get("hideLinks", false);

    if (hideLinks && message.content.length > searchString.length) {
      // Move emoji to the end and hide its link
      message.content = message.content.replace(searchString, "");
      if (!message.content.includes(HIDE_TEXT_SPOILERS)) message.content += HIDE_TEXT_SPOILERS;
      message.content += " " + replaceUrl + " ";
    } else {
      message.content = message.content.replace(searchString, replaceUrl);
    }
  }
}

export function start(): void {
  injector.after(MessageParser, "parse", (args, message) => {
    replaceEmojis(message);
    return message;
  });

  injector.instead(EmojiInfo, "isEmojiDisabled", () => false);
  injector.instead(EmojiInfo, "isEmojiPremiumLocked", () => false);
  injector.instead(EmojiInfo, "getEmojiUnavailableReason", () => null);
}

export function stop(): void {
  injector.uninjectAll();
}
