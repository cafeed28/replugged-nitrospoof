import { Injector, common } from "replugged";

import { config, logger, userChanged, userInit } from "./misc";

import {
  addStickerPreview,
  emojiInfo,
  isSendableSticker,
  messageParser,
  premiumInfo,
  shouldAttachSticker,
  stickerInfo,
  stickerPreview,
  stickerSendability,
  users,
} from "./webpack";

import { spoofEmojis } from "./emoji";
import { spoofSticker } from "./sticker";
import { Sticker, StickerFormat, StickerType } from "./types";

const injector = new Injector();

export function start(): void {
  if (config.get("debugMode")) {
    logger.log("messageParser:", messageParser);
    logger.log("emojiInfo:", emojiInfo);
    logger.log("stickerInfo:", stickerInfo);
    logger.log("shouldAttachSticker:", shouldAttachSticker);
    logger.log("stickerSendability:", stickerSendability);
    logger.log("isSendableSticker:", isSendableSticker);
    logger.log("stickerPreview:", stickerPreview);
    logger.log("addStickerPreview:", addStickerPreview);
    logger.log("premiumInfo:", premiumInfo);
    logger.log("users:", users);
  }

  if (!shouldAttachSticker || !isSendableSticker || !addStickerPreview) {
    throw new Error("Failed to find function keys");
  }

  userInit();

  users.addChangeListener(userChanged);

  injector.after(messageParser, "parse", (_, message) => {
    if (config.get("emojiSpoof")) spoofEmojis(message);
    return message;
  });

  // Chat emoji picker
  injector.instead(emojiInfo, "isEmojiFiltered", (args, orig) => {
    if (!config.get("emojiSpoof")) return orig(...args);
    return false;
  });

  injector.instead(emojiInfo, "isEmojiDisabled", (args, orig) => {
    if (!config.get("emojiSpoof")) return orig(...args);
    return false;
  });

  injector.instead(emojiInfo, "isEmojiPremiumLocked", (args, orig) => {
    if (!config.get("emojiSpoof")) return orig(...args);
    return false;
  });

  // Emoji picker tint
  injector.instead(emojiInfo, "getEmojiUnavailableReason", (args, orig) => {
    if (!config.get("emojiSpoof")) return orig(...args);
    return null;
  });

  // Stickers
  injector.instead(stickerInfo, shouldAttachSticker, (args, orig) => {
    if (!config.get("stickerSpoof")) return orig(...args);
    return true;
  });

  injector.instead(stickerSendability, isSendableSticker, (args, orig) => {
    if (!config.get("stickerSpoof")) return orig(...args);
    const sticker = args[0] as Sticker;

    if (sticker.type == StickerType.STANDARD) return true;
    if (sticker.guild_id == common.guilds.getGuildId()) return true;
    if (sticker.format_type == StickerFormat.PNG) return true;
    return false;
  });

  injector.instead(stickerPreview, addStickerPreview, async (args, orig) => {
    if (!config.get("stickerSpoof")) return orig(...args);

    const [channelId, sticker, d] = args;

    const debugMode = config.get("debugMode");

    const spoofed = await spoofSticker(sticker);
    if (debugMode) {
      logger.log("orig:", orig);
    }

    if (!spoofed) {
      orig(channelId, sticker, d);
    }
  });

  // Stream quality
  injector.instead(premiumInfo, "canStreamQuality", (args, orig) => {
    if (!config.get("streamQualityEnable")) return orig(...args);
    return true;
  });
}

export function stop(): void {
  users.removeChangeListener(userChanged);
  injector.uninjectAll();
}

export { Settings } from "./Settings";
