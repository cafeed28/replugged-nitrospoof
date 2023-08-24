import { components, util } from "replugged";
import { config } from "./misc";

const { Category, FormItem, Slider, SwitchItem } = components;

export function Settings(): JSX.Element {
  // TODO: i18n
  return (
    <div>
      <Category title="Emoji" note="Emoji spoofer settings">
        <SwitchItem {...util.useSetting(config, "emojiSpoof", true)} hideBorder>
          Enable emoji spoof
        </SwitchItem>

        <SwitchItem {...util.useSetting(config, "emojiHideLinks", false)} hideBorder>
          Hide emoji links using Discord spoiler bug (199 trailing spoilers)
        </SwitchItem>

        <FormItem title="Emoji Size" style={{ marginBottom: 20 }}>
          <div style={{ marginTop: 20 }}>
            <Slider
              {...util.useSetting(config, "emojiSize", 48)}
              markers={[16, 24, 32, 40, 48, 56, 64, 80, 96]}
              stickToMarkers={true}
              defaultValue={48}
              minValue={16}
              maxValue={96}
              onMarkerRender={(e: number) => {
                return `${e}px`;
              }}
            />
          </div>
        </FormItem>
      </Category>

      <Category title="Sticker" note="Sticker spoofer settings">
        <SwitchItem {...util.useSetting(config, "stickerSpoof", true)} hideBorder>
          Enable sticker spoof
        </SwitchItem>

        <FormItem title="Sticker Size" style={{ marginBottom: 20 }}>
          <div style={{ marginTop: 20 }}>
            <Slider
              {...util.useSetting(config, "stickerSize", 160)}
              markers={[128, 136, 144, 152, 160, 168, 176, 192]}
              stickToMarkers={true}
              defaultValue={160}
              minValue={128}
              maxValue={192}
              onMarkerRender={(e: number) => {
                return `${e}px`;
              }}
            />
          </div>
        </FormItem>
      </Category>

      <Category title="Miscellaneous" note="Miscellaneous settings">
        <SwitchItem {...util.useSetting(config, "streamQualityEnable")} hideBorder>
          Spoof stream quality (Use at your own risk! May lead to account ban)
        </SwitchItem>
        <SwitchItem {...util.useSetting(config, "debugMode")} hideBorder>
          Enable verbose logging in console
        </SwitchItem>
      </Category>
    </div>
  );
}
