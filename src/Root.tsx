import "./index.css";
import { Composition } from "remotion";
import { BrackifyLaunch } from "./components/BrackifyLaunch";
import { BrackifyLaunchMobile } from "./components/BrackifyLaunchMobile";
import {
  BRACKIFY_NOVA_DURATION,
  BRACKIFY_NOVA_FPS,
  BrackifyLaunchNova,
  BrackifyLaunchNovaMobile,
} from "./components/BrackifyLaunchNova";
import {
  DISCORD_JOIN_PROMO_DURATION,
  DISCORD_JOIN_PROMO_FPS,
  DiscordJoinPromo,
} from "./components/DiscordJoinPromo";
import {
  AFFILIATE_PROMO_DURATION,
  AFFILIATE_PROMO_FPS,
  AffiliatePromo,
} from "./components/AffiliatePromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main Launch Video - 47.5 seconds (1920x1080) */}
      <Composition
        id="BrackifyLaunch"
        component={BrackifyLaunch}
        durationInFrames={1426}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Portrait/Mobile version (1080x1920) */}
      <Composition
        id="BrackifyLaunchMobile"
        component={BrackifyLaunchMobile}
        durationInFrames={1426}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* New separate launch line - Nova */}
      <Composition
        id="BrackifyLaunchNova"
        component={BrackifyLaunchNova}
        durationInFrames={BRACKIFY_NOVA_DURATION}
        fps={BRACKIFY_NOVA_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="BrackifyLaunchNovaMobile"
        component={BrackifyLaunchNovaMobile}
        durationInFrames={BRACKIFY_NOVA_DURATION}
        fps={BRACKIFY_NOVA_FPS}
        width={1080}
        height={1920}
      />
      {/* Discord Join Promo - Portrait/Mobile (1080x1920) */}
      <Composition
        id="DiscordJoinPromo"
        component={DiscordJoinPromo}
        durationInFrames={DISCORD_JOIN_PROMO_DURATION}
        fps={DISCORD_JOIN_PROMO_FPS}
        width={1080}
        height={1920}
      />
      {/* Affiliate Promo - Portrait/Mobile (1080x1920) */}
      <Composition
        id="AffiliatePromo"
        component={AffiliatePromo}
        durationInFrames={AFFILIATE_PROMO_DURATION}
        fps={AFFILIATE_PROMO_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
