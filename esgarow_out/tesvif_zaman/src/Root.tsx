import React from "react";
import { Composition } from "remotion";
import { Main, FPS, DUR_S } from "./Video";
export const RemotionRoot: React.FC = () => (
  <Composition id="Final2" component={Main} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(DUR_S * FPS)} />
);
