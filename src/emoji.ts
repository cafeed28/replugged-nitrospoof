import { common } from "replugged";
import { HIDE_TEXT_SPOILERS, config, userPremiumType } from "./misc";
import { Emoji, OutgoingMessage, PremiumType } from "./types";

function isEmojiAvailable(emoji: Emoji): boolean {
  // Unicode emoji
  if (emoji.emojiObject) return true;

  // Emoji not available on Discord (e.g. GUILD_SUBSCRIPTION_UNAVAILABLE)
  if (!emoji.available) return false;

  // User has Nitro
  if (userPremiumType != PremiumType.NONE) return true;

  if (emoji.animated) return false;

  // Note: getGuildId will return null if user is in DMs
  if (emoji.guildId == common.guilds.getGuildId()) return true;

  return false;
}

export function spoofEmojis(message: OutgoingMessage): void {
  const escapedIds: string[] = [];
  const processedIds: string[] = [];
  const emojiUrls: string[] = [];

  for (const match of message.content.matchAll(/\\<(a?):(.*?):(.*?)>/gm)) {
    escapedIds.push(match[3]);
  }

  for (const emoji of message.validNonShortcutEmojis) {
    if (escapedIds.includes(emoji.id)) continue;
    if (isEmojiAvailable(emoji)) continue;
    if (processedIds.includes(emoji.id)) continue;

    const prefix = emoji.animated ? "a" : "";
    const name = emoji.originalName || emoji.name;
    const search = `<${prefix}:${name}:${emoji.id}>`;

    const size = config.get("emojiSize");
    const extension = emoji.animated ? "gif" : "png";
    const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}?size=${size}`;

    message.content = message.content.replaceAll(search, "");

    processedIds.push(emoji.id);
    emojiUrls.push(url);
  }

  message.content = message.content.trim();

  function hideEmojis() {
    if (message.content.length > 0 && emojiUrls.length > 0) {
      if (!message.content.includes(HIDE_TEXT_SPOILERS)) {
        message.content += HIDE_TEXT_SPOILERS;
      }
    }
  }

  const hideLinks = config.get("emojiHideLinks", false);
  if (hideLinks) {
    // Remove trailing escape symbols
    message.content = message.content.replace(/\\+$/, "").trim();
    hideEmojis();
  }

  for (const url of emojiUrls) {
    message.content += url;
  }
}
