import { Injector, common } from "replugged";

import { HIDE_TEXT_SPOILERS, config } from "./misc";

import { Emoji, OutgoingMessage, PremiumType, UserFetchResponse } from "./types";
import { User } from "discord-types/general";
import { emojiInfo, messageParser, premiumInfo, userProfileFetch, users } from "./webpack";

const injector = new Injector();

let userPremiumType: PremiumType;

function isEmojiAvailable(emoji: Emoji): boolean {
  // Unicode emoji
  if (emoji.emojiObject) return true;

  // Emoji not available on Discord (e.g. GUILD_SUBSCRIPTION_UNAVAILABLE)
  if (!emoji.available) return false;

  // User has Nitro
  if (userPremiumType != PremiumType.None) return true;

  if (emoji.animated) return false;

  // Note: getGuildId will return null if user is in DMs
  if (emoji.guildId == common.guilds.getGuildId()) return true;

  return false;
}

function replaceEmojis(message: OutgoingMessage): void {
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
    const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}?size=${size}`;

    // Move emoji to the end and hide it's link
    if (hideLinks && message.content.length > search.length) {
      // Remove emoji
      message.content = message.content.replace(search, "");

      // Add spoilers if needed
      if (!message.content.includes(HIDE_TEXT_SPOILERS)) message.content += HIDE_TEXT_SPOILERS;

      // Add emoji
      message.content += ` ${emojiUrl} `;
    } else {
      // Replace emoji with link
      message.content = message.content.replace(search, emojiUrl);
    }
  }
}

let user: User;
let userProfile: UserFetchResponse;
let ready = false;

async function userInit(): Promise<void> {
  user = common.users.getCurrentUser();
  if (user) userProfile = await userProfileFetch(user.id);
  if (userProfile) userPremiumType = userProfile.premium_type ?? PremiumType.None;

  ready = Boolean(user && userProfile);
}

async function userChanged(): Promise<void> {
  const newUser = common.users.getCurrentUser();
  if (!newUser) return;
  if (user && newUser.id == user.id) return;

  await userInit();
}

export async function start(): Promise<void> {
  // using premiumType from common.users.getCurrentUser will broke with plugins like No Nitro Upsell
  await userInit();

  users.addChangeListener(userChanged);

  injector.after(messageParser, "parse", (_, message) => {
    if (ready) replaceEmojis(message);
    return message;
  });

  // Chat emoji picker
  injector.instead(emojiInfo, "isEmojiFiltered", () => false);
  injector.instead(emojiInfo, "isEmojiDisabled", () => false);
  injector.instead(emojiInfo, "isEmojiPremiumLocked", () => false);

  // Emoji picker tint
  injector.instead(emojiInfo, "getEmojiUnavailableReason", () => null);

  // Stream quality
  injector.instead(premiumInfo, "canStreamHighQuality", () => config.get("streamQualityEnable"));
  injector.instead(premiumInfo, "canStreamMidQuality", () => config.get("streamQualityEnable"));
}

export function stop(): void {
  users.removeChangeListener(userChanged);
  injector.uninjectAll();
}

export { Settings } from "./Settings";
