import React from "react";
import { Composition } from "remotion";
import { Main, FPS, DUR_S } from "./Video";
import { FlowMain, FPS4, DUR4 } from "./Flow";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Final2" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(DUR_S * FPS)} />
    <Composition id="Final4" component={FlowMain} width={1080} height={1920} fps={FPS4} durationInFrames={Math.round(DUR4 * FPS4)} />
  </>
);
