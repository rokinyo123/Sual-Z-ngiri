import React from "react";
import { Composition } from "remotion";
import { FlowMain, FPS4, DUR4 } from "./Flow";
export const RemotionRoot: React.FC = () => (
  <Composition id="Final" component={FlowMain} width={1080} height={1920} fps={FPS4} durationInFrames={Math.round(DUR4 * FPS4)} />
);
