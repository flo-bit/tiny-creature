import { Application, Graphics, Renderer } from "pixi.js";
import Eye from "./eye";
import Mouth from "./mouth";

let leftEye: Eye;
let rightEye: Eye;

let mouth: Mouth;

export async function createFaceTexture({
  width = 512,
  height = 512,
}: {
  width?: number;
  height?: number;
}): Promise<{ app: Application<Renderer> }> {
  const app = new Application();

  await app.init({
    width,
    height,
    background: "#db2777",
  });

  rightEye = new Eye({
    x: width * 0.5 + 75,
    y: height * 0.5 + 100,
    size: 50,
  });

  leftEye = new Eye({
    x: width * 0.5 - 75,
    y: height * 0.5 + 100,
    size: 50,
  });

  app.stage.addChild(rightEye.container);
  app.stage.addChild(leftEye.container);

  mouth = new Mouth({
    x: width * 0.5,
    y: height * 0.5 - 20,
    size: 50,
  });
  app.stage.addChild(mouth.container);

  return {
    app,
  };
}

export function updateFace(dt: number, x: number, y: number) {
  leftEye.lookAt(x, y);
  rightEye.lookAt(x, y);

  leftEye.update(dt);
  rightEye.update(dt);
}
