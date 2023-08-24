import { Injector } from "replugged";

import { config, logger, ready, userChanged, userInit } from "./misc";

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

const injector = new Injector();

export async function start(): Promise<void> {
  if (config.get("debugMode")) {
    logger.log("messageParser:", messageParser);
    logger.log("emojiInfo:", emojiInfo);
    logger.log("stickerInfo:", stickerInfo);
    logger.log("stickerSendability:", stickerSendability);
    logger.log("stickerPreview:", stickerPreview);
    logger.log("premiumInfo:", premiumInfo);
    logger.log("users:", users);
  }

  // using premiumType from common.users.getCurrentUser will broke with plugins like No Nitro Upsell
  await userInit();

  users.addChangeListener(userChanged);

  injector.after(messageParser, "parse", (_, message) => {
    if (ready && config.get("emojiSpoof")) spoofEmojis(message);
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
    if (!config.get("stickerSpoof")) return orig(args);
    return true;
  });

  injector.instead(stickerSendability, isSendableSticker, (args, orig) => {
    if (!config.get("stickerSpoof")) return orig(args);
    return true;
  });

  injector.instead(stickerPreview, addStickerPreview, async (args, orig) => {
    if (!config.get("stickerSpoof")) return orig(args);

    const [channelId, sticker, d] = args;

    const debugMode = config.get("debugMode");
    if (debugMode) {
      logger.log("ready:", ready);
    }

    if (ready) {
      const spoofed = await spoofSticker(sticker);
      if (debugMode) {
        logger.log("orig:", orig);
      }

      if (!spoofed) {
        orig(channelId, sticker, d);
      }
    }
  });

  // Stream quality
  injector.instead(premiumInfo, "canStreamHighQuality", (args, orig) => {
    if (!config.get("streamQualityEnable")) return orig(args);
    return true;
  });

  injector.instead(premiumInfo, "canStreamMidQuality", (args, orig) => {
    if (!config.get("streamQualityEnable")) return orig(args);
    return true;
  });
}

export function stop(): void {
  users.removeChangeListener(userChanged);
  injector.uninjectAll();
}

export { Settings } from "./Settings";
