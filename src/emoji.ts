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

  for (const match of message.content.matchAll(/\\<(a?):(.*?):(.*?)>/gm)) {
    escapedIds.push(match[3]);
  }

  const hideLinks = config.get("emojiHideLinks", false);

  for (const emoji of message.validNonShortcutEmojis) {
    if (escapedIds.includes(emoji.id)) continue;
    if (isEmojiAvailable(emoji)) continue;

    const prefix = emoji.animated ? "a" : "";
    const name = emoji.originalName || emoji.name;
    const search = `<${prefix}:${name}:${emoji.id}>`;

    const size = config.get("emojiSize");
    const extension = emoji.animated ? "gif" : config.get("emojiStaticExtension");
    const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}?size=${size}`;

    // Move emoji to the end and hide it's link
    if (hideLinks && message.content.length > search.length) {
      // Remove emoji
      message.content = message.content.replace(search, "");

      // Add spoilers if needed
      if (!message.content.includes(HIDE_TEXT_SPOILERS)) message.content += HIDE_TEXT_SPOILERS;

      // Add emoji
      message.content += ` ${url} `;
    } else {
      // Replace emoji with link
      message.content = message.content.replace(search, url);
    }
  }
}
